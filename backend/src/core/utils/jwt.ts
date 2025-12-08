import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
}

type ExpiresIn = SignOptions['expiresIn'];

export const signJwt = (
  payload: JwtPayload,
  expiresIn: ExpiresIn = env.jwtExpiresIn as ExpiresIn,
): string => {
  const options: SignOptions = {};
  if (expiresIn !== undefined) {
    options.expiresIn = expiresIn;
  }
  return jwt.sign(payload, env.jwtSecret as string, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret as string) as unknown as JwtPayload;
};
