const {
  registerUser,
  loginUser,
  createUser,
} = require('../controllers/user-controller');
const { validateUser } = require('../middlewares/users');
const validate = require('../middlewares/validation-middleware');
const {
  registerSchema,
  loginSchema,
  createUserSchema,
} = require('../validations/user-validation');

module.exports = app => {
  app.post('/api/users/register', validate(registerSchema), registerUser);
  app.post('/api/users/login', validate(loginSchema), loginUser);
  app.post('/api/users/:roleType', validateUser(createUserSchema), createUser);
};
