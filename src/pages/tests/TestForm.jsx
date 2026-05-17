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

// Build a teacher's subject-teacher assignment list as combined class-section options
const buildSubjectTeacherClassOptions = (profile) => {
  const seen = new Map(); // key: classId-sectionId, value: { label, classId, sectionId }
  (profile?.subjectTeacherAssignments || []).forEach((s) => {
    const key = `${s.classId || ''}::${s.sectionId || ''}`;
    if (seen.has(key)) return;
    const isDefaultSection = s.sectionName === 'Default';
    seen.set(key, {
      classId: s.classId,
      sectionId: isDefaultSection ? null : s.sectionId,
      label: !s.sectionName || isDefaultSection ? `Class ${s.className}` : `Class ${s.className}-${s.sectionName}`,
      value: `${s.classId}::${s.sectionId || ''}`,
    });
  });
  return Array.from(seen.values());
};

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
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);

  const isResettingRef = useRef(false);
  const isTeacher = role === 'teacher';

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

  const teacherOptions = useMemo(() => buildSubjectTeacherClassOptions(profile), [profile]);

  useEffect(() => {
    dispatch(fetchClasses());
    if (isEdit) dispatch(fetchTestById(id));
  }, [dispatch, id, isEdit]);

  // Fetch sections only for admin — the teacher's combined dropdown already carries the sectionId
  useEffect(() => {
    if (isTeacher) return;
    if (classId && classHasSections) {
      dispatch(fetchSectionsByClass(classId));
    }
  }, [classId, classHasSections, dispatch, isTeacher]);

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

  // Fetch subjects: by sectionId when class has sections, by classId when it doesn't.
  // For teachers, narrow to subjects they teach so the dropdown only shows their own subjects.
  useEffect(() => {
    const filters = { scope: isTeacher ? 'my' : undefined };
    if (classHasSections && sectionId) {
      dispatch(fetchSubjects({ ...filters, sectionId }));
    } else if (!classHasSections && classId) {
      dispatch(fetchSubjects({ ...filters, classId }));
    }
  }, [dispatch, classId, sectionId, classHasSections, isTeacher]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      isResettingRef.current = true;
      const classIdValue = typeof current.classId === 'object' ? current.classId?._id : current.classId;
      const sectionIdValue = typeof current.sectionId === 'object' ? current.sectionId?._id : current.sectionId;
      const subjectIdValue = typeof current.subjectId === 'object' ? current.subjectId?._id : current.subjectId;
      const dateValue = current.testDate || current.date || '';
      reset({
        classId: classIdValue || '',
        sectionId: sectionIdValue || '',
        name: current.name || '',
        subjectId: subjectIdValue || '',
        testDate: dateValue ? String(dateValue).slice(0, 10) : '',
        maxScore: current.maxScore ?? 100,
      });
      setTimeout(() => { isResettingRef.current = false; }, 0);
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      date: values.testDate,
      sectionId: classHasSections ? values.sectionId : (values.sectionId || null),
    };
    const result = isEdit ? await dispatch(updateTest({ id, ...payload })) : await dispatch(createTest(payload));
    if (!result.error) navigate('/tests');
  };

  if (isEdit && loading && !current) return <Loader label="Loading test..." />;

  // Teacher combined dropdown value (matches an option)
  const teacherDropdownValue = useMemo(() => {
    if (!isTeacher) return '';
    return `${classId || ''}::${sectionId || ''}`;
  }, [isTeacher, classId, sectionId]);

  const onTeacherClassPick = (val) => {
    const opt = teacherOptions.find((o) => o.value === val);
    if (!opt) return;
    // Block the class/section cascade effects from racing and wiping the values we just set.
    isResettingRef.current = true;
    setValue('classId', opt.classId, { shouldValidate: true });
    setValue('sectionId', opt.sectionId || '', { shouldValidate: true });
    setValue('subjectId', '', { shouldValidate: true });
    dispatch(clearSubjects());
    setTimeout(() => { isResettingRef.current = false; }, 0);
  };

  return (
    <PageWrapper>
      <PageHeader
        backTo="/tests"
        backLabel="Back to Tests"
        title={isEdit ? 'Edit Test' : 'Create Test'}
        description="Create an assessment tied to a section-specific subject."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Test Details">
          {isTeacher && !isEdit ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class</label>
              <select
                className="input-field"
                value={teacherDropdownValue}
                onChange={(e) => onTeacherClassPick(e.target.value)}
              >
                <option value="::">Select class</option>
                {teacherOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.classId ? <span className="text-xs font-medium text-error">{errors.classId.message}</span> : null}
            </div>
          ) : (
            <>
              <FormField control={control} name="classId" label="Class" type="select" options={buildOptions(classes)} error={errors.classId} />
              {classHasSections ? (
                <FormField control={control} name="sectionId" label="Section" type="select" options={buildOptions(sections)} error={errors.sectionId} />
              ) : null}
            </>
          )}
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
