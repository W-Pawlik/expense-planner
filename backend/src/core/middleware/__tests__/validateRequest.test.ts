import { z } from 'zod';
import { validateRequest } from '../validateRequest';
import { AppError } from '../../errors/AppError';

describe('validateRequest middleware', () => {
  test('dla query ustawia validatedQuery', () => {
    const schema = z.object({ page: z.coerce.number().int().min(1) });

    const req: any = { query: { page: '2' } };
    const res: any = {};
    const next = jest.fn();

    validateRequest(schema, 'query')(req, res, next);

    expect(req.validatedQuery).toEqual({ page: 2 });
    expect(next).toHaveBeenCalledWith();
  });

  test('przy błędzie walidacji przekazuje AppError do next()', () => {
    const schema = z.object({ page: z.coerce.number().int().min(1) });

    const req: any = { query: { page: '0' } };
    const res: any = {};
    const next = jest.fn();

    validateRequest(schema, 'query')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 400 });
  });
});
