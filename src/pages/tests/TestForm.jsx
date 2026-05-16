import { useEffect, useMemo, useRef } from 'react';
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
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { fetchSubjects } from '../../redux/actions/subjectActions';
import { clearSubjects } from '../../redux/slices/subjectSlice';
import { createTest, fetchTestById, updateTest } from '../../redux/actions/testActions';
import { buildOptions } from '../../utils/helpers';
import { testSchema } from '../../validation/testSchema';

const TestForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const subjects = useSelector((state) => state.subjects.list);
  const current = useSelector((state) => state.tests.current);
  const loading = useSelector((state) => state.tests.loading);

  const isResettingRef = useRef(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(testSchema),
    defaultValues: { classId: '', sectionId: '', name: '', subjectId: '', testDate: '', maxScore: 100 },
    mode: 'onChange',
  });

  const classId = watch('classId');
  const sectionId = watch('sectionId');

  const selectedClass = useMemo(
    () => (classId ? classes.find((c) => c._id === classId) ?? null : null),
    [classes, classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  useEffect(() => {
    dispatch(fetchClasses());
    if (isEdit) dispatch(fetchTestById(id));
  }, [dispatch, id, isEdit]);

  // Fetch sections only when the class has sections
  useEffect(() => {
    if (classId && classHasSections) {
      dispatch(fetchSectionsByClass(classId));
    }
  }, [classId, classHasSections, dispatch]);

  // When class changes (user interaction), cascade-clear section + subject
  useEffect(() => {
    if (isResettingRef.current) return;
    dispatch(clearSections());
    dispatch(clearSubjects());
    setValue('sectionId', '');
    setValue('subjectId', '');
  }, [classId]); // eslint-disable-line react-hooks/exhaustive-deps

  // When section changes (user interaction), clear subject
  useEffect(() => {
    if (isResettingRef.current) return;
    dispatch(clearSubjects());
    setValue('subjectId', '');
  }, [sectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch subjects: by sectionId when class has sections, by classId when it doesn't
  useEffect(() => {
    if (classHasSections && sectionId) {
      dispatch(fetchSubjects({ sectionId }));
    } else if (!classHasSections && classId) {
      dispatch(fetchSubjects({ classId }));
    }
  }, [dispatch, classId, sectionId, classHasSections]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      isResettingRef.current = true;
      reset({
        classId: current.classId?._id || current.class?._id || current.classId || '',
        sectionId: current.sectionId?._id || current.section?._id || current.sectionId || '',
        name: current.name,
        subjectId: current.subjectId?._id || current.subject?._id || current.subjectId || '',
        testDate: (current.date || current.testDate || '').slice(0, 10),
        maxScore: current.maxScore,
      });
      setTimeout(() => { isResettingRef.current = false; }, 0);
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      date: values.testDate,
      sectionId: classHasSections ? values.sectionId : null,
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
          <FormField control={control} name="classId" label="Class" type="select" options={buildOptions(classes)} error={errors.classId} />
          {classHasSections ? (
            <FormField control={control} name="sectionId" label="Section" type="select" options={buildOptions(sections)} error={errors.sectionId} />
          ) : null}
          <FormField control={control} name="name" label="Test Name" error={errors.name} />
          <FormField
            control={control}
            name="subjectId"
            label="Subject"
            type="select"
            options={buildOptions(subjects)}
            error={errors.subjectId}
          />
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
