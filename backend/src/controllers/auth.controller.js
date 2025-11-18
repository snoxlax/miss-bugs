import { authService } from '../services/auth.service.js';

export async function login(req, res) {
  try {
    const miniUser = authService.login(req.body);
    if (!miniUser)
      return res.status(401).json({ error: 'Invalid credentials' });

    const loginToken = authService.createLoginToken(miniUser);

    res.cookie('loginToken', loginToken, {
      sameSite: 'None',
      secure: true,
    });
    res.json(miniUser);
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function signup(req, res) {
  try {
    const user = authService.signup(req.body);
    const loginToken = authService.createLoginToken(user);
    res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
}

export function logout(_req, res) {
  res.clearCookie('loginToken', {
    sameSite: 'None',
    secure: true,
  });
  res.json({ msg: 'Logged out successfully' });
}

export function checkAuth(req, res) {
  res.json(req.currentUser);
}
