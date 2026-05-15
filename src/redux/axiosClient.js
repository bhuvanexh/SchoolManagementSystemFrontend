import axios from 'axios';
import toast from 'react-hot-toast';

let appStore = null;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const attachStore = (store) => {
  appStore = store;
};

axiosClient.interceptors.request.use((config) => {
  const token = appStore?.getState()?.auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401 && appStore) {
      appStore.dispatch({ type: 'auth/logout' });
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    return Promise.reject({ ...error, displayMessage: message });
  }
);

export default axiosClient;
