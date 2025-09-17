/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create ENUM type for role if it doesn't exist
  await knex.raw(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM ('admin', 'candidate');
      END IF;
    END $$;
  `);

  // Create users table
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable();
    table.string('last_name');
    table.string('email').notNullable().unique(); // Email as username
    table.string('password_hash').notNullable();
    table
      .enu('role', ['admin', 'candidate'], {
        useNative: true,
        enumName: 'role',
        existingType: true, // if role type already exists use existing one
      })
      .notNullable();
    table.boolean('active').notNullable().defaultTo(true); // User active status
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop users table first (since it depends on the role enum)
  await knex.schema.dropTableIfExists('users');

  // Then drop enum type
  await knex.raw('DROP TYPE IF EXISTS role;');
};
