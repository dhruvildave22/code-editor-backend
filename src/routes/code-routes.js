const {
  executeCode,
  getSupportedLanguages,
} = require('../controllers/code-controller');
const validate = require('../middlewares/validation-middleware');
const { executeCodeSchema } = require('../validations/code-validation');

module.exports = app => {
  app.post('/api/code/execute', validate(executeCodeSchema), executeCode);
  app.get('/api/code/languages', getSupportedLanguages);
};
