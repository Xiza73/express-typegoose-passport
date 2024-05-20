import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { userRepository } from '@/api/user/repositories/user.repository';

import { env } from './env-config.util';

export const getLoggedUser = async (req: Request) => {
  const token = getBearerToken(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userFound = await userRepository.findById(payload.id);
  if (!userFound) return null;

  return userFound;
};

export function getBearerToken(req: any): string | null {
  const authorizationHeader = req.headers['authorization'];

  if (authorizationHeader && typeof authorizationHeader === 'string') {
    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer') return tokenParts[1];
  }

  return null;
}

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as any;
  } catch (error) {
    return null;
  }
};
