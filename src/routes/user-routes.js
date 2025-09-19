const {
  registerUser,
  loginUser,
  createCandidateUser,
  createCandidatesFromExcel,
} = require('../controllers/user-controller');
const {
  authenticate,
  moderatorAuth,
} = require('../middlewares/auth-middleware');
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
    '/api/users/candidate',
    authenticate,
    moderatorAuth,
    validate(createCandidateSchema),
    createCandidateUser
  );
  app.post(
    '/api/users/candidate/bulk',
    authenticate,
    moderatorAuth,
    upload.single('file'),
    createCandidatesFromExcel
  );
};
