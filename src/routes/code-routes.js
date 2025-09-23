const {
  executeCode,
  getSupportedLanguages,
} = require('../controllers/code-controller');
const {
  authenticate,
  authorize,
  candidateAuth,
} = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const { executeCodeSchema } = require('../validations/code-validation');

module.exports = app => {
  app.post(
    '/api/code/execute',
    authenticate,
    candidateAuth,
    validate(executeCodeSchema),
    executeCode
  );
  app.get(
    '/api/code/languages',
    authenticate,
    authorize,
    getSupportedLanguages
  );
};
