import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { UserSchema } from '@/api/user/schemas';
import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { RequestHeaderSchema } from '@/common/schemas/request.schema';
import { validateAccessToken, validateRequest } from '@/common/utils/http-handlers.util';

import { authController } from '../controllers/auth.controller';
import { SignUpSchema } from '../schemas/sign-up.schema';

export const authRegistry = new OpenAPIRegistry();

authRegistry.register('Auth', UserSchema);

export const authRouter: Router = (() => {
  const router = Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/signup',
    tags: ['Auth'],
    request: RequestHeaderSchema,
    requestBody: {
      content: {
        'application/json': {
          example: {
            email: 'jrobin@example.com',
            password: 'vy%Y0*y949ML]6',
            repeatPassword: 'vy%Y0*y949ML]6',
          },
        },
      },
    },
    responses: createApiResponses([
      {
        schema: UserSchema,
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
      {
        schema: z.null(),
        statusCode: StatusCodes.CONFLICT,
      },
    ]),
  });
  router.post('/signup', validateAccessToken, validateRequest(SignUpSchema), authController.signUp);

  return router;
})();
