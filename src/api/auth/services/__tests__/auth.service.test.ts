import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repositories/user.repository';
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
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
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
      expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
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
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('sign in', () => {
    const validInput = {
      email: 'jrobin@example.com',
      password: 'pass123@',
    };

    it('should return a success response for valid input', async () => {
      // Arrange
      await authService.signUp(validInput.email, validInput.password, validInput.password);

      // Act
      const response = await authService.signIn(validInput.email, validInput.password);

      // Assert
      expect(response.success).toBeTruthy();
      expect(response.message).toContain('User signed in');
      expect(response.responseObject).toHaveProperty('_id');
      expect(response.responseObject?.local.email).toEqual(validInput.email);
      expect(response.responseObject?.token).toBeDefined();
    });

    it('should return a not found for non-existing user', async () => {
      // Arrange
      const nonExistingEmail = 'jrobin2@example.com';
      await authService.signUp(validInput.email, validInput.password, validInput.password);

      // Act
      const response = await authService.signIn(nonExistingEmail, validInput.password);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('User not found');
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it('should return an unauthorized for invalid password', async () => {
      // Arrange
      const invalidPassword = 'pass1234@';
      await authService.signUp(validInput.email, validInput.password, validInput.password);

      // Act
      const response = await authService.signIn(validInput.email, invalidPassword);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('Invalid password');
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it('should return an internal server error for unexpected error', async () => {
      // Arrange
      await authService.signUp(validInput.email, validInput.password, validInput.password);
      vi.spyOn(userRepository, 'findByEmail').mockRejectedValue('Mocked error');

      // Act
      const response = await authService.signIn(validInput.email, validInput.password);

      // Assert
      expect(response.success).toBeFalsy();
      expect(response.message).toContain('Error signing in');
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
