import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { UserSchema } from '@/api/user/schemas';
import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { passAuth } from '@/common/middleware/auth.middleware';
import { Module } from '@/common/models/module.model';
import { Method } from '@/common/models/route.model';
import { RequestHeaderSchema } from '@/common/schemas/request.schema';
import { validateAccessToken, validateRequest } from '@/common/utils/http-handlers.util';

import { authController } from '../controllers/auth.controller';
import { SignInSchema, UserSignedInSchema } from '../schemas/sign-in.schema';
import { SignUpSchema } from '../schemas/sign-up.schema';

export const authRegistry = new OpenAPIRegistry();

authRegistry.register(Module.AUTH, UserSchema);

export const authRouter: Router = (() => {
  const router = Router();

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth/signup',
    tags: [Module.AUTH],
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

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth/signin',
    tags: [Module.AUTH],
    requestBody: {
      content: {
        'application/json': {
          example: {
            email: 'jrobin@example.com',
            password: 'vy%Y0*y949ML]6',
          },
        },
      },
    },
    responses: createApiResponses([
      {
        schema: UserSignedInSchema,
        statusCode: StatusCodes.OK,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.NOT_FOUND,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.UNAUTHORIZED,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    ]),
  });
  router.post('/signin', validateRequest(SignInSchema), authController.signIn);

  authRegistry.registerPath({
    method: 'get',
    path: '/api/auth/check-session',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: z.object({
          message: z.string(),
        }),
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/check-session', passAuth('jwt'), authController.checkSession);

  return router;
})();
