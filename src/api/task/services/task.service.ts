import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repositories/user.repository';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { logger } from '@/config/logger.config';

import { Task } from '../models/task.model';
import { taskRepository } from '../repositories/task.repository';

export const taskService = {
  create: async (title: string, description: string, userId?: string): Promise<ServiceResponse<Task | null>> => {
    try {
      if (!userId)
        return new ServiceResponse(ResponseStatus.Failed, 'User ID is required', null, StatusCodes.BAD_REQUEST);

      const user = await userRepository.findById(userId);
      if (!user) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);

      const newTask = await taskRepository.create(title, description, user._id);

      return new ServiceResponse<Task>(ResponseStatus.Success, 'Task created', newTask, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
