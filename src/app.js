const express = require('express');
const healthRouter = require('./routes/health');
const { zodErrorMiddleware } = require('./middlewares/zodError');
const { authStub } = require('./middlewares/authStub');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(authStub); // replace with real auth later

app.use('/health', healthRouter);
require('./routes/user-routes')(app);

app.use(zodErrorMiddleware);
const errorHandler = require('./middlewares/error-handler');
app.use(errorHandler);

module.exports = app;