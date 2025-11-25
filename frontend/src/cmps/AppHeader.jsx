import { useEffect, useState } from 'react';
import { UserMsg } from './UserMsg';
import { NavLink } from 'react-router-dom';
import { Login } from './Login.jsx';
import { Signup } from './Signup.jsx';
import { authService } from '../services/auth/index.js';

export function AppHeader() {
  const [user, setUser] = useState(null);

  async function getCurrentUserHandler() {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    getCurrentUserHandler();
  }, []);

  async function handleLogin(credentials) {
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  async function handleSignup(credentials) {
    try {
      const user = await authService.signup(credentials);
      setUser(user);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  }

  async function handleLogout() {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <header className="app-header container">
      <div className="header-container">
        <h1>Bugs are Forever</h1>
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink>
          {user?.isAdmin && (
            <>
              |<NavLink to="/user">Users</NavLink>
            </>
          )}
          |<NavLink to="/about">About</NavLink>
        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span>Welcome, {user.fullname || user.username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <AuthToggleForms
              onLogin={handleLogin}
              onSignup={handleSignup}
            />
          )}
        </div>
      </div>
      <UserMsg />
    </header>
  );
}

function AuthToggleForms({ onLogin, onSignup }) {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {showSignup ? (
        <>
          <Signup onSignup={onSignup} />
          <button
            type="button"
            onClick={() => setShowSignup(false)}
          >
            Already have an account? Login
          </button>
        </>
      ) : (
        <>
          <Login onLogin={onLogin} />
          <button
            type="button"
            onClick={() => setShowSignup(true)}
          >
            Need an account? Signup
          </button>
        </>
      )}
    </div>
  );
}
