import { createApiThunk } from '../createCrudThunk';

export const fetchTests = createApiThunk(
  'tests/fetchTests',
  (params = {}) => ({ method: 'get', url: '/tests', params }),
  { error: 'Failed to fetch tests' }
);

export const fetchTestById = createApiThunk(
  'tests/fetchTestById',
  (id) => ({ method: 'get', url: `/tests/${id}` }),
  { error: 'Failed to fetch test details' }
);

export const createTest = createApiThunk(
  'tests/createTest',
  (payload) => ({ method: 'post', url: '/tests', data: payload }),
  { success: 'Test created successfully', error: 'Failed to create test' }
);

export const updateTest = createApiThunk(
  'tests/updateTest',
  ({ id, ...payload }) => ({ method: 'put', url: `/tests/${id}`, data: payload }),
  { success: 'Test updated successfully', error: 'Failed to update test' }
);

export const publishTest = createApiThunk(
  'tests/publishTest',
  (id) => ({ method: 'patch', url: `/tests/${id}/publish` }),
  { success: 'Test published successfully', error: 'Failed to publish test' }
);

export const deleteTest = createApiThunk(
  'tests/deleteTest',
  (id) => ({ method: 'delete', url: `/tests/${id}` }),
  { success: 'Test deleted successfully', error: 'Failed to delete test' }
);
