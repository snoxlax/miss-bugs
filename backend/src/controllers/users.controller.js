import { userService } from '../services/user.service.js';
import { canDeleteUser } from '../middleware/permissions.js';

export async function getUsers(_, res) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUser(req, res) {
  try {
    const user = await userService.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req, res) {
  try {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const updatedUser = await userService.update(req.params.id, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    const userToDelete = await userService.findById(req.params.id);
    if (!userToDelete) {
      return notFound(res);
    }
    if (!(await canDeleteUser(req.currentUser, userToDelete))) {
      return res.status(403).send('Forbidden');
    }
    const success = await userService.remove(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
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
