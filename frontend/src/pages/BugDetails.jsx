import { useState, useEffect } from 'react';
import { bugService } from '../services/bug';
import { showErrorMsg } from '../services/event-bus.service.js';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { BugMsg } from '../cmps/BugMsg.jsx';

export function BugDetails() {
  const [bug, setBug] = useState(null);
  const { bugId } = useParams();

  useEffect(() => {
    async function loadBug() {
      try {
        const bug = await bugService.getById(bugId);
        setBug(bug);
      } catch (err) {
        showErrorMsg('Cannot load bug');
      }
    }
    loadBug();
  }, [bugId]);

  if (!bug) return <h1>loadings....</h1>;
  return (
    <div className="bug-details main-layout">
      <h3>Bug Details 🐛</h3>
      <h4>{bug.title}</h4>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      {bug.description && <p>Description: {bug.description}</p>}
      {bug.labels && bug.labels.length > 0 && (
        <p>Labels: {bug.labels.join(', ')}</p>
      )}
      <Link to="/bug">Back to List</Link>
      <BugMsg bugId={bugId} />
    </div>
  );
}
