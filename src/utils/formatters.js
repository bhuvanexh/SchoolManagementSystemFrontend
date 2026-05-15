export const formatDate = (value, options = {}) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
};

export const formatDateTime = (value) =>
  formatDate(value, {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatPercentage = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(1)}%`;
};

export const formatName = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');

export const truncate = (value = '', max = 120) =>
  value.length > max ? `${value.slice(0, max).trim()}...` : value;
