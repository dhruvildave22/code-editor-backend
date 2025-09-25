const UserService = require('../services/user-service');
const { BaseClientError } = require('../errors');

async function loginUser(req, res, next) {
  try {
    const { body } = req;
    const result = await UserService.authenticate(body);
    res.json(result);
  } catch (err) {
    // If it's a custom client error, let the error handler deal with it
    if (err instanceof BaseClientError) {
      return next(err);
    }

    // Handle legacy error messages for backward compatibility
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
}

async function createModerator(req, res, next) {
  try {
    const { body } = req;
    const candidate = await UserService.createModerator(body);
    res
      .status(201)
      .json({ message: 'Moderator created successfully', candidate });
  } catch (err) {
    if (err instanceof BaseClientError) {
      return next(err);
    }

    next(err);
  }
}
async function createCandidate(req, res, next) {
  try {
    const { body } = req;
    const candidate = await UserService.createCandidate(body);
    res
      .status(201)
      .json({ message: 'Candidate created successfully', candidate });
  } catch (err) {
    if (err instanceof BaseClientError) {
      return next(err);
    }

    next(err);
  }
}

module.exports = {
  loginUser,
  createCandidate,
  createModerator,
};
