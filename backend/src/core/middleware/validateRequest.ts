import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

type RequestPart = 'body' | 'query' | 'params';

export const validateRequest =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = (req as any)[part];
    const result = schema.safeParse(data);

    if (!result.success) {
      return next(new AppError('Validation error', 400, result.error.flatten()));
    }

    (req as any)[part] = result.data;
    next();
  };
