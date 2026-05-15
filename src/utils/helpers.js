export const buildOptions = (items = [], labelKey = 'name', valueKey = '_id') =>
  items.map((item) => ({
    label: item?.[labelKey] || 'Untitled',
    value: item?.[valueKey] || '',
  }));

export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const isAdmin = (user) => user?.role === 'admin';
export const isTeacher = (user) => user?.role === 'teacher';
export const isStudent = (user) => user?.role === 'student';

export const normalizeId = (item) => item?._id || item?.id || '';

export const calculateProgress = (items = []) => {
  if (!items.length) return 0;
  const completed = items.filter((item) => item.status === 'completed').length;
  return Math.round((completed / items.length) * 100);
};
