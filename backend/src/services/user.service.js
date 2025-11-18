import fs from 'fs';

const DATA_FILE = '../../data/users.json';

let users = [];

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    console.log('Users saved to file');
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

function findAll() {
  return users;
}

function findById(id) {
  return users.find((user) => user._id === id);
}

function create(data) {
  const newUser = {
    _id: `u${Math.floor(Math.random() * 10000)}`,
    fullname: data.fullname,
    username: data.username,
    password: data.password,
    score: data.score || 0,
  };
  users.push(newUser);
  return newUser;
}

function update(id, data) {
  const user = findById(id);
  if (user) {
    user.fullname = data.fullname || user.fullname;
    user.username = data.username || user.username;
    user.password = data.password || user.password;
    user.score = data.score !== undefined ? data.score : user.score;
    return user;
  }
  return null;
}

function remove(id) {
  const index = users.findIndex((user) => user._id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
}

loadData();

export const userService = {
  findAll,
  findById,
  create,
  update,
  remove,
  saveData,
  loadData,
};
