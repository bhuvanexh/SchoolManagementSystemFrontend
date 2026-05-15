const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="glass-panel flex items-center gap-3 px-6 py-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
    </div>
  </div>
);

export default Loader;
