import { DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { db } from '../config/firebaseConfig';

interface User {
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number;
  compositeScore?: number;
}

export class PotentialUserRepository {
  private readonly collection = db.collection('USERS');

  private calculateCompositeScore = (user: User): number => {
    const now = Date.now() / 1000;
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    const normalizedRating = user.totalAverageWeightRatings / 5;
    const normalizedRents = Math.log(user.numberOfRents + 1) / Math.log(101);
    const normalizedRecency = Math.max(0, 1 - ((now - user.recentlyActive) / thirtyDaysInSeconds));

    return (normalizedRating * 0.5) +
           (normalizedRents * 0.3) +
           (normalizedRecency * 0.2);
  };

  public getTopPotentialUsers = async (
    limit = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<QuerySnapshot> => {
    let query = this.collection
      .where('compositeScore', '>', 0)
      .orderBy('compositeScore', 'desc')
      .limit(limit);

    return lastDoc ? query.startAfter(lastDoc).get() : query.get();
  };

  public updateCompositeScores = async (): Promise<void> => {
    const snapshot = await this.collection.get();
    const batches = [];
    let batch = db.batch();
    let count = 0;

    snapshot.docs.forEach(doc => {
      const userData = doc.data() as User;
      batch.update(doc.ref, {
        compositeScore: this.calculateCompositeScore(userData)
      });

      if (++count % 500 === 0) {
        batches.push(batch.commit());
        batch = db.batch();
      }
    });

    if (count % 500) batches.push(batch.commit());
    await Promise.all(batches);
  };
}

export const mostPotentialUserRepository = new PotentialUserRepository();