import { createApiThunk } from '../createCrudThunk';

export const fetchTeachers = createApiThunk(
  'teachers/fetchTeachers',
  (params = {}) => ({ method: 'get', url: '/teachers', params }),
  { error: 'Failed to fetch teachers' }
);

export const fetchTeacherById = createApiThunk(
  'teachers/fetchTeacherById',
  (id) => ({ method: 'get', url: `/teachers/${id}` }),
  { error: 'Failed to fetch teacher details' }
);

export const fetchMyTeacherProfile = createApiThunk(
  'teachers/fetchMyTeacherProfile',
  { method: 'get', url: '/teachers/me' },
  { error: 'Failed to fetch your teacher profile' }
);

export const createTeacher = createApiThunk(
  'teachers/createTeacher',
  (payload) => ({ method: 'post', url: '/teachers', data: payload }),
  { success: 'Teacher created. Credentials sent via email.', error: 'Failed to create teacher' }
);

export const updateTeacher = createApiThunk(
  'teachers/updateTeacher',
  ({ id, ...payload }) => ({ method: 'put', url: `/teachers/${id}`, data: payload }),
  { success: 'Teacher updated successfully', error: 'Failed to update teacher' }
);

export const deactivateTeacher = createApiThunk(
  'teachers/deactivateTeacher',
  ({ id, force = false }) => ({
    method: 'patch',
    url: `/teachers/${id}/deactivate`,
    params: force ? { force: true } : undefined,
  }),
  { success: 'Teacher deactivated successfully', error: 'Failed to deactivate teacher' }
);
