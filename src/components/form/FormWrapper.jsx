import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const FormWrapper = ({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = 'space-y-6',
}) => {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues: defaultValues || {},
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
