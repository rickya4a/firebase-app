import { db } from '../config/firebaseConfig';
import { User, UpdateUserDto } from '@ebuddy/shared';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export class UserRepository {
  private collection = db.collection('USERS');

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  async getUserById(userId: string): Promise<User | null> {
    const doc = await this.collection.doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await this.collection.doc(userId).update(updateData);
    const updated = await this.getUserById(userId);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async login(email: string, password: string) {
    try {
      const snapshot = await this.collection
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Invalid credentials');
      }

      const doc = snapshot.docs[0];
      const userData = doc.data();

      const isValid = await bcrypt.compare(password, userData.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(doc.id);
      const { password: _, ...userWithoutPassword } = userData;

      return {
        user: { id: doc.id, ...userWithoutPassword } as User,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }
}

export const userRepository = new UserRepository();

// Test the hash generation and comparison
const testHash = async () => {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('New hash:', hash);

  const isValid = await bcrypt.compare(password, hash);
  console.log('Test valid:', isValid);
  return hash;
};

// Run this and use the generated hash in your Firestore
testHash().then(hash => console.log('Use this hash:', hash));