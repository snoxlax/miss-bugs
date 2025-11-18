import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';

const USERS_PATH = fileURLToPath(
  new URL('../../data/users.json', import.meta.url)
);
const SALT_ROUNDS = 10;
const cryptr = new Cryptr(process.env.CRYPTER_SECRET || '123456');

function createLoginToken(user) {
  const userStr = JSON.stringify(user);
  const encryptedStr = cryptr.encrypt(userStr);
  return encryptedStr;
}

function validateToken(token) {
  try {
    const jsonStr = cryptr.decrypt(token);
    const currentUser = JSON.parse(jsonStr);
    return currentUser;
  } catch (err) {
    console.log('Invalid login token');
  }
  return null;
}

function login({ username, password }) {
  const users = _getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function signup({ username, fullname, password }) {
  const users = _getUsers();
  if (users.some((u) => u.username === username)) {
    throw new Error('Username already exists');
  }
  const _id = randomUUID();
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  const newUser = {
    _id,
    username,
    fullname,
    password: hashedPassword,
    score: 0,
  };
  users.push(newUser);
  _saveUsers(users);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

function _getUsers() {
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
}

function _saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

export const authService = {
  login,
  signup,
  createLoginToken,
  validateToken,
};
