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
import { fetchSubjects } from '../../redux/actions/subjectActions';
import { createTest, fetchTestById, updateTest } from '../../redux/actions/testActions';
import { buildOptions } from '../../utils/helpers';
import { testSchema } from '../../validation/testSchema';

const TestForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subjects = useSelector((state) => state.subjects.list);
  const current = useSelector((state) => state.tests.current);
  const loading = useSelector((state) => state.tests.loading);

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(testSchema),
    defaultValues: { name: '', subjectId: '', testDate: '', maxScore: 100 },
    mode: 'onChange',
  });

  useEffect(() => {
    dispatch(fetchSubjects({}));
    if (isEdit) dispatch(fetchTestById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      reset({
        name: current.name,
        subjectId: current.subject?._id || current.subjectId || '',
        testDate: (current.date || current.testDate || '').slice(0, 10),
        maxScore: current.maxScore,
      });
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      date: values.testDate,
    };
    const result = isEdit ? await dispatch(updateTest({ id, ...payload })) : await dispatch(createTest(payload));
    if (!result.error) navigate('/tests');
  };

  if (isEdit && loading && !current) return <Loader label="Loading test..." />;

  return (
    <PageWrapper>
      <PageHeader title={isEdit ? 'Edit Test' : 'Create Test'} description="Create an assessment tied to a section-specific subject." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Test Details">
          <FormField control={control} name="name" label="Test Name" error={errors.name} />
          <FormField control={control} name="subjectId" label="Subject" type="select" options={buildOptions(subjects)} error={errors.subjectId} />
          <FormField control={control} name="testDate" label="Test Date" type="date" error={errors.testDate} />
          <FormField control={control} name="maxScore" label="Maximum Score" type="number" error={errors.maxScore} />
        </FormSection>
        <div className="flex justify-end gap-3">
          <Link to="/tests"><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default TestForm;
