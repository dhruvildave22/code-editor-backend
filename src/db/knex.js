const knexFn = require('knex');
const { Model } = require('objection');
require('dotenv').config();

const knex = knexFn({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
});

Model.knex(knex);

module.exports = knex;
