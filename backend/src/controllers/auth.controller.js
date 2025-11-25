import { authService } from '../services/auth.service.js';
import { userService } from '../services/user.service.js';
import bcrypt from 'bcrypt';

export async function login(req, res) {
  try {
    const miniUser = await authService.login(req.body);
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
    const user = await authService.signup(req.body);
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

export async function createTestAdmin(req, res) {
  try {
    const adminUser = {
      username: 'admin',
      fullname: 'Admin User',
      password: bcrypt.hashSync('admin123', 10),
      score: 0,
      isAdmin: true,
    };

    const existingAdmin = await userService.findByUsername('admin');
    if (existingAdmin) {
      const { password: _, ...adminWithoutPassword } = existingAdmin;
      return res.json({
        message: 'Admin user already exists',
        user: adminWithoutPassword,
      });
    }

    const newAdmin = await userService.create(adminUser);
    const { password: _, ...adminWithoutPassword } = newAdmin;
    res.status(201).json({
      message: 'Admin user created successfully',
      user: adminWithoutPassword,
    });
  } catch (err) {
    console.error('Error creating test admin:', err);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
}
