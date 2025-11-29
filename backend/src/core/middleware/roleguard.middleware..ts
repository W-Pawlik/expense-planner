import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const roleGuard =
  (...roles: Array<'USER' | 'ADMIN'>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
