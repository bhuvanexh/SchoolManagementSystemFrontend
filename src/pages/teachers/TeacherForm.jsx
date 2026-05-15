import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import FormField from '../../components/form/FormField';
import FormSection from '../../components/form/FormSection';
import Loader from '../../components/feedback/Loader';
import MultiSelect from '../../components/inputs/MultiSelect';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchCoreSubjects } from '../../redux/actions/coreSubjectActions';
import { createTeacher, fetchTeacherById, updateTeacher } from '../../redux/actions/teacherActions';
import { teacherSchema } from '../../validation/teacherSchema';

const TeacherForm = () => {
  const handlePhoneKeyDown = (event) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowed.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  };

  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.teachers);
  const coreSubjects = useSelector((state) => state.coreSubjects.list);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      coreSubjects: [],
      qualification: '',
      experience: '',
      address: '',
      notes: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    dispatch(fetchCoreSubjects());
    if (isEdit) {
      dispatch(fetchTeacherById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      reset({
        ...current,
        coreSubjects: (current.coreSubjects || []).map((item) => item._id || item),
      });
    }
  }, [current, id, isEdit, reset]);

  const subjectOptions = useMemo(
    () => coreSubjects.map((item) => ({ label: item.name, value: item._id })),
    [coreSubjects]
  );

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      coreSubjects: values.coreSubjects.filter(Boolean),
    };
    const result = isEdit
      ? await dispatch(updateTeacher({ id, ...payload }))
      : await dispatch(createTeacher(payload));

    if (!result.error) {
      navigate(isEdit ? `/teachers/${id}` : '/teachers');
    }
  };

  if (isEdit && loading && !current) {
    return <Loader label="Loading teacher..." />;
  }

  return (
    <PageWrapper>
      <PageHeader title={isEdit ? 'Edit Teacher' : 'Add Teacher'} description="Capture teacher identity details and subject specialization." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Teacher Profile">
          <FormField control={control} name="name" label="Full Name" error={errors.name} />
          <FormField control={control} name="email" label="Email" type="email" error={errors.email} />
          <FormField
            control={control}
            name="phone"
            label="Phone"
            error={errors.phone}
            maxLength={10}
            inputMode="numeric"
            onKeyDown={handlePhoneKeyDown}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Core Subjects</label>
            <Controller
              name="coreSubjects"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={subjectOptions}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select core subjects"
                  searchPlaceholder="Search subjects..."
                />
              )}
            />
            {errors.coreSubjects ? <span className="text-xs font-medium text-error">{errors.coreSubjects.message}</span> : null}
          </div>
          <FormField control={control} name="qualification" label="Qualification" error={errors.qualification} />
          <FormField control={control} name="experience" label="Experience" error={errors.experience} />
          <FormField control={control} name="address" label="Address" type="textarea" rows={4} error={errors.address} />
          <FormField control={control} name="notes" label="Notes" type="textarea" rows={4} error={errors.notes} />
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link to={isEdit ? `/teachers/${id}` : '/teachers'}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default TeacherForm;
