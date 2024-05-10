import mongoose from 'mongoose';
import { z } from 'zod';

export const commonValidations = {
  id: z
    .string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' })
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),

  _id: z
    .string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' })
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid ID'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(3, 'Email must be at least 3 characters long')
    .max(255, 'Email must be at most 255 characters long')
    .email('Invalid email address'),

  password: z
    .string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
};
