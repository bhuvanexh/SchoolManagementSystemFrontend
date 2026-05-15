const colorMap = {
  primary: 'from-primary/15 to-primary/5 text-primary',
  secondary: 'from-secondary/15 to-secondary/5 text-secondary',
  tertiary: 'from-tertiary/15 to-tertiary/5 text-tertiary',
  error: 'from-error/15 to-error/5 text-error',
};

const StatCard = ({ icon: Icon, value, label, subtitle, color = 'primary' }) => (
  <div className="glass-panel p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-on-surface-variant">{label}</p>
        <h3 className="mt-3 text-3xl font-extrabold text-on-surface">{value ?? '—'}</h3>
        {subtitle ? <p className="mt-2 text-xs text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {Icon ? (
        <div className={`rounded-2xl bg-gradient-to-br p-3 ${colorMap[color] || colorMap.primary}`}>
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  </div>
);

export default StatCard;
