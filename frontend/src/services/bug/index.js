import { bugService as bugServiceLocal } from './bug-service-local';
import { bugService as bugServiceRemote } from './bug-service-remote';

const isRemote = import.meta.env.VITE_USE_REMOTE === 'true' || true;

function defaultFilter() {
  return {
    title: '',
    severity: 0,
  };
}

function filterBugs(bugs, filterBy) {
  let filteredBugs = bugs;

  if (filterBy.title) {
    filteredBugs = filteredBugs.filter(bug =>
      bug.title.includes(filterBy.title)
    );
  }

  if (filterBy.severity) {
    filteredBugs = filteredBugs.filter(
      bug => bug.severity === filterBy.severity
    );
  }

  return filteredBugs;
}

const commonFunctions = {
  defaultFilter,
  filterBugs,
};

const selectedService = isRemote ? bugServiceRemote : bugServiceLocal;
export const bugService = {
  ...commonFunctions,
  ...selectedService,
};
