const TextInput = ({ as = 'input', className = '', ...props }) => {
  const Component = as;

  return <Component className={`input-field ${className}`.trim()} {...props} />;
};

export default TextInput;
