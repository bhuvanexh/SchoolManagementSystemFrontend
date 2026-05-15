import { createApiThunk } from '../createCrudThunk';

export const fetchSectionsByClass = createApiThunk(
  'sections/fetchSectionsByClass',
  (classId) => ({ method: 'get', url: `/classes/${classId}/sections` }),
  { error: 'Failed to fetch sections' }
);

export const createSections = createApiThunk(
  'sections/createSections',
  ({ classId, sections }) => ({ method: 'post', url: `/classes/${classId}/sections`, data: { sections } }),
  { success: 'Sections created successfully', error: 'Failed to create sections' }
);

export const updateSection = createApiThunk(
  'sections/updateSection',
  ({ id, ...payload }) => ({ method: 'put', url: `/sections/${id}`, data: payload }),
  { success: 'Section updated successfully', error: 'Failed to update section' }
);

export const reassignClassTeacher = createApiThunk(
  'sections/reassignClassTeacher',
  ({ id, classTeacherId }) => ({ method: 'patch', url: `/sections/${id}/class-teacher`, data: { classTeacherId } }),
  { success: 'Class teacher reassigned successfully', error: 'Failed to reassign class teacher' }
);

export const deleteSection = createApiThunk(
  'sections/deleteSection',
  (id) => ({ method: 'delete', url: `/sections/${id}` }),
  { success: 'Section deleted successfully', error: 'Failed to delete section' }
);
