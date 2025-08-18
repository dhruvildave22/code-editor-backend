require('dotenv').config();

/** @type {import('knex').Knex.Config} */
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' }
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' }
  }
};