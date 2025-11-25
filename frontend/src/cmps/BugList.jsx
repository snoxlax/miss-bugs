import { Link } from 'react-router-dom';
import { BugPreview } from './BugPreview';

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="no-bugs-message">
        <p>No bugs found. Start by adding your first bug! 🐛</p>
      </div>
    );
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li
          className="bug-preview"
          key={bug._id}
        >
          <BugPreview bug={bug} />
          <div>
            <button
              onClick={() => {
                onRemoveBug(bug._id);
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditBug(bug);
              }}
            >
              Edit
            </button>
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  );
}
