import client from '../http-client.js';

export const userService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  try {
    const { data } = await client.get('/users');
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getById(userId) {
  try {
    const { data } = await client.get(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

async function remove(userId) {
  try {
    await client.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
}

async function save(user) {
  let response;
  try {
    if (user._id) {
      response = await client.put(`/users/${user._id}`, user);
    } else {
      response = await client.post('/users', user);
    }
    return response.data;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}
