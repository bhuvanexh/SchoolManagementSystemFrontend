const IconButton = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 text-on-surface shadow-glass-md transition hover:scale-105 ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
