const bcrypt = require('bcrypt');
require('dotenv').config();

/**
 * @param { import('knex').Knex } knex
 */
exports.seed = async function seedCreateAdminUser(knex) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await knex('users').where({ email: adminEmail }).first();
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await knex('users').insert({
    email: adminEmail,
    first_name: 'Admin',
    last_name: 'User',
    password_hash: passwordHash,
    role: 'admin',
    active: true,
  });
};
