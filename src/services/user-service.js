const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repos/user-repository');
const {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} = require('../errors');
const sendEmail = require('../utils/email/sendEmail');
const { generateTemporaryPasswordHash } = require('../utils/passwords');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

class UserService {
  async register({ email, role, first_name, last_name }) {
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

    const { password: temporaryPassword, hash: password_hash } =
      await generateTemporaryPasswordHash();

    const user = await UserRepository.create({
      first_name,
      last_name,
      email,
      password_hash,
      role,
      active: false,
    });

    sendEmail(
      email,
      'New Account created',
      {
        email,
        temporaryPassword,
      },
      './template/welcome.handlebars'
    );

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
}

module.exports = new UserService();
