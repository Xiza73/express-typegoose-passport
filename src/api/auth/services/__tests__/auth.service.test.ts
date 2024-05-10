import { userRepository } from '@/api/user/repositories';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

import { authService } from '../auth.service';

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('AuthService', () => {
  describe('sign up', () => {
    it('should return a success response for valid input', async () => {
      // Arrange
      const validInput = {
        email: 'jrobin@example.com',
        password: 'pass123@',
        repeatPassword: 'pass123@',
      };

      // Act
      const response = await authService.signUp(validInput.email, validInput.password, validInput.repeatPassword);

      // Assert
      expect(response.success).toBeTruthy();
      expect(response.message).toContain('User created');
      expect(response.responseObject).toHaveProperty('id');
      expect(response.responseObject?.local.email).toEqual(validInput.email);
    });

    it('should return a bad request for password mismatch', async () => {
      // Arrange
      const invalidInput = {
        email: 'jrobin@example.com',
        password: 'pass123@',
        repeatPassword: 'pass123',
      };

      // Act
      const response = await authService.signUp(invalidInput.email, invalidInput.password, invalidInput.repeatPassword);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('Passwords do not match');
      expect(response.statusCode).toEqual(400);
    });

    it('should return a conflict for existing email', async () => {
      // Arrange
      const existingEmail = 'jrobin@example.com';
      const validInput = {
        email: existingEmail,
        password: 'pass123@',
        repeatPassword: 'pass123@',
      };

      // Act
      await authService.signUp(validInput.email, validInput.password, validInput.repeatPassword);
      const response = await authService.signUp(validInput.email, validInput.password, validInput.repeatPassword);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('Email is already in use');
      expect(response.statusCode).toEqual(409);
    });

    it('should return an internal server error for unexpected error', async () => {
      // Arrange
      const validInput = {
        email: 'jrobin@example.com',
        password: 'pass123@',
        repeatPassword: 'pass123@',
      };
      vi.spyOn(userRepository, 'create').mockRejectedValue('Mocked error');

      // Act
      const response = await authService.signUp(validInput.email, validInput.password, validInput.repeatPassword);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('Error creating user');
      expect(response.statusCode).toEqual(500);
    });
  });
});
