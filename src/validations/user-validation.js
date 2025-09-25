const { z } = require('zod');

const createModeratorSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(3, 'First name is required'),
  lastName: z.string().min(3, 'Last name is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const createCandidateSchema = z.object({
  firstName: z.string().min(3, 'First name is required'),
  lastName: z.string().min(3, 'Last name is required'),
  email: z.email('Invalid email format'),
});

module.exports = {
  createModeratorSchema,
  loginSchema,
  createCandidateSchema,
};
