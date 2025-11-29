import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../modules/users/application/user.service';
import { AppError } from '../../core/errors/AppError';

const userService = new UserService();

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await userService.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
