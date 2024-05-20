import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { User } from '@/api/user/models';
import { userRepository } from '@/api/user/repositories/user.repository';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { env } from '@/common/utils/env-config.util';
import { logger } from '@/config/logger.config';

import { inviteRepository } from '../repositories/invite.repository';

export const authService = {
  signUp: async (email: string, password: string, repeatPassword: string): Promise<ServiceResponse<User | null>> => {
    try {
      if (password !== repeatPassword)
        return new ServiceResponse(ResponseStatus.Failed, 'Passwords do not match', null, StatusCodes.BAD_REQUEST);

      const user = await userRepository.findByEmail(email);
      if (user)
        return new ServiceResponse(ResponseStatus.Failed, 'Email is already in use', null, StatusCodes.CONFLICT);

      const newUser = await userRepository.create(email, password);

      return new ServiceResponse<User>(ResponseStatus.Success, 'User created', newUser, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  signIn: async (email: string, password: string): Promise<ServiceResponse<(User & { token: string }) | null>> => {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);

      const isPasswordValid = user.validPassword(password);
      if (!isPasswordValid)
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid password', null, StatusCodes.UNAUTHORIZED);

      const token = authService.createToken(user._id.toString());

      return new ServiceResponse<User & { token: string }>(
        ResponseStatus.Success,
        'User signed in',
        Object.assign(user.toObject(), { token }),
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error signing in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  signInGoogle: async (googleId: string) => {
    try {
      if (!googleId)
        return new ServiceResponse(ResponseStatus.Failed, 'Google ID not found', null, StatusCodes.BAD_REQUEST);

      const user = await userRepository.findByGoogleId(googleId);
      if (!user) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);

      const token = authService.createToken(user._id.toString());

      return new ServiceResponse<User & { token: string }>(
        ResponseStatus.Success,
        'User signed in',
        Object.assign(user.toObject(), { token }),
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error signing in with Google: ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  loginSuccess: async (user?: User): Promise<ServiceResponse<User | null>> => {
    if (!user) return new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', null, StatusCodes.UNAUTHORIZED);

    return await authService.signInGoogle(user.google.id);
  },

  addInvite: async (email: string): Promise<ServiceResponse<string | null>> => {
    try {
      const existInvite = await inviteRepository.find(email);
      if (existInvite)
        return new ServiceResponse(ResponseStatus.Failed, 'Invite already exists', null, StatusCodes.CONFLICT);

      const savedInvite = await inviteRepository.create(email);

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        'Invite created',
        savedInvite._id.toString(),
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating invite: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createToken: (id: string) => {
    return jwt.sign(
      {
        id,
      },
      env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
  },
};
