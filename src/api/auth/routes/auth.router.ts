import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { z } from 'zod';

import { UserSchema } from '@/api/user/schemas';
import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { passportAuthenticate } from '@/common/middleware/auth.middleware';
import { Module } from '@/common/models/module.model';
import { Method } from '@/common/models/route.model';
import { RequestHeaderSchema } from '@/common/schemas/request.schema';
import { env } from '@/common/utils/env-config.util';
import { validateAccessToken, validateRequest } from '@/common/utils/http-handlers.util';

import { authController } from '../controllers/auth.controller';
import { AddInviteSchema } from '../schemas/add-invite.schema';
import { LoginSuccessSchema, LogoutSchema, SignInSchema, UserSignedInSchema } from '../schemas/sign-in.schema';
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
            email: env.TEST_EMAIL,
            password: env.TEST_PASSWORD,
            repeatPassword: env.TEST_PASSWORD,
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
            email: env.TEST_EMAIL,
            password: env.TEST_PASSWORD,
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

  router.get('/login/failed', (_req, res) => {
    res.redirect(`${env.FRONTEND_URL}/auth/failed`);
  });

  authRegistry.registerPath({
    method: Method.GET,
    path: '/api/auth/login/success',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: LoginSuccessSchema,
        statusCode: StatusCodes.OK,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.UNAUTHORIZED,
      },
    ]),
  });
  router.get('/login/success', authController.loginSuccess);

  authRegistry.registerPath({
    method: Method.GET,
    path: '/api/auth/logout',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: LogoutSchema,
        statusCode: StatusCodes.OK,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    ]),
  });
  router.get('/logout', authController.logout);

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login/failed', successRedirect: env.FRONTEND_URL })
  );

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
  router.get('/check-session', passportAuthenticate, authController.checkSession);

  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/add-invite',
    tags: [Module.AUTH],
    request: RequestHeaderSchema,
    requestBody: {
      content: {
        'application/json': {
          example: {
            email: env.TEST_EMAIL,
          },
        },
      },
    },
    responses: createApiResponses([
      {
        schema: z.string(),
        statusCode: StatusCodes.CREATED,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.CONFLICT,
      },
      {
        schema: z.null(),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    ]),
  });
  router.post('/add-invite', validateAccessToken, validateRequest(AddInviteSchema), authController.addInvite);

  return router;
})();
