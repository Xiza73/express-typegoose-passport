import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { userRepository } from '@/api/user/repositories/user.repository';
import { app } from '@/config/server.config';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

import * as authMiddleware from '../middleware/auth.middleware';
import * as authUtil from '../utils/auth.util';
import { env } from '../utils/env-config.util';

vi.mock('@/config/logger.config', () => ({
  ...vi.importActual('@/config/logger.config'),
  logger: {
    error: vi.fn(),
  },
}));

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
  json: vi.fn(),
} as unknown as Response;

const next = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthMiddleware', () => {
  describe('addUserToRequest', () => {
    it('should return a 404 response if user is not found', async () => {
      // Arrange
      const token = getToken();

      const req = {
        userAuth: null,
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as Request;

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User not found',
        responseObject: null,
        statusCode: 404,
        success: false,
      });
    });

    it('should return a 401 response if token is invalid', async () => {
      // Arrange
      const req = {
        userAuth: null,
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as unknown as Request;

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User not found',
        responseObject: null,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
      });
    });

    it('should call next if there is an error', async () => {
      // Arrange
      const token = getToken();

      const req = {
        userAuth: null,
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as Request;

      vi.spyOn(authUtil, 'getLoggedUser').mockRejectedValue(new Error('Error'));

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return not found if user is not found', async () => {
      // Arrange
      const req = {
        userAuth: null,
        headers: {},
      } as unknown as Request;

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User not found',
        responseObject: null,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
      });
    });

    it('should return not found if user is not found in the database', async () => {
      // Arrange
      const token = await getToken();

      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as Request;

      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User not found',
        responseObject: null,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
      });
    });

    it('should call next', async () => {
      // Arrange
      const req = {
        userAuth: {
          email: env.TEST_EMAIL,
        },
      } as unknown as Request;

      // Act
      await authMiddleware.addUserToRequest(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });
  });

  describe('googleAuthenticate', () => {
    it('should call next', async () => {
      // Arrange
      const userGoogle = {
        google: {
          id: '123',
          name: 'Alice',
          email: env.TEST_EMAIL,
        },
      };
      const user = await userRepository.createGoogleUser(userGoogle.google);

      const req = {
        user,
      } as unknown as Request;

      // Act
      await authMiddleware.googleAuthenticate(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return a 404 response if user is not found', async () => {
      // Arrange
      const req = {
        user: {
          google: {
            id: '123',
          },
        },
      } as unknown as Request;

      // Act
      await authMiddleware.googleAuthenticate(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User not found',
        responseObject: null,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
      });
    });
  });

  describe('passportAuthenticate', () => {
    it('should call googleAuthenticate if user exists', async () => {
      // Arrange
      const userGoogle = {
        google: {
          id: '123',
          name: 'Alice',
          email: env.TEST_EMAIL,
        },
      };
      const user = await userRepository.createGoogleUser(userGoogle.google);

      const req = {
        user,
        userAuth: {
          email: env.TEST_EMAIL,
        },
      } as unknown as Request;

      // Act
      await authMiddleware.passportAuthenticate(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });
  });
});

const getToken = async () => {
  try {
    const reqCreate = {
      body: {
        email: env.TEST_EMAIL,
        password: env.TEST_PASSWORD,
        repeatPassword: env.TEST_PASSWORD,
      },
    } as unknown as Request;

    await request(app)
      .post('/api/auth/signup')
      .send(reqCreate.body as string | object | undefined)
      .set('accesstoken', env.ACCESS_TOKEN);

    const reqSignIn = {
      body: {
        email: env.TEST_EMAIL,
        password: env.TEST_PASSWORD,
      },
    } as unknown as Request;

    const signInResponse = await request(app)
      .post('/api/auth/signin')
      .send(reqSignIn.body as string | object | undefined);

    const token = signInResponse.body.responseObject.token;

    return token;
  } catch (error) {
    return null;
  }
};
