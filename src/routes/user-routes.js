const { registerUser, loginUser } = require('../controllers/user-controller');

module.exports = (app) => {
  app.post('/api/users/register', registerUser);
  app.post('/api/users/login', loginUser);
};
