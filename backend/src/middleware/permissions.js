import { bugService } from '../services/bug.service.js';

export function canModifyBug(user, bug) {
  if (!user) return false;
  const userCreatorId = bug.creator?._id || bug.creator;
  const userId = user._id;
  return user.isAdmin || userCreatorId?.toString() === userId?.toString();
}

export async function canDeleteUser(user, userToDelete) {
  if (!user) return false;
  if (!user.isAdmin) return false;
  if (user._id?.toString() === userToDelete._id?.toString()) return false;

  const { bugs } = await bugService.findAll();
  const userToDeleteHasBugs = bugs.some(
    (bug) => bug.creator?._id?.toString() === userToDelete._id?.toString()
  );
  return !userToDeleteHasBugs;
}
