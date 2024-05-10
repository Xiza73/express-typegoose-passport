import { Request, Response } from 'express';
import { env } from 'process';

import { validateAccessToken } from '../http-handlers.util';

const req = {
  headers: {
    accesstoken: env.ACCESS_TOKEN,
  },
} as unknown as Request;

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
} as unknown as Response;

const next = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('HttpHandlersUtil', () => {
  describe('validateAccessToken', () => {
    it('should call next if access token is valid', () => {
      // Act
      validateAccessToken(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should send a failed response if access token is missing', () => {
      // Arrange
      req.headers = {};

      // Act
      validateAccessToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized: Access token is missing or invalid.',
        responseObject: null,
        statusCode: 401,
      });
    });

    it('should send a failed response if access token is invalid', () => {
      // Arrange
      req.headers = { accesstoken: 'invalid' };

      // Act
      validateAccessToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized: Access token is missing or invalid.',
        responseObject: null,
        statusCode: 401,
      });
    });
  });
});
