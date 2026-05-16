const Tooltip = ({ text, children }) => (
  <div className="group relative inline-flex">
    {children}
    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-on-surface/90 px-2 py-1 text-xs text-surface opacity-0 transition-opacity duration-150 group-hover:opacity-100">
      {text}
    </span>
  </div>
);

export default Tooltip;
