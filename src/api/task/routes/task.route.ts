import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { addUserToRequest, passportAuthenticate } from '@/common/middleware/auth.middleware';
import { Module } from '@/common/models/module.model';
import { Method } from '@/common/models/route.model';
import { validateRequest } from '@/common/utils/http-handlers.util';

import { taskController } from '../controllers/task.controller';
import { CreateTaskSchema } from '../schemas/create-task.schema';
import { TaskSchema } from '../schemas/task.schema';

export const taskRegistry = new OpenAPIRegistry();

taskRegistry.register(Module.TASK, TaskSchema);

export const taskRouter: Router = (() => {
  const router = Router();

  taskRegistry.registerPath({
    method: Method.POST,
    path: '/api/task',
    tags: [Module.TASK],
    requestBody: {
      content: {
        'application/json': {
          example: {
            title: 'Task 1',
            description: 'Description of Task 1',
          },
        },
      },
    },
    responses: createApiResponses([
      {
        schema: TaskSchema,
        statusCode: StatusCodes.CREATED,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.BAD_REQUEST,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.UNAUTHORIZED,
      },
    ]),
  });
  router.post('/', passportAuthenticate, validateRequest(CreateTaskSchema), addUserToRequest, taskController.create);

  return router;
})();
