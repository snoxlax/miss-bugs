import { bugService } from '../services/bug.service.js';

export function canModifyBug(user, bug) {
  if (!user) return false;
  return user.isAdmin || bug.creator._id === user._id;
}

export function canDeleteUser(user, userToDelete) {
  if (!user) return false;
  const userToDeleteHasBugs = bugService
    .findAll()
    .some((bug) => bug.creator._id === userToDelete._id);
  return user.isAdmin && user._id !== userToDelete._id && !userToDeleteHasBugs;
}
