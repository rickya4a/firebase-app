import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};