const {
  registerUser,
  loginUser,
  createCandidateUser,
} = require('../controllers/user-controller');
const { authorize } = require('../middlewares/auth-middleware');
const { validateCandidateUser } = require('../middlewares/users');
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
    authorize(['admin']),
    validateCandidateUser(createCandidateSchema),
    createCandidateUser
  );
};
