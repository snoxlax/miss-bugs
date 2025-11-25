export function isAdmin(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Please login' });
  }
  if (!req.currentUser.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
