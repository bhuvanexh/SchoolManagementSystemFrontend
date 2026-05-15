import { createApiThunk } from '../createCrudThunk';

export const fetchNotifications = createApiThunk(
  'notifications/fetchNotifications',
  (params = {}) => ({ method: 'get', url: '/notifications', params }),
  { error: 'Failed to fetch notifications' }
);

export const fetchUnreadCount = createApiThunk(
  'notifications/fetchUnreadCount',
  { method: 'get', url: '/notifications/unread-count' },
  { error: 'Failed to fetch unread count' }
);

export const markAsRead = createApiThunk(
  'notifications/markAsRead',
  (id) => ({ method: 'patch', url: `/notifications/${id}/read` }),
  { error: 'Failed to mark notification as read' }
);

export const markAllAsRead = createApiThunk(
  'notifications/markAllAsRead',
  { method: 'patch', url: '/notifications/read-all' },
  { success: 'All notifications marked as read', error: 'Failed to mark notifications as read' }
);
