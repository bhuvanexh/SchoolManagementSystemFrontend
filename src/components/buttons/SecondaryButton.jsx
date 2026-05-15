const SecondaryButton = ({ children, className = '', ...props }) => (
  <button className={`btn-secondary ${className}`.trim()} {...props}>
    {children}
  </button>
);

export default SecondaryButton;
