import { createApiThunk } from '../createCrudThunk';

export const fetchStudents = createApiThunk(
  'students/fetchStudents',
  (params = {}) => ({ method: 'get', url: '/students', params }),
  { error: 'Failed to fetch students' }
);

export const fetchStudentById = createApiThunk(
  'students/fetchStudentById',
  (id) => ({ method: 'get', url: `/students/${id}` }),
  { error: 'Failed to fetch student details' }
);

export const fetchStudentSummary = createApiThunk(
  'students/fetchStudentSummary',
  (id) => ({ method: 'get', url: `/students/${id}/summary` }),
  { error: 'Failed to fetch student summary' }
);

export const createStudent = createApiThunk(
  'students/createStudent',
  (payload) => ({ method: 'post', url: '/students', data: payload }),
  { success: 'Student created. Credentials sent.', error: 'Failed to create student' }
);

export const updateStudent = createApiThunk(
  'students/updateStudent',
  ({ id, ...payload }) => ({ method: 'put', url: `/students/${id}`, data: payload }),
  { success: 'Student updated successfully', error: 'Failed to update student' }
);

export const deactivateStudent = createApiThunk(
  'students/deactivateStudent',
  (id) => ({ method: 'patch', url: `/students/${id}/deactivate` }),
  { success: 'Student deactivated successfully', error: 'Failed to deactivate student' }
);

export const transferStudent = createApiThunk(
  'students/transferStudent',
  ({ id, sectionId }) => ({ method: 'patch', url: `/students/${id}/transfer`, data: { sectionId } }),
  { success: 'Student transferred successfully', error: 'Failed to transfer student' }
);
