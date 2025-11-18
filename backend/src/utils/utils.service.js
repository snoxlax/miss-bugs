export function sortBugs(bugs, sortBy = 'createdAt', sortDir = 'desc') {
  return [...bugs].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortDir === 'asc')
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
  });
}

export function paginateBugs(bugs, pageIdx = 0, pageSize = 2) {
  const start = pageIdx * pageSize;
  const paginated = bugs.slice(start, start + pageSize);
  return paginated;
}

export function filterBugs(bugs, { txt, minSeverity, labels }) {
  const hasLabels = Array.isArray(labels) && labels.length > 0;
  const hasMinSeverity = minSeverity !== undefined && minSeverity !== null;

  return bugs.filter(bug => {
    let match = true;

    if (txt) {
      const inTitle = bug.title && bug.title.toLowerCase().includes(txt);
      const inDesc =
        bug.description && bug.description.toLowerCase().includes(txt);
      match = match && (inTitle || inDesc);
    }

    if (hasMinSeverity) {
      match = match && bug.severity >= Number(minSeverity);
    }

    if (hasLabels) {
      match =
        match &&
        Array.isArray(bug.labels) &&
        labels.every(label => bug.labels.includes(label));
    }

    return match;
  });
}
