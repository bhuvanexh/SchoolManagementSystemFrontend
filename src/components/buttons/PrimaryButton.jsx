const PrimaryButton = ({ children, className = '', ...props }) => (
  <button className={`btn-primary ${className}`.trim()} {...props}>
    {children}
  </button>
);

export default PrimaryButton;
