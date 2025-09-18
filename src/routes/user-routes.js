const { ROLES } = require('../constants/roles');
const {
  registerUser,
  loginUser,
  createCandidateUser,
} = require('../controllers/user-controller');
const {
  authenticateToken,
  authorize,
} = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const {
  registerSchema,
  loginSchema,
  createCandidateSchema,
} = require('../validations/user-validation');

module.exports = app => {
  app.post('/api/users/register', validate(registerSchema), registerUser);
  app.post('/api/users/login', validate(loginSchema), loginUser);
  app.post(
    '/api/users/candidate',
    authenticateToken,
    authorize(ROLES.MODERATOR),
    validate(createCandidateSchema),
    createCandidateUser
  );
};
