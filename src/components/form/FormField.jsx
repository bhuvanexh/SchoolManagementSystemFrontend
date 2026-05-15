import { Controller } from 'react-hook-form';

import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';

const FormField = ({
  control,
  name,
  label,
  type = 'text',
  error,
  placeholder,
  options,
  as = 'input',
  rows = 4,
  ...rest
}) => (
  <div className="flex flex-col gap-1.5">
    {label ? (
      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </label>
    ) : null}
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (type === 'select') {
          return <SelectInput {...field} options={options} placeholder={placeholder || label} {...rest} />;
        }

        if (type === 'textarea') {
          return (
            <TextInput
              as="textarea"
              rows={rows}
              {...field}
              placeholder={placeholder || label}
              {...rest}
            />
          );
        }

        if (type === 'checkbox') {
          return (
            <label className="flex items-center gap-3 rounded-glass-xs bg-surface-container-low px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm text-on-surface">{placeholder || label}</span>
            </label>
          );
        }

        return (
          <TextInput
            {...field}
            as={as}
            type={type}
            placeholder={placeholder || label}
            {...rest}
          />
        );
      }}
    />
    {error ? <span className="text-xs font-medium text-error">{error.message}</span> : null}
  </div>
);

export default FormField;
