const knex = require('../../db/knex');
const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    const user = await knex('users').where({ email }).first();
    return user ? new User(user) : null;
  }

  async create(userData) {
    const [user] = await knex('users')
      .insert(userData)
      .returning('*');
    return new User(user);
  }

  async findById(id) {
    const user = await knex('users').where({ id }).first();
    return user ? new User(user) : null;
  }

  async update(id, updates) {
    const [user] = await knex('users')
      .where({ id })
      .update(updates)
      .returning('*');
    return user ? new User(user) : null;
  }
}

module.exports = new UserRepository();
