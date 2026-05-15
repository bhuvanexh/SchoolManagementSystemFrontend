import { createApiThunk } from '../createCrudThunk';

export const fetchNotices = createApiThunk(
  'notices/fetchNotices',
  (params = {}) => ({ method: 'get', url: '/notices', params }),
  { error: 'Failed to fetch notices' }
);

export const fetchNoticeById = createApiThunk(
  'notices/fetchNoticeById',
  (id) => ({ method: 'get', url: `/notices/${id}` }),
  { error: 'Failed to fetch notice details' }
);

export const createNotice = createApiThunk(
  'notices/createNotice',
  (payload) => ({ method: 'post', url: '/notices', data: payload }),
  { success: 'Notice created successfully', error: 'Failed to create notice' }
);

export const updateNotice = createApiThunk(
  'notices/updateNotice',
  ({ id, ...payload }) => ({ method: 'put', url: `/notices/${id}`, data: payload }),
  { success: 'Notice updated successfully', error: 'Failed to update notice' }
);

export const deleteNotice = createApiThunk(
  'notices/deleteNotice',
  (id) => ({ method: 'delete', url: `/notices/${id}` }),
  { success: 'Notice deleted successfully', error: 'Failed to delete notice' }
);
