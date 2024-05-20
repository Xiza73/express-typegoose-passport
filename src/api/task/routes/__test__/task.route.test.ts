import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { env } from '@/common/utils/env-config.util';
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

// test for task route
describe('TaskRouter', () => {
  describe('POST /api/task', () => {
    it('should return a success response for valid input', async () => {
      // Arrange
      const token = await getToken();

      const req = {
        body: {
          title: 'Task 1',
          description: 'Description of Task 1',
        },
      } as unknown as Request;

      // Act
      const response = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${token}`)
        .send(req.body as string | object | undefined);

      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Task created');
      expect(responseBody.responseObject.title).toEqual('Task 1');
    });

    it('should return a bad request response for invalid input', async () => {
      // Arrange
      const token = await getToken();

      const req = {
        body: {
          title: 'Task 1',
        },
      } as unknown as Request;

      // Act
      const response = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${token}`)
        .send(req.body as string | object | undefined);

      const responseBody = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
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
