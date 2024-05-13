import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { userRepository } from '@/api/user/repositories/user.repository';
import { env } from '@/common/utils/env-config.util';
import { logger } from '@/config/logger.config';
import { app } from '@/config/server.config';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

vi.mock('@/config/logger.config', () => ({
  ...vi.importActual('@/config/logger.config'),
  logger: {
    error: vi.fn(),
  },
}));

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('AuthRouter', () => {
  describe('POST /api/auth/signup', () => {
    it('should return a success response for valid input', async () => {
      // Arrange
      const req = {
        body: {
          email: 'jrobin@example.com',
          password: 'passW123@',
          repeatPassword: 'passW123@',
        },
      } as unknown as Request;

      // Act
      const response = await request(app)
        .post('/api/auth/signup')
        .send(req.body as string | object | undefined)
        .set('accesstoken', env.ACCESS_TOKEN);

      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User created');
      expect(responseBody.responseObject.local.email).toEqual('jrobin@example.com');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should return a success response for valid input', async () => {
      // Arrange
      const req = {
        body: {
          email: 'jrobin@example.com',
          password: 'passW123@',
        },
      } as unknown as Request;

      await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'jrobin@example.com',
          password: 'passW123@',
          repeatPassword: 'passW123@',
        })
        .set('accesstoken', env.ACCESS_TOKEN);

      // Act
      const response = await request(app)
        .post('/api/auth/signin')
        .send(req.body as string | object | undefined);
      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User signed in');
      expect(responseBody.responseObject.local.email).toEqual('jrobin@example.com');
    });
  });

  describe('POST /api/auth/check-session', () => {
    it('should return a success response for valid input', async () => {
      // Arrange
      const token = await getToken();

      // Act
      const response = await request(app).get('/api/auth/check-session').set('Authorization', `Bearer ${token}`);
      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.message).toContain('Session is active');
    });

    it('should return an unauthorized response for invalid input', async () => {
      // Act
      const response = await request(app).get('/api/auth/check-session');

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it('should log passport exception', async () => {
      // Arrange
      const token = await getToken();

      vi.spyOn(userRepository, 'findById').mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).get('/api/auth/check-session').set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenNthCalledWith(1, 'Database error');
    });

    it('should return unauthorized when not found a user', async () => {
      // Arrange
      const token = await getToken();

      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act
      const response = await request(app).get('/api/auth/check-session').set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });
  });
});

const getToken = async () => {
  const reqCreate = {
    body: {
      email: 'jrobin@example.com',
      password: 'passW123@',
      repeatPassword: 'passW123@',
    },
  } as unknown as Request;

  await request(app)
    .post('/api/auth/signup')
    .send(reqCreate.body as string | object | undefined)
    .set('accesstoken', env.ACCESS_TOKEN);

  const reqSignIn = {
    body: {
      email: 'jrobin@example.com',
      password: 'passW123@',
    },
  } as unknown as Request;

  const signInResponse = await request(app)
    .post('/api/auth/signin')
    .send(reqSignIn.body as string | object | undefined);

  const token = signInResponse.body.responseObject.token;

  return token;
};
