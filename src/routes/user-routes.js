const {
  loginUser,
  createCandidate,
  createModerator,
} = require('../controllers/user-controller');
const {
  authenticate,
  adminOrModeratorAuth,
  adminAuth,
} = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const {
  loginSchema,
  createCandidateSchema,
  createModeratorSchema,
} = require('../validations/user-validation');

module.exports = app => {
  app.post(
    '/api/users/moderators',
    authenticate,
    adminAuth,
    validate(createModeratorSchema),
    createModerator
  );
  app.post('/api/users/login', validate(loginSchema), loginUser);
  app.post(
    '/api/users/candidates',
    authenticate,
    adminOrModeratorAuth,
    validate(createCandidateSchema),
    createCandidate
  );
};
