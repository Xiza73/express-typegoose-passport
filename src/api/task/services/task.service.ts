import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import { StatusCodes } from 'http-status-codes';
import { Document, Types } from 'mongoose';

import { userRepository } from '@/api/user/repositories/user.repository';
import { emptyListResponse, ListResponse } from '@/common/models/list.model';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { logger } from '@/config/logger.config';

import { TaskStatus } from '../interfaces/status.interface';
import { Task } from '../models/task.model';
import { taskRepository } from '../repositories/task.repository';

type TaskReturnType = Document<unknown, BeAnObject, Task> &
  Omit<
    Task & {
      _id: Types.ObjectId;
    },
    'typegooseName'
  > &
  IObjectWithTypegooseFunction;
type TaskServiceResponse = ServiceResponse<TaskReturnType | null>;

export const taskService = {
  create: async (title: string, description: string, userId?: string): Promise<TaskServiceResponse> => {
    try {
      if (!userId)
        return new ServiceResponse(ResponseStatus.Failed, 'User ID is required', null, StatusCodes.BAD_REQUEST);

      const user = await userRepository.findById(userId);
      if (!user) return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);

      const newTask = await taskRepository.create(title, description, user._id);

      return new ServiceResponse<TaskReturnType>(ResponseStatus.Success, 'Task created', newTask, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  list: async (
    userId: string,
    filters: {
      page: number;
      limit: number;
      title?: string;
    }
  ): Promise<ServiceResponse<ListResponse<Task>>> => {
    try {
      const { tasks, total } = await taskRepository.list(userId, filters);

      return new ServiceResponse<ListResponse<Task>>(
        ResponseStatus.Success,
        'Tasks retrieved',
        {
          data: tasks,
          total,
          pages: Math.ceil(total / filters.limit),
          page: filters.page,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error listing tasks: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        emptyListResponse,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  get: async (taskId: string): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await taskRepository.findById(taskId);

      if (!task) return new ServiceResponse(ResponseStatus.Failed, 'Task not found', null, StatusCodes.NOT_FOUND);

      return new ServiceResponse<Task>(ResponseStatus.Success, 'Task retrieved', task, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error retrieving task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  update: async (
    taskId: string,
    title: string,
    description: string,
    status: TaskStatus
  ): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await taskRepository.update(taskId, title, description, status);

      if (!task) return new ServiceResponse(ResponseStatus.Failed, 'Task not found', null, StatusCodes.NOT_FOUND);

      return new ServiceResponse<Task>(ResponseStatus.Success, 'Task updated', task, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  delete: async (taskId: string): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await taskRepository.delete(taskId);

      if (!task) return new ServiceResponse(ResponseStatus.Failed, 'Task not found', null, StatusCodes.NOT_FOUND);

      return new ServiceResponse<Task>(ResponseStatus.Success, 'Task deleted', task, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
