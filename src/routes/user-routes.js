const { registerUser, loginUser } = require('../controllers/user-controller');
const validate = require('../middlewares/validation-middleware');
const {
  loginSchema,
  moderatorSchema,
} = require('../validations/user-validation');

module.exports = app => {
  app.post(
    '/api/users/register/moderator',
    validate(moderatorSchema),
    (req, res, next) => {
      req.body.role = 'moderator';
      next();
    },
    registerUser
  );
  app.post('/api/users/login', validate(loginSchema), loginUser);
};
