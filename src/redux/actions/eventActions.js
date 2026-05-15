import { createApiThunk } from '../createCrudThunk';

export const fetchEvents = createApiThunk(
  'events/fetchEvents',
  (params = {}) => ({ method: 'get', url: '/events', params }),
  { error: 'Failed to fetch events' }
);

export const fetchEventById = createApiThunk(
  'events/fetchEventById',
  (id) => ({ method: 'get', url: `/events/${id}` }),
  { error: 'Failed to fetch event details' }
);

export const createEvent = createApiThunk(
  'events/createEvent',
  (payload) => ({ method: 'post', url: '/events', data: payload }),
  { success: 'Event created successfully', error: 'Failed to create event' }
);

export const updateEvent = createApiThunk(
  'events/updateEvent',
  ({ id, ...payload }) => ({ method: 'put', url: `/events/${id}`, data: payload }),
  { success: 'Event updated successfully', error: 'Failed to update event' }
);

export const deleteEvent = createApiThunk(
  'events/deleteEvent',
  (id) => ({ method: 'delete', url: `/events/${id}` }),
  { success: 'Event deleted successfully', error: 'Failed to delete event' }
);
