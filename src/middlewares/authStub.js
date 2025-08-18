const authStub = (req, res, next) => {
  // This is a stub auth middleware - replace with real authentication later
  // For now, just pass through all requests
  next();
};

module.exports = { authStub };
