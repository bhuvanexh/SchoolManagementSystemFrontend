import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import FormField from '../../../components/form/FormField';
import Modal from '../../../components/modal/Modal';

const EMPTY = { topic: '', estimatedPeriods: 1, description: '' };

const SyllabusItemForm = ({ isOpen, onClose, onSubmit, loading, defaultValues }) => {
  const { control, handleSubmit, reset, formState: { isValid, errors } } = useForm({
    defaultValues: defaultValues || EMPTY,
    mode: 'onChange',
  });

  // Reset form whenever the modal opens or switches between edit/add
  useEffect(() => {
    reset(defaultValues || EMPTY);
  }, [isOpen, defaultValues, reset]);

  return (
    <Modal
      isOpen={isOpen}
      title={defaultValues ? 'Edit Syllabus Item' : 'Add Syllabus Item'}
      onClose={() => {
        reset(EMPTY);
        onClose();
      }}
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>
            {loading ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4">
        <FormField control={control} name="topic" label="Topic / Chapter" error={errors.topic} />
        <FormField control={control} name="estimatedPeriods" label="Estimated Periods" type="number" error={errors.estimatedPeriods} />
        <FormField control={control} name="description" label="Description" type="textarea" rows={4} error={errors.description} />
      </div>
    </Modal>
  );
};

export default SyllabusItemForm;
