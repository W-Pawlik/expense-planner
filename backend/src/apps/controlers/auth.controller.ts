import { Request, Response, NextFunction } from 'express';
import { authService } from '../../modules/auth/application/auth.service';
import { RegisterInput, LoginInput } from '../../modules/auth/domain/auth.types';

const authorizationService = new authService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as RegisterInput;
    const result = await authorizationService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as LoginInput;
    const result = await authorizationService.login(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
