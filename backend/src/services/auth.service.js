import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';

// Debug: Log path information to see what's happening
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== AUTH SERVICE PATH DEBUG ===');
console.log('Current working directory (process.cwd()):', process.cwd());
console.log('This file location (import.meta.url):', import.meta.url);
console.log('This file directory (__dirname):', __dirname);
console.log('Simple relative path: data/users.json');
console.log(
  'Resolved path from file:',
  path.resolve(__dirname, '../../data/users.json')
);
console.log(
  'File exists at simple path (data/users.json):',
  fs.existsSync('data/users.json')
);
console.log(
  'File exists at relative path from cwd (../../data/users.json):',
  fs.existsSync('../../data/users.json')
);
console.log(
  'File exists at resolved path from file location:',
  fs.existsSync(path.resolve(__dirname, '../../data/users.json'))
);
console.log('================================');

// Test with simple relative path first
const USERS_PATH = 'data/users.json';
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
