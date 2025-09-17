const { z } = require('zod');

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'candidate'], {
    errorMap: () => ({ message: 'Role must be either admin or candidate' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  body: registerSchema.omit({ role: true }),
  params: z.object({
    roleType: z.enum(['admin', 'candidate'], {
      errorMap: () => ({ message: 'Role must be either admin or candidate' }),
    }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  createUserSchema,
};
