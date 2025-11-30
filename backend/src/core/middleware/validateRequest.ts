import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

type RequestPart = 'body' | 'query' | 'params';

export const validateRequest =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = part === 'body' ? req.body : part === 'query' ? req.query : req.params;

    const result = schema.safeParse(data);

    if (!result.success) {
      return next(new AppError('Validation error', 400, result.error.flatten()));
    }

    if (part === 'body') {
      (req as any).body = result.data;
    }

    if (part === 'query') {
      (req as any).validatedQuery = result.data;
    }

    if (part === 'params') {
      (req as any).validatedParams = result.data;
    }

    next();
  };
