import { createApiThunk } from '../createCrudThunk';




export const loginUser = createApiThunk(
  'auth/loginUser',
  (payload) => ({
    method: 'post',
    url: '/auth/login',
    data: payload,
  }),
  {
    success: 'Logged in successfully',
    error: 'Failed to log in',
  }
);

export const changePassword = createApiThunk(
  'auth/changePassword',
  (payload) => ({
    method: 'post',
    url: '/auth/change-password',
    data: payload,
  }),
  {
    success: 'Password changed successfully',
    error: 'Failed to change password',
  }
);
