const toneMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  tertiary: 'bg-tertiary/10 text-tertiary',
  error: 'bg-error/10 text-error',
  neutral: 'bg-surface-container text-on-surface-variant',
  success: 'bg-secondary-container/40 text-secondary',
};

const Badge = ({ children, tone = 'neutral' }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneMap[tone] || toneMap.neutral}`}>
    {children}
  </span>
);

export default Badge;
