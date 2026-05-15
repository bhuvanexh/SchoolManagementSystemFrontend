import { createApiThunk } from '../createCrudThunk';

export const fetchSubjects = createApiThunk(
  'subjects/fetchSubjects',
  (params = {}) => ({ method: 'get', url: '/subjects', params }),
  { error: 'Failed to fetch subjects' }
);

export const fetchSubjectById = createApiThunk(
  'subjects/fetchSubjectById',
  (id) => ({ method: 'get', url: `/subjects/${id}` }),
  { error: 'Failed to fetch subject details' }
);

export const createSubject = createApiThunk(
  'subjects/createSubject',
  (payload) => ({ method: 'post', url: '/subjects', data: payload }),
  { success: 'Subject created successfully', error: 'Failed to create subject' }
);

export const updateSubject = createApiThunk(
  'subjects/updateSubject',
  ({ id, ...payload }) => ({ method: 'put', url: `/subjects/${id}`, data: payload }),
  { success: 'Subject updated successfully', error: 'Failed to update subject' }
);

export const reassignSubjectTeacher = createApiThunk(
  'subjects/reassignSubjectTeacher',
  ({ id, subjectTeacherId }) => ({ method: 'patch', url: `/subjects/${id}/teacher`, data: { subjectTeacherId } }),
  { success: 'Subject teacher reassigned successfully', error: 'Failed to reassign subject teacher' }
);

export const deleteSubject = createApiThunk(
  'subjects/deleteSubject',
  (id) => ({ method: 'delete', url: `/subjects/${id}` }),
  { success: 'Subject deleted successfully', error: 'Failed to delete subject' }
);
