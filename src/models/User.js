// User model definition
class User {
  constructor({
    id,
    email,
    first_name,
    last_name,
    password_hash,
    role,
    active,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password_hash = password_hash;
    this.role = role;
    this.active = active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;
