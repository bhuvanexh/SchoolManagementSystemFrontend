import { createApiThunk } from '../createCrudThunk';

export const fetchResultsByTest = createApiThunk(
  'results/fetchResultsByTest',
  (testId) => ({ method: 'get', url: `/results/test/${testId}` }),
  { error: 'Failed to fetch test results' }
);

export const fetchResultsByStudent = createApiThunk(
  'results/fetchResultsByStudent',
  (studentId) => ({ method: 'get', url: `/results/student/${studentId}` }),
  { error: 'Failed to fetch student results' }
);

export const submitResults = createApiThunk(
  'results/submitResults',
  ({ testId, results }) => ({ method: 'post', url: `/results/test/${testId}`, data: { results } }),
  { success: 'Results submitted successfully', error: 'Failed to submit results' }
);

export const editResult = createApiThunk(
  'results/editResult',
  ({ id, ...payload }) => ({ method: 'put', url: `/results/${id}`, data: payload }),
  { success: 'Result updated successfully', error: 'Failed to update result' }
);
