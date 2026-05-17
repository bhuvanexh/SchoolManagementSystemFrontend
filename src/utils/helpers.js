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

/**
 * Render a human-readable visibility label for a notice/event.
 * Uses backend-enriched `target` (class/section name) when available so a section
 * notice reads "Class 5-A" instead of just "section".
 */
export const getVisibilityLabel = (item) => {
  if (!item) return '';
  const { visibility, target } = item;
  if (visibility === 'school') return 'School-wide';
  if (visibility === 'teachers') return 'Teachers only';
  if (visibility === 'class' && target?.className) return `Class ${target.className}`;
  if (visibility === 'section' && target?.className) {
    return target.sectionName && target.sectionName !== 'Default'
      ? `Class ${target.className}-${target.sectionName}`
      : `Class ${target.className}`;
  }
  return visibility || '';
};
