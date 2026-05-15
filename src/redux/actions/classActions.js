import { createApiThunk } from '../createCrudThunk';

export const fetchClasses = createApiThunk(
  'classes/fetchClasses',
  (params = {}) => ({ method: 'get', url: '/classes', params }),
  { error: 'Failed to fetch classes' }
);

export const fetchClassById = createApiThunk(
  'classes/fetchClassById',
  (id) => ({ method: 'get', url: `/classes/${id}` }),
  { error: 'Failed to fetch class details' }
);

export const createClass = createApiThunk(
  'classes/createClass',
  (payload) => ({ method: 'post', url: '/classes', data: payload }),
  { success: 'Class created successfully', error: 'Failed to create class' }
);

export const updateClass = createApiThunk(
  'classes/updateClass',
  ({ id, ...payload }) => ({ method: 'put', url: `/classes/${id}`, data: payload }),
  { success: 'Class updated successfully', error: 'Failed to update class' }
);

export const deactivateClass = createApiThunk(
  'classes/deactivateClass',
  (id) => ({ method: 'patch', url: `/classes/${id}/deactivate` }),
  { success: 'Class deactivated successfully', error: 'Failed to deactivate class' }
);
