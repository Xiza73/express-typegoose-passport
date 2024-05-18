import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '@/api/user/models';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
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

  loginSuccess: async (req: Request, res: Response): Promise<void> => {
    const { user } = req;

    const serviceResponse = await authService.loginSuccess(user as User);

    handleServiceResponse(serviceResponse, res);
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    req.logout((err) => {
      if (err) {
        handleServiceResponse(
          new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', null, StatusCodes.UNAUTHORIZED),
          res
        );

        return;
      }
    });

    handleServiceResponse(new ServiceResponse(ResponseStatus.Success, 'User logged out', null, StatusCodes.OK), res);
    return;
  },

  addInvite: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const serviceResponse = await authService.addInvite(email);

    handleServiceResponse(serviceResponse, res);
  },

  checkSession: async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Session is active' });
  },
};
