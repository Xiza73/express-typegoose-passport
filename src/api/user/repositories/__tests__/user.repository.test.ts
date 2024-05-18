import { userRepository } from '@/api/user/repositories/user.repository';
import { env } from '@/common/utils/env-config.util';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

// test setup
beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('UserRepository', () => {
  describe('findByGoogleId', () => {
    it('should return a user for a valid google id', async () => {
      // Arrange
      await createTestGoogleUser();

      // Act
      const user = await userRepository.findByGoogleId('google123');

      // Assert
      expect(user).not.toBeNull();
      expect(user?.google.id).toEqual('google123');
    });
  });

  describe('createGoogleUser', () => {
    it('should create a new google user', async () => {
      // Arrange
      const newUser = {
        id: 'google123',
        email: env.TEST_EMAIL,
        name: 'Test User',
      };

      // Act
      const user = await createTestGoogleUser(newUser);

      // Assert
      expect(user).not.toBeNull();
      expect(user?.google.id).toEqual(newUser.id);
      expect(user?.google.email).toEqual(newUser.email);
      expect(user?.google.name).toEqual(newUser.name);
    });
  });
});

const createTestGoogleUser = async (
  user: { id: string; email: string; name: string } = {
    id: 'google123',
    email: env.TEST_EMAIL,
    name: 'Test User',
  }
) => {
  return await userRepository.createGoogleUser(user);
};
