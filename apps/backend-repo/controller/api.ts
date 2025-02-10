import { Request, Response } from 'express';
import { userRepository } from '../repository/userCollection';
import { mostPotentialUserRepository } from '../repository/mostPotentialUserCollection';
import { UpdateUserDto } from '@ebuddy/shared';
import { AuthRequest } from '../types/request';
import { db } from '../config/firebaseConfig';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await userRepository.login(email, password);
    return res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const updateData: UpdateUserDto = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const updatedUser = await userRepository.updateUser(userId, updateData);
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user data' });
  }
};

export const fetchUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const user = await userRepository.getAllUsers();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
};


export const getTopPotentialUsers = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const lastDocId = req.query.lastDocId as string;

    let lastDoc;
    if (lastDocId) {
      lastDoc = await db.collection('USERS').doc(lastDocId).get();
      if (!lastDoc.exists) {
        return res.status(404).json({ error: 'Last document reference not found' });
      }
    }

    const users = await mostPotentialUserRepository.getTopPotentialUsers(limit, lastDoc);

    return res.json({
      users: users.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      lastDocId: users.docs.length ? users.docs[users.docs.length - 1].id : null
    });
  } catch (error) {
    console.error('Failed to fetch top potential users:', error);
    return res.status(500).json({ error: 'Failed to fetch top potential users' });
  }
};