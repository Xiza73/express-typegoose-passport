import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ModulePath } from '@/common/models';
import { handleServiceResponse, validateRequest } from '@/common/utils/http-handlers.util';

import { ExampleSchema, GetExampleSchema } from './exampleModel';
import { exampleService } from './exampleService';

export const exampleRegistry = new OpenAPIRegistry();

exampleRegistry.register('Example', ExampleSchema);

export const exampleRouter: Router = (() => {
  const router = express.Router();

  exampleRegistry.registerPath({
    method: 'get',
    path: ModulePath.EXAMPLES,
    tags: ['Example'],
    responses: createApiResponse(z.array(ExampleSchema)),
  });
  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await exampleService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  exampleRegistry.registerPath({
    method: 'get',
    path: `${ModulePath.EXAMPLES}/{id}`,
    tags: ['Example'],
    request: { params: GetExampleSchema.shape.params },
    responses: createApiResponse(ExampleSchema),
  });
  router.get('/:id', validateRequest(GetExampleSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await exampleService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
