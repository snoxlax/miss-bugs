import { authService } from '../services/auth.service.js';

export function isAuthenticated(req, res, next) {
  const loginToken = req.cookies.loginToken;
  const currentUser = authService.validateToken(loginToken);

  if (!currentUser) return res.status(401).send('Please login');
  req.currentUser = currentUser;

  next();
}
