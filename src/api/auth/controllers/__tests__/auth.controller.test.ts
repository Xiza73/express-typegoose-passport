// tests for the auth controller
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authController } from '../auth.controller';

vi.mock('../../services/auth.service', () => ({
  authService: {
    signUp: vi.fn(() => ({
      success: true,
      message: 'User created',
      responseObject: {
        id: '1234567890',
        local: {
          email: 'jrobin@example.com',
        },
      },
      statusCode: StatusCodes.CREATED,
    })),
  },
}));

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
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
          email: 'jrobin@example.com',
          password: 'pass123@',
          repeatPassword: 'pass123@',
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
            email: 'jrobin@example.com',
          },
        },
        statusCode: StatusCodes.CREATED,
      });
    });
  });
});
