import { bugService } from '../services/bug.service.js';
import { canModifyBug } from '../middleware/permissions.js';

const VALID_SORT_FIELDS = [
  'title',
  'severity',
  'createdAt',
  '_id',
  'description',
];
const VALID_SORT_DIRS = ['asc', 'desc'];

function validateSortParams(sortBy, sortDir, res) {
  if (sortBy && !VALID_SORT_FIELDS.includes(sortBy)) {
    res.status(400).json({
      error: `Invalid sortBy field: ${sortBy}. Valid fields: ${VALID_SORT_FIELDS.join(
        ', '
      )}`,
    });
    return false;
  }

  if (sortDir && !VALID_SORT_DIRS.includes(sortDir)) {
    res.status(400).json({
      error: `Invalid sortDir: ${sortDir}. Valid values: ${VALID_SORT_DIRS.join(
        ', '
      )}`,
    });
    return false;
  }

  return true;
}

export async function getBugs(req, res) {
  try {
    const { sortBy, sortDir, pageIdx, pageSize, txt, minSeverity, labels } =
      req.query;

    if (!validateSortParams(sortBy, sortDir, res)) {
      return;
    }

    const result = await bugService.findAll({
      sortBy,
      sortDir,
      pageIdx,
      pageSize,
      txt,
      minSeverity,
      labels,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bugs' });
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.id;
    let visitedBugs;
    if (req.cookies.visitedBugs) {
      visitedBugs = JSON.parse(req.cookies.visitedBugs);
    } else {
      visitedBugs = [];
    }

    if (!visitedBugs.includes(bugId)) {
      if (visitedBugs.length < 3) visitedBugs.push(bugId);
      else return res.status(429).send('Bug visit limit reached');
    }

    const bug = await bugService.findById(bugId);

    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 10000 });
    if (bug) {
      res.json(bug);
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bug' });
  }
}

export async function createBug(req, res) {
  try {
    const newBug = await bugService.create(req.body, req.currentUser);
    res.status(201).json(newBug);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bug' });
  }
}

export async function updateBug(req, res) {
  try {
    const bug = await bugService.findById(req.params.id);
    if (!bug) {
      return notFound(res);
    }
    if (!canModifyBug(req.currentUser, bug)) {
      return res.status(403).send('Forbidden');
    }

    const updatedBug = await bugService.update(req.params.id, req.body);
    if (updatedBug) {
      res.json(updatedBug);
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bug' });
  }
}

export async function deleteBug(req, res) {
  try {
    const bug = await bugService.findById(req.params.id);
    if (!bug) {
      return notFound(res);
    }
    if (!canModifyBug(req.currentUser, bug)) {
      return res.status(403).send('Forbidden');
    }

    const success = await bugService.remove(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      notFound(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bug' });
  }
}

export async function downloadBugs(_, res) {
  try {
    const pdf = await bugService.toPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bugs.pdf');
    pdf.pipe(res);
    pdf.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

function notFound(res) {
  res.status(404).send('Not Found');
}
