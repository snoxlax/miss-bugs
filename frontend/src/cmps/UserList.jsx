export function UserList({ users, onRemoveUser, onEditUser }) {
  if (!users.length) return <div>No users found.</div>;
  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>
          <span>
            <b>Username:</b> {user.username} | <b>Full Name:</b> {user.fullname}
          </span>
          <button onClick={() => onEditUser(user)}>Edit</button>
          <button onClick={() => onRemoveUser(user._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
