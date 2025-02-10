import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}
