import { Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/http-handlers.util';

import { taskService } from '../services/task.service';

export const taskController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body;

    const serviceResponse = await taskService.create(title, description, req.userAuth?._id.toString());

    handleServiceResponse(serviceResponse, res);
  },
};
