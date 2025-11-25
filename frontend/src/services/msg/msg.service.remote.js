import client from '../http-client.js';

export const msgService = {
  query,
  getById,
  save,
  remove,
};

async function query(filterBy = {}) {
  try {
    const filterParams = {};
    if (filterBy.aboutBugId) filterParams.aboutBugId = filterBy.aboutBugId;
    if (filterBy.byUserId) filterParams.byUserId = filterBy.byUserId;

    const config =
      Object.keys(filterParams).length > 0
        ? { params: { filterBy: JSON.stringify(filterParams) } }
        : undefined;

    const { data } = await client.get('/api/msg', config);
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

async function getById(msgId) {
  try {
    const { data } = await client.get(`/api/msg/${msgId}`);
    return data;
  } catch (error) {
    console.error('Error fetching message by ID:', error);
    throw error;
  }
}

async function remove(msgId) {
  try {
    await client.delete(`/api/msg/${msgId}`);
  } catch (error) {
    console.error('Error removing message:', error);
    throw error;
  }
}

async function save(msgToSave) {
  try {
    const method = msgToSave._id ? 'put' : 'post';
    const url = msgToSave._id ? `/api/msg/${msgToSave._id}` : '/api/msg';
    const { data } = await client[method](url, msgToSave);
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}
