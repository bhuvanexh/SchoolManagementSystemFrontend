const SelectInput = ({ options = [], placeholder = 'Select an option', className = '', ...props }) => (
  <select className={`input-field ${className}`.trim()} {...props}>
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SelectInput;
