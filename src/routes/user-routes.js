const { registerUser, loginUser } = require('../controllers/user-controller');
const validate = require('../middlewares/validation-middleware');
const {
  registerSchema,
  loginSchema,
} = require('../validations/user-validation');

module.exports = app => {
  app.post('/api/users/register', validate(registerSchema), registerUser);
  app.post('/api/users/login', validate(loginSchema), loginUser);
};
