import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import FormField from '../../components/form/FormField';
import FormSection from '../../components/form/FormSection';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { createClass, fetchClassById, updateClass } from '../../redux/actions/classActions';
import { fetchTeachers } from '../../redux/actions/teacherActions';
import { classSchema } from '../../validation/classSchema';
import { buildOptions } from '../../utils/helpers';

const ClassForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.classes);
  const teachers = useSelector((state) => state.teachers.list);

  const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: { name: '', hasSections: false, classTeacherId: '', academicYear: '', roomNumber: '', notes: '' },
    mode: 'onChange',
  });

  const hasSections = watch('hasSections');

  useEffect(() => {
    dispatch(fetchTeachers());
    if (isEdit) dispatch(fetchClassById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      reset({
        ...current,
        classTeacherId: current.classTeacher?._id || current.classTeacherId || '',
      });
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const result = isEdit
      ? await dispatch(updateClass({ id, ...values }))
      : await dispatch(createClass(values));

    if (!result.error) navigate(isEdit ? `/classes/${id}` : '/classes');
  };

  if (isEdit && loading && !current) return <Loader label="Loading class..." />;

  return (
    <PageWrapper>
      <PageHeader title={isEdit ? 'Edit Class' : 'Add Class'} description="Set up a class and define whether it runs directly or via sections." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Class Setup">
          <FormField control={control} name="name" label="Class Name" error={errors.name} />
          <FormField control={control} name="hasSections" label="Has Sections" type="checkbox" error={errors.hasSections} />
          {!hasSections ? <FormField control={control} name="classTeacherId" label="Class Teacher" type="select" options={buildOptions(teachers)} error={errors.classTeacherId} /> : null}
          <FormField control={control} name="academicYear" label="Academic Year" error={errors.academicYear} />
          {!hasSections ? <FormField control={control} name="roomNumber" label="Room Number" error={errors.roomNumber} /> : null}
          <FormField control={control} name="notes" label="Notes" type="textarea" rows={4} error={errors.notes} />
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link to={isEdit ? `/classes/${id}` : '/classes'}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default ClassForm;
