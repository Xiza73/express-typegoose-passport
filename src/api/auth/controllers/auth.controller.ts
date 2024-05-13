import { Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/http-handlers.util';

import { authService } from '../services/auth.service';

export const authController = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const { email, password, repeatPassword } = req.body;

    const serviceResponse = await authService.signUp(email, password, repeatPassword);

    handleServiceResponse(serviceResponse, res);
  },

  signIn: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const serviceResponse = await authService.signIn(email, password);

    handleServiceResponse(serviceResponse, res);
  },

  checkSession: async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Session is active' });
  },
};
