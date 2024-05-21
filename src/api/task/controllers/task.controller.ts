import { Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/http-handlers.util';
import { getUserId } from '@/common/utils/request.util';

import { taskService } from '../services/task.service';

export const taskController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body;

    const serviceResponse = await taskService.create(title, description, getUserId(req));

    handleServiceResponse(serviceResponse, res);
  },

  list: async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, title } = req.query;

    const serviceResponse = await taskService.list(getUserId(req), {
      page: Number(page),
      limit: Number(limit),
      title: title as string,
    });

    handleServiceResponse(serviceResponse, res);
  },
};
