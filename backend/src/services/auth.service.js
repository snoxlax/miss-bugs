import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';
import { userService } from './user.service.js';

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

async function login({ username, password }) {
  try {
    const user = await userService.findByUsername(username);

    if (!user) return null;

    const isPasswordValid =
      user.password === password ||
      (user.password.startsWith('$2') &&
        (await bcrypt.compare(password, user.password)));

    if (!isPasswordValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (err) {
    console.error('Login error:', err);
    return null;
  }
}

async function signup({ username, fullname, password }) {
  try {
    const existingUser = await userService.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const newUser = await userService.create({
      username,
      fullname,
      password: hashedPassword,
      score: 0,
      isAdmin: false,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}

export const authService = {
  login,
  signup,
  createLoginToken,
  validateToken,
};
