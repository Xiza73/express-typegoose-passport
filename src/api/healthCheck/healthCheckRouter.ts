import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { ModulePath } from '@/common/models';
import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { handleServiceResponse } from '@/common/utils/http-handlers.util';

export const healthCheckRegistry = new OpenAPIRegistry();

export const healthCheckRouter: Router = (() => {
  const router = express.Router();

  healthCheckRegistry.registerPath({
    method: 'get',
    path: ModulePath.HEALTH_CHECK,
    tags: ['Health Check'],
    responses: createApiResponses([
      {
        schema: z.null(),
        statusCode: StatusCodes.OK,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    ]),
  });
  router.get('/', (_req: Request, res: Response) => {
    const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
