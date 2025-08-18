// User model definition
class User {
  constructor({
    id,
    email,
    password_hash,
    role,
    active,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.active = active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;
