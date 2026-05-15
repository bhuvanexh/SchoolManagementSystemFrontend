import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import FormField from '../../components/form/FormField';
import FormSection from '../../components/form/FormSection';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchCoreSubjects } from '../../redux/actions/coreSubjectActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { createSubject, fetchSubjectById, updateSubject } from '../../redux/actions/subjectActions';
import { fetchTeachers } from '../../redux/actions/teacherActions';
import { subjectSchema } from '../../validation/subjectSchema';
import { buildOptions } from '../../utils/helpers';

const SubjectForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.subjects);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const coreSubjects = useSelector((state) => state.coreSubjects.list);
  const teachers = useSelector((state) => state.teachers.list);

  const isResettingRef = useRef(false);

  const { control, watch, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      name: '',
      coreSubjectId: '',
      classId: searchParams.get('classId') || '',
      sectionId: searchParams.get('sectionId') || '',
      subjectTeacherId: '',
      periodsPerWeek: 1,
      subjectCode: '',
      description: '',
    },
    mode: 'onChange',
  });

  const classId = watch('classId');
  const sectionId = watch('sectionId');
  const coreSubjectId = watch('coreSubjectId');

  // Resolve whether the selected class uses sections
  const selectedClass = useMemo(() => classes.find((c) => c._id === classId), [classes, classId]);
  const classHasSections = selectedClass?.hasSections ?? false;

  // Section is required only when the class has sections
  const sectionError = classHasSections && !sectionId ? 'Please select a section' : null;
  const canSave = isValid && !loading && !sectionError;

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchCoreSubjects());
    dispatch(fetchTeachers());
    if (isEdit) dispatch(fetchSubjectById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (classId) dispatch(fetchSectionsByClass(classId));
  }, [classId, dispatch]);

  // When the class changes due to user interaction (not a reset), clear the section
  useEffect(() => {
    if (isResettingRef.current) {
      isResettingRef.current = false;
      return;
    }
    setValue('sectionId', '');
  }, [classId, setValue]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      isResettingRef.current = true;
      reset({
        ...current,
        classId: current.classId?._id || current.classId || '',
        sectionId: current.sectionId?._id || current.sectionId || '',
        coreSubjectId: current.coreSubjectId?._id || current.coreSubjectId || '',
        subjectTeacherId: current.subjectTeacherId?._id || current.subjectTeacherId || '',
      });
    }
  }, [current, id, isEdit, reset]);

  const filteredTeachers = useMemo(() => {
    const list = teachers.filter(
      (teacher) =>
        !coreSubjectId ||
        (teacher.coreSubjects || []).some((subject) => (subject._id || subject) === coreSubjectId)
    );
    return buildOptions(list);
  }, [coreSubjectId, teachers]);

  const onSubmit = async (values) => {
    const payload = { ...values };
    // Strip sectionId when the class has no sections
    if (!classHasSections) payload.sectionId = null;
    const result = isEdit
      ? await dispatch(updateSubject({ id, ...payload }))
      : await dispatch(createSubject(payload));
    if (!result.error) navigate('/subjects');
  };

  if (isEdit && (loading || !current || current._id !== id)) return <Loader label="Loading subject..." />;

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? 'Edit Subject' : 'Add Subject'}
        description="Attach the subject to a section and assign the right teacher to lead it."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Subject Setup">
          <FormField control={control} name="name" label="Subject Name" error={errors.name} />
          <FormField
            control={control}
            name="coreSubjectId"
            label="Core Subject"
            type="select"
            options={buildOptions(coreSubjects)}
            error={errors.coreSubjectId}
          />
          <FormField
            control={control}
            name="classId"
            label="Class"
            type="select"
            options={buildOptions(classes)}
            error={errors.classId}
          />
          {classHasSections ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Section
              </label>
              <FormField
                control={control}
                name="sectionId"
                label=""
                type="select"
                options={buildOptions(sections)}
                error={errors.sectionId}
              />
              {sectionError ? (
                <span className="text-xs font-medium text-error">{sectionError}</span>
              ) : null}
            </div>
          ) : null}
          <FormField
            control={control}
            name="subjectTeacherId"
            label="Subject Teacher"
            type="select"
            options={filteredTeachers}
            error={errors.subjectTeacherId}
          />
          <FormField
            control={control}
            name="periodsPerWeek"
            label="Periods per Week"
            type="number"
            error={errors.periodsPerWeek}
          />
          <FormField control={control} name="subjectCode" label="Subject Code" error={errors.subjectCode} />
          <FormField
            control={control}
            name="description"
            label="Description"
            type="textarea"
            rows={4}
            error={errors.description}
          />
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link to="/subjects"><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!canSave}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default SubjectForm;
