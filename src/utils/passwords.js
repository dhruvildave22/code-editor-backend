const crypto = require('crypto');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

function generateRandomString(length = 8) {
  const size = length / 2;
  return crypto.randomBytes(size).toString('hex');
}

async function generateHash(value) {
  return await bcrypt.hash(value, SALT_ROUNDS);
}

async function generateTemporaryPasswordHash() {
  const password = generateRandomString();
  const hash = await generateHash(password);
  return {
    password,
    hash,
  };
}

module.exports = {
  generateRandomString,
  generateTemporaryPasswordHash,
  generateHash,
};
