const express = require('express');
const { zodErrorMiddleware } = require('./middlewares/zodError');
const { authStub } = require('./middlewares/authStub');
const registerRoutes = require('./routes');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(authStub); // replace with real auth later

registerRoutes(app);

app.use(zodErrorMiddleware);
const errorHandler = require('./middlewares/error-handler');
app.use(errorHandler);

module.exports = app;
