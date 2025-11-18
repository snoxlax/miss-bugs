import fs from 'fs';
import PDFDocument from 'pdfkit';

const DATA_FILE = '../../data/bugs.json';

let bugs = [];

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    bugs = JSON.parse(data);
  } catch (error) {
    console.error('Error loading bugs:', error);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bugs, null, 2), 'utf-8');
    console.log('Bugs saved to file');
  } catch (error) {
    console.error('Error saving bugs:', error);
  }
}

import { sortBugs, paginateBugs, filterBugs } from '../utils/utils.service.js';

function findAll(options = {}) {
  const {
    sortBy = 'createdAt',
    sortDir = 'desc',
    pageIdx = 0,
    pageSize = 10,
    txt,
    minSeverity,
    labels,
  } = options;

  let result = bugs;

  let labelsArr = labels;
  if (typeof labels === 'string') {
    labelsArr = labels
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);
  }

  result = filterBugs(result, {
    txt: txt ? txt.toLowerCase() : undefined,
    minSeverity,
    labels: labelsArr,
  });

  result = sortBugs(result, sortBy, sortDir);

  result = paginateBugs(result, Number(pageIdx) || 0, Number(pageSize) || 10);

  return result;
}

function findById(id) {
  return bugs.find((bug) => bug._id === id);
}

function create(data, user) {
  const newBug = {
    _id: (bugs.length + 1).toString(),
    title: data.title,
    severity: data.severity,
    createdAt: data.createdAt,
    description: data.description || '',
    labels: data.labels || [],
    creator: {
      _id: user._id,
      fullname: user.fullname,
    },
  };
  bugs.push(newBug);
  return newBug;
}

function update(id, data) {
  const bug = findById(id);
  if (bug) {
    bug.title = data.title;
    bug.severity = data.severity;
    bug.description = data.description || bug.description;
    bug.labels = data.labels || bug.labels;
    return bug;
  }
  return null;
}

function remove(id) {
  const index = bugs.findIndex((bug) => bug._id === id);
  if (index !== -1) {
    bugs.splice(index, 1);
    return true;
  }
  return false;
}

function toPdf() {
  const doc = new PDFDocument();
  doc.text('Bugs Report');
  doc.moveDown();
  bugs.forEach((bug) => {
    doc.fontSize(10);
    doc.text(`ID: ${bug._id}`);
    doc.text(`Title: ${bug.title}`);
    doc.text(`Severity: ${bug.severity}`);
    doc.text(`Created: ${new Date(bug.createdAt).toLocaleDateString()}`);
    doc.text(`Description: ${bug.description}`);
    doc.text(`Labels: ${bug.labels.join(', ')}`);
    doc.moveDown();
  });
  return doc;
}

loadData();

export const bugService = {
  findAll,
  findById,
  create,
  update,
  remove,
  toPdf,
  saveData,
  loadData,
};
