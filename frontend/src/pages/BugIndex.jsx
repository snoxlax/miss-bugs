import { bugService } from '../services/bug';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';
import { BugList } from '../cmps/BugList.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [filterBy, setFilterBy] = useState(bugService.defaultFilter());

  useEffect(() => {
    loadBugs();
  }, [filterBy]);

  async function loadBugs() {
    let bugs = await bugService.query();
    bugs = bugService.filterBugs(bugs, filterBy);
    setBugs(bugs);
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      console.log('Deleted Succesfully!');
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg('Bug removed');
    } catch (err) {
      console.log('Error from onRemoveBug ->', err);
      showErrorMsg('Cannot remove bug');
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
    };
    try {
      const savedBug = await bugService.save(bug);
      console.log('Added Bug', savedBug);
      setBugs((prevBugs) => [...prevBugs, savedBug]);
      showSuccessMsg('Bug added');
    } catch (err) {
      console.log('Error from onAddBug ->', err);
      showErrorMsg('Cannot add bug');
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?');
    const bugToSave = { ...bug, severity };
    try {
      const savedBug = await bugService.save(bugToSave);
      console.log('Updated Bug:', savedBug);
      setBugs((prevBugs) =>
        prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
      );
      showSuccessMsg('Bug updated');
    } catch (err) {
      console.log('Error from onEditBug ->', err);
      showErrorMsg('Cannot update bug');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilterBy((prevFilterBy) => ({
      ...prevFilterBy,
      [name]: name === 'severity' ? Number(value) : value,
    }));
  }

  return (
    <section>
      <h3>Bugs App</h3>
      <main>
        <form>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={handleChange}
            value={filterBy.title}
          />
          <label htmlFor="severity">Severity:</label>
          <input
            type="number"
            name="severity"
            id="severity"
            value={filterBy.severity}
            onChange={handleChange}
          />
        </form>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <a
          href="http://localhost:3030/bugs/download"
          target="_blank"
          rel="noreferrer"
        >
          Download bugs
        </a>
        <BugList
          bugs={bugs}
          onRemoveBug={onRemoveBug}
          onEditBug={onEditBug}
        />
      </main>
    </section>
  );
}
