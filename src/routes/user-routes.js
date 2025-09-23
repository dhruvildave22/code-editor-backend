const {
  registerUser,
  loginUser,
  createCandidatesFromSheet,
  createCandidate,
} = require('../controllers/user-controller');
const {
  authenticate,
  adminOrModeratorAuth,
} = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const {
  registerSchema,
  loginSchema,
  createCandidateSchema,
  bulkCandidateCreateSchema,
} = require('../validations/user-validation');
const {
  validateCandidateFile,
} = require('../middlewares/validation-bulk-candidate');

module.exports = app => {
  app.post('/api/users/register', validate(registerSchema), registerUser);
  app.post('/api/users/login', validate(loginSchema), loginUser);
  app.post(
    '/api/users/candidates',
    authenticate,
    adminOrModeratorAuth,
    validate(createCandidateSchema),
    createCandidate
  );
  app.post(
    '/api/users/candidates/bulk',
    authenticate,
    adminOrModeratorAuth,
    validateCandidateFile(bulkCandidateCreateSchema),
    createCandidatesFromSheet
  );
};
