const { z } = require('zod');

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'candidate', 'moderator'], {
    errorMap: () => ({
      message: 'Role must be either admin, candidate or moderator',
    }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const createCandidateSchema = z.object({
  body: registerSchema.omit({ role: true, password: true }),
});

module.exports = {
  registerSchema,
  loginSchema,
  createCandidateSchema,
};
