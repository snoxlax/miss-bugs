import { dbService } from './db.service.js';
import PDFDocument from 'pdfkit';
import { buildId } from '../utils/mongo.utils.js';

const collectionName = 'bug';

export const bugService = {
  findAll,
  findById,
  create,
  update,
  remove,
  toPdf,
};

async function findAll(options = {}) {
  const {
    sortBy = 'createdAt',
    sortDir = 'desc',
    pageIdx = 0,
    pageSize = 10,
    txt,
    minSeverity,
    labels,
  } = options;

  try {
    const collection = await dbService.getCollection(collectionName);
    const criteria = _buildCriteria({ txt, minSeverity, labels });
    const sort = _buildSort(sortBy, sortDir);

    const totalCount = await collection.countDocuments(criteria);
    const bugs = await collection
      .find(criteria)
      .sort(sort)
      .skip(Number(pageIdx) * Number(pageSize))
      .limit(Number(pageSize))
      .toArray();

    bugs.forEach(_addCreatedAt);

    return {
      bugs,
      totalPages: Math.ceil(totalCount / Number(pageSize)),
      totalCount,
    };
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

async function findById(id) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bugId = buildId(id);
    const bug = await collection.findOne({ _id: bugId });

    if (!bug) return null;

    _addCreatedAt(bug);
    return bug;
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

async function create(data, user) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bugToInsert = {
      title: data.title,
      severity: data.severity,
      description: data.description,
      labels: data.labels,
      creator: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
      },
    };

    const { insertedId } = await collection.insertOne(bugToInsert);
    const newBug = await collection.findOne({ _id: insertedId });

    _addCreatedAt(newBug);
    return newBug;
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

async function update(id, data) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bugId = buildId(id);
    const bugToUpdate = {
      title: data.title,
      severity: data.severity,
      description: data.description,
      labels: data.labels,
    };

    const { matchedCount } = await collection.updateOne(
      { _id: bugId },
      { $set: bugToUpdate }
    );

    if (!matchedCount) return null;

    const updatedBug = await collection.findOne({ _id: bugId });
    _addCreatedAt(updatedBug);
    return updatedBug;
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bugId = buildId(id);
    const { deletedCount } = await collection.deleteOne({ _id: bugId });
    return deletedCount > 0;
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

async function toPdf() {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bugs = await collection.find().toArray();

    const doc = new PDFDocument();
    doc.text('Bugs Report');
    doc.moveDown();

    bugs.forEach((bug) => {
      doc.fontSize(10);
      doc.text(`ID: ${bug._id}`);
      doc.text(`Title: ${bug.title}`);
      doc.text(`Severity: ${bug.severity}`);
      const createdAt = bug.createdAt
        ? new Date(bug.createdAt).toLocaleDateString()
        : bug._id
        ? bug._id.getTimestamp().toLocaleDateString()
        : 'N/A';
      doc.text(`Created: ${createdAt}`);
      doc.text(`Description: ${bug.description || ''}`);
      doc.text(`Labels: ${bug.labels ? bug.labels.join(', ') : ''}`);
      doc.moveDown();
    });

    return doc;
  } catch (e) {
    console.error('error in bug service:', e);
    throw new Error(e);
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};

  if (filterBy.txt) {
    criteria.$or = [
      { title: { $regex: filterBy.txt, $options: 'i' } },
      { description: { $regex: filterBy.txt, $options: 'i' } },
    ];
  }

  if (filterBy.minSeverity) {
    criteria.severity = { $gte: Number(filterBy.minSeverity) };
  }

  if (filterBy.labels?.length > 0) {
    criteria.labels = { $in: filterBy.labels.map((l) => new RegExp(l, 'i')) };
  }

  return criteria;
}

function _buildSort(sortBy, sortDir) {
  const direction = sortDir === 'desc' ? -1 : 1;
  const validSortFields = ['title', 'severity', 'createdAt', '_id'];

  if (!sortBy || !validSortFields.includes(sortBy)) {
    return { createdAt: -1 };
  }

  return { [sortBy]: direction };
}

function _addCreatedAt(bug) {
  if (bug && !bug.createdAt && bug._id) {
    bug.createdAt = bug._id.getTimestamp().getTime();
  }
}
