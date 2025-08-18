const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Zod parse throws an error if validation fails
      const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: error.errors[0].message 
        });
      }
      
      // Handle other errors
      return res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  };
};

module.exports = validate;
