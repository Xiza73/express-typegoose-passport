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
import { ListTasksResponseSchema, ListTasksSchema } from '../schemas/list-tasks.schema';
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

  taskRegistry.registerPath({
    method: Method.GET,
    path: '/api/task',
    tags: [Module.TASK],
    parameters: [
      {
        in: 'query',
        name: 'page',
        schema: {
          type: 'number',
          format: 'int32',
          minimum: 1,
          default: 1,
        },
        required: false,
      },
      {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'number',
          format: 'int32',
          minimum: 1,
          default: 10,
        },
        required: false,
      },
      {
        in: 'query',
        name: 'title',
        schema: {
          type: 'string',
          minLength: 1,
        },
        required: false,
      },
    ],
    responses: createApiResponses([
      {
        schema: ListTasksResponseSchema,
        statusCode: StatusCodes.OK,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    ]),
  });
  router.get('/', passportAuthenticate, validateRequest(ListTasksSchema), addUserToRequest, taskController.list);

  return router;
})();
