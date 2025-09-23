const { z } = require('zod');

const moderatorSchema = z.object({
  email: z.string().email('Invalid email format'),
  first_name: z.string().min(4, 'First name is required'),
  last_name: z.string().min(4, 'Last name is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  moderatorSchema,
  loginSchema,
};
