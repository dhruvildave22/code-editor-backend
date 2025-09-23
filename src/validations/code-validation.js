const { z } = require('zod');

const executeCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Code cannot be empty')
    .max(10000, 'Code cannot exceed 10,000 characters'),
  language: z
    .string()
    .min(1, 'Language is required')
    .refine(
      lang =>
        ['javascript', 'python', 'ruby', 'c', 'cpp', 'java'].includes(
          lang.toLowerCase()
        ),
      {
        message:
          'Language must be one of: javascript, python, ruby, c, cpp, java',
      }
    ),
});

module.exports = {
  executeCodeSchema,
};
