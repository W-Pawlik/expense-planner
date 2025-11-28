import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../types/auth.types';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as RegisterInput;
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as LoginInput;
    const result = await authService.login(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
