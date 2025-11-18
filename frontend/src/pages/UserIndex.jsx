import { userService } from '../services/user';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';
import { UserList } from '../cmps/UserList.jsx';
import { useState, useEffect } from 'react';

export function UserIndex() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    password: '',
  });
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const users = await userService.query();
      setUsers(users);
    } catch (err) {
      showErrorMsg('Cannot load users');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (editUserId) {
      await onEditUser();
    } else {
      await onAddUser();
    }
  }

  async function onAddUser() {
    try {
      const savedUser = await userService.save(form);
      setUsers(prevUsers => [...prevUsers, savedUser]);
      setForm({ username: '', fullname: '', password: '' });
      showSuccessMsg('User added');
    } catch (err) {
      showErrorMsg('Cannot add user');
    }
  }

  function onEditInit(user) {
    setEditUserId(user._id);
    setForm({
      username: user.username,
      fullname: user.fullname,
      password: user.password,
    });
  }

  async function onEditUser() {
    try {
      const userToSave = { ...form, _id: editUserId };
      const savedUser = await userService.save(userToSave);
      setUsers(prevUsers =>
        prevUsers.map(currUser =>
          currUser._id === savedUser._id ? savedUser : currUser
        )
      );
      setEditUserId(null);
      setForm({ username: '', fullname: '', password: '' });
      showSuccessMsg('User updated');
    } catch (err) {
      showErrorMsg('Cannot update user');
    }
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      showSuccessMsg('User removed');
    } catch (err) {
      showErrorMsg('Cannot remove user');
    }
  }

  function onCancelEdit() {
    setEditUserId(null);
    setForm({ username: '', fullname: '', password: '' });
  }

  return (
    <section>
      <h3>Users App</h3>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {editUserId ? 'Update User' : 'Add User'}
          </button>
          {editUserId && (
            <button type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </form>
        <UserList
          users={users}
          onRemoveUser={onRemoveUser}
          onEditUser={onEditInit}
        />
      </main>
    </section>
  );
}
