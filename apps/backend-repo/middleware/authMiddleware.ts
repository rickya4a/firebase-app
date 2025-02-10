import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest, TokenPayload } from '../types/request';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = verifyToken(token) as TokenPayload;
    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};