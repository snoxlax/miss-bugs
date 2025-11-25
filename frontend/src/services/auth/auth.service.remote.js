import httpService from '../http-client.js';

export async function login(credentials) {
  try {
    const res = await httpService.post('auth/login', credentials);
    return res.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function signup(credentials) {
  try {
    const res = await httpService.post('auth/signup', credentials);
    return res.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await httpService.post('auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
  return true;
}

export async function getCurrentUser() {
  try {
    const res = await httpService.get('auth/checkAuth');
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 401) return null;
    console.error('Error getting current user:', error);
    throw error;
  }
}

export const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};
