import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_super_secret_quemelo';

export function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export function getUserIdFromRequest(req: NextRequest): number | null {
  const cookie = req.cookies.get('quemelo_auth');
  if (!cookie?.value) return null;
  
  const decoded = verifyToken(cookie.value);
  return decoded ? decoded.userId : null;
}
