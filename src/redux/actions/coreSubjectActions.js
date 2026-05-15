import { createApiThunk } from '../createCrudThunk';

export const fetchCoreSubjects = createApiThunk(
  'coreSubjects/fetchCoreSubjects',
  { method: 'get', url: '/core-subjects' },
  { error: 'Failed to fetch core subjects' }
);

export const createCoreSubject = createApiThunk(
  'coreSubjects/createCoreSubject',
  (payload) => ({ method: 'post', url: '/core-subjects', data: payload }),
  { success: 'Core subject created successfully', error: 'Failed to create core subject' }
);

export const updateCoreSubject = createApiThunk(
  'coreSubjects/updateCoreSubject',
  ({ id, ...payload }) => ({ method: 'put', url: `/core-subjects/${id}`, data: payload }),
  { success: 'Core subject updated successfully', error: 'Failed to update core subject' }
);

export const deleteCoreSubject = createApiThunk(
  'coreSubjects/deleteCoreSubject',
  (id) => ({ method: 'delete', url: `/core-subjects/${id}` }),
  { success: 'Core subject deleted successfully', error: 'Failed to delete core subject' }
);
