import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { verifyJwt } from '../utils/jwt';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = header.substring('Bearer '.length);

  try {
    const payload = verifyJwt(token);
    (req as any).user = payload;
    next();
  } catch {
    next(new AppError('Invalid token', 401));
  }
};
