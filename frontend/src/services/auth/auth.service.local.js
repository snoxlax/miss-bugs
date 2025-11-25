const USERS_KEY = 'userDB';
const LOGGEDIN_KEY = 'loggedinUser';

function _getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function _saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(credentials) {
  const users = _getUsers();
  const user = users.find(
    u =>
      u.username === credentials.username && u.password === credentials.password
  );
  if (!user) throw new Error('Invalid credentials');
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem(LOGGEDIN_KEY, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export async function signup(credentials) {
  const users = _getUsers();
  if (users.some(u => u.username === credentials.username)) {
    throw new Error('Username already exists');
  }
  const _id = 'u' + Math.floor(Math.random() * 1000000);
  const newUser = { _id, ...credentials, score: 0 };
  users.push(newUser);
  _saveUsers(users);
  const { password, ...userWithoutPassword } = newUser;
  localStorage.setItem(LOGGEDIN_KEY, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export async function logout() {
  localStorage.removeItem(LOGGEDIN_KEY);
  return true;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(LOGGEDIN_KEY));
}

export const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};
