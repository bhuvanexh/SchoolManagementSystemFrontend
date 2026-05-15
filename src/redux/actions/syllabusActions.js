import { createApiThunk } from '../createCrudThunk';

export const fetchSyllabus = createApiThunk(
  'syllabus/fetchSyllabus',
  (subjectId) => ({ method: 'get', url: `/syllabus/subject/${subjectId}` }),
  { error: 'Failed to fetch syllabus' }
);

export const createSyllabusItem = createApiThunk(
  'syllabus/createSyllabusItem',
  (payload) => ({ method: 'post', url: '/syllabus', data: payload }),
  { success: 'Syllabus item created successfully', error: 'Failed to create syllabus item' }
);

export const updateSyllabusItem = createApiThunk(
  'syllabus/updateSyllabusItem',
  ({ id, ...payload }) => ({ method: 'put', url: `/syllabus/${id}`, data: payload }),
  { success: 'Syllabus item updated successfully', error: 'Failed to update syllabus item' }
);

export const toggleSyllabusStatus = createApiThunk(
  'syllabus/toggleSyllabusStatus',
  (id) => ({ method: 'patch', url: `/syllabus/${id}/status` }),
  { success: 'Syllabus status updated successfully', error: 'Failed to update syllabus status' }
);

export const reorderSyllabus = createApiThunk(
  'syllabus/reorderSyllabus',
  (payload) => ({ method: 'patch', url: '/syllabus/reorder', data: payload }),
  { success: 'Syllabus order updated successfully', error: 'Failed to update syllabus order' }
);

export const deleteSyllabusItem = createApiThunk(
  'syllabus/deleteSyllabusItem',
  (id) => ({ method: 'delete', url: `/syllabus/${id}` }),
  { success: 'Syllabus item deleted successfully', error: 'Failed to delete syllabus item' }
);
