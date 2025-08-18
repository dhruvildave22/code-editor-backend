const zodErrorMiddleware = (err, req, res, next) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(error => ({
        path: error.path.join('.'),
        message: error.message
      }))
    });
  }
  next(err);
};

module.exports = { zodErrorMiddleware };
