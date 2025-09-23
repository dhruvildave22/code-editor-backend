const {
  registerUser,
  loginUser,
  createCandidatesFromExcel,
  authenticate,
  moderatorAuth,
  createCandidate,
} = require('../controllers/user-controller');
const { adminOrModeratorAuth } = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const {
  registerSchema,
  loginSchema,
  createCandidateSchema,
} = require('../validations/user-validation');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
    '/api/users/candidate/bulk',
    authenticate,
    moderatorAuth,
    upload.single('file'),
    createCandidatesFromExcel
  );
};
