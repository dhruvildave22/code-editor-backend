const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repos/user-repository');
const { ConflictError, UnauthorizedError } = require('../errors');
const sendEmail = require('../utils/email/sendEmail');
const { generateTemporaryPasswordHash } = require('../utils/passwords');
const { ROLES } = require('../constants/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

class UserService {
  async createModerator(payload) {
    const { firstName, lastName, email } = payload;
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
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash,
      role: ROLES.MODERATOR,
      active: false,
    });

    sendEmail(
      email,
      'Welcome Moderator',
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

  async createCandidate(payload) {
    const { email, firstName, lastName } = payload;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(
        'Email already registered',
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const { password: temporaryPassword, hash: passwordHash } =
      await generateTemporaryPasswordHash();

    const candidate = await UserRepository.create({
      email,
      password_hash: passwordHash,
      role: ROLES.CANDIDATE,
      first_name: firstName,
      last_name: lastName,
      active: false,
    });

    sendEmail(
      email,
      'Welcome Candidate',
      {
        email,
        temporaryPassword,
      },
      './template/welcome.handlebars'
    );

    return candidate;
  }
}

module.exports = new UserService();
