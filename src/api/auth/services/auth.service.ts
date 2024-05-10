import { StatusCodes } from 'http-status-codes';

import { User } from '@/api/user/models';
import { userRepository } from '@/api/user/repositories';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
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
};
