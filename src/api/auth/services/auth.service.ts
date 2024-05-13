import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { User } from '@/api/user/models';
import { userRepository } from '@/api/user/repositories/user.repository';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { env } from '@/common/utils/env-config.util';
import { logger } from '@/config/logger.config';

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
