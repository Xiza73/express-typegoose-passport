import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

import { User } from '@/api/user/models';
import { userRepository } from '@/api/user/repositories/user.repository';

import { ResponseStatus, ServiceResponse } from '../models/service-response.model';
import { getLoggedUser } from '../utils/auth.util';
import { handleServiceResponse } from '../utils/http-handlers.util';

export const jwtAuthenticate = () => {
  return passport.authenticate('jwt', {
    session: false,
    passReqToCallback: true,
  });
};

export const googleAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  const userFound = await userRepository.findByGoogleId((req.user as User).google.id);
  if (!userFound)
    return handleServiceResponse(
      new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND),
      res
    );

  req.userAuth = userFound;
  return next();
};

export const passportAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) return googleAuthenticate(req, res, next);

  return jwtAuthenticate()(req, res, next);
};

export const addUserToRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.userAuth) return next();

    const userFound = await getLoggedUser(req);
    if (!userFound)
      return handleServiceResponse(
        new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND),
        res
      );

    req.userAuth = userFound;
    next();
  } catch (error) {
    next();
  }
};
