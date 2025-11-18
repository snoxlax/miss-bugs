import { userService } from '../services/user.service.js';
import { canDeleteUser } from '../middleware/permissions.js';

export function getUsers(_, res) {
  const users = userService.findAll();
  console.log('users:', users);
  res.json(users);
}

export function getUser(req, res) {
  const user = userService.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    notFound(res);
  }
}

export function createUser(req, res) {
  const newUser = userService.create(req.body);
  userService.saveData();
  res.status(201).json(newUser);
}

export function updateUser(req, res) {
  const updatedUser = userService.update(req.params.id, req.body);
  if (updatedUser) {
    userService.saveData();
    res.json(updatedUser);
  } else {
    notFound(res);
  }
}

export function deleteUser(req, res) {
  const userToDelete = userService.findById(req.params.id);
  if (!canDeleteUser(req.currentUser, userToDelete)) {
    return res.status(403).send('Forbidden');
  }
  const success = userService.remove(req.params.id);
  if (success) {
    userService.saveData();
    res.status(204).send();
  } else {
    notFound(res);
  }
}

function notFound(res) {
  res.status(404).send('Not Found');
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
