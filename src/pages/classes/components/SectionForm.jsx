import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import FormField from '../../../components/form/FormField';
import Modal from '../../../components/modal/Modal';
import { sectionSchema } from '../../../validation/sectionSchema';

const SectionForm = ({ isOpen, teachers = [], initialValues, onClose, onSubmit, loading }) => {
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(sectionSchema),
    defaultValues: {
      sections: initialValues || [{ name: '', classTeacherId: '', roomNumber: '' }],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    reset({ sections: initialValues || [{ name: '', classTeacherId: '', roomNumber: '' }] });
  }, [initialValues, reset]);

  return (
    <Modal
      isOpen={isOpen}
      title="Manage Sections"
      onClose={onClose}
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4">
        <FormField control={control} name="sections.0.name" label="Section Name" error={errors.sections?.[0]?.name} />
        <FormField control={control} name="sections.0.classTeacherId" label="Class Teacher" type="select" options={teachers} error={errors.sections?.[0]?.classTeacherId} />
        <FormField control={control} name="sections.0.roomNumber" label="Room Number" error={errors.sections?.[0]?.roomNumber} />
      </div>
    </Modal>
  );
};

export default SectionForm;
