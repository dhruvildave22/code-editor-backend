const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repos/user-repository');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 10;

class UserService {
  async register({ email, password, role }) {
    if (!['admin', 'candidate'].includes(role)) {
      throw new Error('Invalid user type');
    }
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserRepository.create({
      email,
      password_hash,
      role,
      active: true
    });
    return user;
  }

  async authenticate({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.active) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { token, role: user.role };
  }
}

module.exports = new UserService();
