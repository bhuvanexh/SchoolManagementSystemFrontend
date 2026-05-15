import { createApiThunk } from '../createCrudThunk';

export const fetchDashboard = createApiThunk(
  'dashboard/fetchDashboard',
  { method: 'get', url: '/dashboard' },
  { error: 'Failed to fetch dashboard' }
);
