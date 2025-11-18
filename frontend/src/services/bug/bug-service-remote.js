import client from '../http-client.js';

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  try {
    const { data } = await client.get('/bugs');
    return data;
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
}

async function getById(bugId) {
  try {
    const { data } = await client.get(`/bugs/${bugId}`);
    return data;
  } catch (error) {
    console.error('Error fetching bug by ID:', error);
    throw error;
  }
}
async function remove(bugId) {
  try {
    await client.delete(`/bugs/${bugId}`);
  } catch (error) {
    console.error('Error removing bug:', error);
    throw error;
  }
}

async function save(bug) {
  let response;
  try {
    if (bug._id) {
      response = await client.put(`/bugs/${bug._id}`, bug);
    } else {
      response = await client.post('/bugs', bug);
    }
    return response.data;
  } catch (error) {
    console.error('Error saving bug:', error);
    throw error;
  }
}
