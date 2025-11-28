import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
}

type ExpiresIn = SignOptions['expiresIn'];

export const signJwt = (payload: JwtPayload, expiresIn: ExpiresIn = '1h' as ExpiresIn): string => {
  const options: SignOptions = expiresIn !== undefined ? { expiresIn } : {};
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
