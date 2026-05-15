const FileInput = ({ className = '', ...props }) => (
  <input
    type="file"
    className={`input-field file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white ${className}`.trim()}
    {...props}
  />
);

export default FileInput;
