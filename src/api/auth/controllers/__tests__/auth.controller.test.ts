import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/common/utils/env-config.util';

import { authController } from '../auth.controller';

vi.mock('../../services/auth.service', () => ({
  authService: {
    signUp: vi.fn(() => ({
      success: true,
      message: 'User created',
      responseObject: {
        id: '1234567890',
        local: {
          email: env.TEST_EMAIL,
        },
      },
      statusCode: StatusCodes.CREATED,
    })),

    signIn: vi.fn(() => ({
      success: true,
      message: 'User created',
      responseObject: {
        id: '1234567890',
        local: {
          email: env.TEST_EMAIL,
        },
      },
      statusCode: StatusCodes.CREATED,
    })),

    loginSuccess: vi.fn((user) => ({
      success: true,
      message: 'User signed in',
      responseObject: user,
      statusCode: StatusCodes.OK,
    })),

    addInvite: vi.fn(() => ({
      success: true,
      message: 'Invite created',
      responseObject: {},
      statusCode: StatusCodes.CREATED,
    })),

    checkSession: vi.fn(() => ({
      success: true,
      message: 'Session is active',
      responseObject: {},
      statusCode: StatusCodes.OK,
    })),
  },
}));

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
  json: vi.fn(),
} as unknown as Response;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthController', () => {
  describe('sign up', () => {
    it('should send a success response for valid input', async () => {
      // Arrange
      const req = {
        body: {
          email: env.TEST_EMAIL,
          password: env.TEST_PASSWORD,
          repeatPassword: env.TEST_PASSWORD,
        },
      } as unknown as Request;

      // Act
      await authController.signUp(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'User created',
        responseObject: {
          id: expect.any(String),
          local: {
            email: env.TEST_EMAIL,
          },
        },
        statusCode: StatusCodes.CREATED,
      });
    });
  });

  describe('sign in', () => {
    it('should send a success response for valid input', async () => {
      // Arrange
      const req = {
        body: {
          email: env.TEST_EMAIL,
          password: env.TEST_PASSWORD,
        },
      } as unknown as Request;

      // Act
      await authController.signIn(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'User created',
        responseObject: {
          id: expect.any(String),
          local: {
            email: env.TEST_EMAIL,
          },
        },
        statusCode: StatusCodes.CREATED,
      });
    });
  });

  describe('check session', () => {
    it('should send a success response', async () => {
      // Arrange
      const req = {} as unknown as Request;

      // Act
      await authController.checkSession(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Session is active',
        responseObject: null,
        statusCode: StatusCodes.OK,
      });
    });
  });

  describe('logout', () => {
    it('should send a success response', async () => {
      // Arrange
      const req = {
        logout: vi.fn((callback: (err?: Error) => void) => {
          callback();
        }),
      } as unknown as Request;

      // Act
      await authController.logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'User logged out',
        responseObject: null,
        statusCode: StatusCodes.OK,
      });
    });

    it('should send an unauthorized response', async () => {
      // Arrange
      const req = {
        logout: vi.fn((callback: (err: Error) => void) => {
          callback(new Error('Unauthorized'));
        }),
      } as unknown as Request;

      // Act
      await authController.logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
        responseObject: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });
  });

  describe('add invite', () => {
    it('should send a success response for valid input', async () => {
      // Arrange
      const req = {
        body: {
          email: env.TEST_EMAIL,
        },
      } as unknown as Request;

      // Act
      await authController.addInvite(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Invite created',
        responseObject: expect.any(Object),
        statusCode: StatusCodes.CREATED,
      });
    });
  });

  describe('login success', () => {
    it('should send a success response for valid user', async () => {
      // Arrange
      const req = {
        user: {
          _id: '123',
          local: {
            email: env.TEST_EMAIL,
          },
        },
      } as unknown as Request;

      // Act
      await authController.loginSuccess(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'User signed in',
        responseObject: {
          _id: '123',
          local: {
            email: env.TEST_EMAIL,
          },
        },
        statusCode: StatusCodes.OK,
      });
    });
  });
});
