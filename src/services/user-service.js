const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repos/user-repository');
const {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} = require('../errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 10;

class UserService {
  async register({ email, password, role }) {
    if (!['admin', 'candidate', 'moderator'].includes(role)) {
      throw new BadRequestError('Invalid user type', 'INVALID_USER_TYPE');
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(
        'Email already registered',
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserRepository.create({
      email,
      password_hash,
      role,
      active: true,
    });
    return user;
  }

  async authenticate({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.active) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { token, role: user.role };
  }

  async createCandidate(payload) {
    const { email, firstName, lastName } = payload;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(
        'Email already registered',
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    const candidate = await UserRepository.create({
      email,
      password_hash: passwordHash,
      role: 'candidate',
      firstName,
      lastName,
      active: true,
    });
    return { candidate, tempPassword };
  }
}

module.exports = new UserService();
