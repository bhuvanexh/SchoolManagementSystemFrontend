import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import FormField from '../../components/form/FormField';
import FormSection from '../../components/form/FormSection';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { changePassword } from '../../redux/actions/authActions';
import { changePasswordSchema } from '../../validation/authSchema';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const result = await dispatch(
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    );

    if (!result.error) {
      reset();
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Change Password"
        description="Keep your school account secure by updating your password regularly."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Security" description="Your new password should be at least 8 characters long.">
          <FormField control={control} name="currentPassword" label="Current Password" type="password" error={errors.currentPassword} />
          <FormField control={control} name="newPassword" label="New Password" type="password" error={errors.newPassword} />
          <FormField control={control} name="confirmPassword" label="Confirm Password" type="password" error={errors.confirmPassword} />
        </FormSection>

        <div className="flex justify-end gap-3">
          <SecondaryButton type="button" onClick={() => reset()}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={!isValid || loading}>
            {loading ? 'Saving...' : 'Save Password'}
          </PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default ChangePassword;
