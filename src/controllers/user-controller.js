const UserService = require('../services/user-service');

async function registerUser(req, res, next) {
  try {
    const { body } = req
    const user = await UserService.register(body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({ error: err.message });
    }
    if (err.message === 'Invalid user type') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { body } = req
    const result = await UserService.authenticate(body);
    res.json(result);
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
};
