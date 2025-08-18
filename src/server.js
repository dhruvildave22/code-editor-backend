const app = require('./app');
const knex = require('./db/knex');
require('dotenv').config();

const port = Number(process.env.PORT || 5555);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

(async () => {
  try {
    await knex.raw('select 1');
    console.log('DB connected');
  } catch (e) {
    console.error('DB connection failed', e);
  }
})();
