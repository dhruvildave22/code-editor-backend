const { ZodError } = require('zod');

const validateUser = schema => {
  return async (req, res, next) => {
    try {
      // 1. Validate first
      const validatedData = schema.parse({
        body: { ...req.body, password: 'temporary-password' }, // Temporarily set password to first_name for validation
        params: req.params,
      });

      // 2. Put cleaned values back
      req.body = validatedData.body;
      req.params = validatedData.params;

      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];
        if (issues.length > 0) {
          return res.status(400).json({
            error: issues[0].message,
            details: issues,
          });
        } else {
          return res.status(400).json({
            error: 'Validation failed',
            details: error.message || 'Unknown validation error',
          });
        }
      }

      // Handle other errors
      console.error('Non-Zod validation error:', error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
};

module.exports = {
  validateUser,
};
