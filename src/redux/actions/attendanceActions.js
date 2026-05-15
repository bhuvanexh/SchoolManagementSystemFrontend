import { createApiThunk } from '../createCrudThunk';

export const markAttendance = createApiThunk(
  'attendance/markAttendance',
  (payload) => ({ method: 'post', url: '/attendance/mark', data: payload }),
  { success: 'Attendance saved successfully', error: 'Failed to save attendance' }
);

export const fetchSectionAttendance = createApiThunk(
  'attendance/fetchSectionAttendance',
  ({ sectionId, ...params }) => ({ method: 'get', url: `/attendance/section/${sectionId}`, params }),
  { error: 'Failed to fetch section attendance' }
);

export const fetchStudentAttendance = createApiThunk(
  'attendance/fetchStudentAttendance',
  ({ studentId, ...params }) => ({ method: 'get', url: `/attendance/student/${studentId}`, params }),
  { error: 'Failed to fetch student attendance' }
);

export const editAttendance = createApiThunk(
  'attendance/editAttendance',
  ({ id, ...payload }) => ({ method: 'put', url: `/attendance/${id}`, data: payload }),
  { success: 'Attendance updated successfully', error: 'Failed to update attendance' }
);
