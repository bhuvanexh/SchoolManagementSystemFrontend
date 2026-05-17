import { useEffect, useMemo } from 'react';
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
import { NOTICE_VISIBILITY } from '../../utils/constants';
import { fetchClasses } from '../../redux/actions/classActions';
import { createEvent, fetchEventById, updateEvent } from '../../redux/actions/eventActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { buildOptions } from '../../utils/helpers';
import { eventSchema } from '../../validation/eventSchema';

const buildTeacherTargetOptions = (profile) => {
  const seen = new Map();
  const add = ({ classId, className, sectionId, sectionName }) => {
    const isDefault = sectionName === 'Default';
    const key = isDefault || !sectionId ? `class:${classId}` : `section:${sectionId}`;
    if (seen.has(key)) return;
    seen.set(key, {
      value: key,
      label: !sectionName || isDefault ? `Class ${className}` : `Class ${className}-${sectionName}`,
      visibility: !sectionName || isDefault ? 'class' : 'section',
      targetId: !sectionName || isDefault ? classId : sectionId,
    });
  };
  (profile?.classTeacherSections || []).forEach((s) =>
    add({ classId: s.classId, className: s.className, sectionId: s.sectionId, sectionName: s.sectionName })
  );
  (profile?.classTeacherClasses || []).forEach((c) =>
    add({ classId: c.classId, className: c.className })
  );
  (profile?.subjectTeacherAssignments || []).forEach((s) =>
    add({ classId: s.classId, className: s.className, sectionId: s.sectionId, sectionName: s.sectionName })
  );
  return Array.from(seen.values());
};

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const current = useSelector((state) => state.events.current);
  const loading = useSelector((state) => state.events.loading);

  const isTeacher = role === 'teacher';
  const teacherOptions = useMemo(() => buildTeacherTargetOptions(profile), [profile]);

  const { control, watch, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: '',
      dateTime: '',
      visibility: isTeacher ? 'class' : 'school',
      targetId: '',
      description: '',
      location: '',
      organizer: '',
      classId: '',
      teacherTarget: '',
    },
    mode: 'onChange',
  });

  const visibility = watch('visibility');
  const classId = watch('classId');

  const selectedClass = useMemo(
    () => (classId ? classes.find((c) => c._id === classId) ?? null : null),
    [classes, classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  useEffect(() => {
    if (!isTeacher) dispatch(fetchClasses());
    if (isEdit) dispatch(fetchEventById(id));
  }, [dispatch, id, isEdit, isTeacher]);

  useEffect(() => {
    if (!isTeacher && classId && classHasSections) {
      dispatch(fetchSectionsByClass(classId));
    }
  }, [classId, classHasSections, dispatch, isTeacher]);

  useEffect(() => {
    if (isTeacher) return;
    dispatch(clearSections());
    setValue('targetId', '');
  }, [classId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEdit && current?._id === id) {
      reset({
        ...current,
        dateTime: (current.dateTime || '').slice(0, 16),
        teacherTarget: '',
      });
    }
  }, [current, id, isEdit, reset]);

  const onTeacherTargetPick = (value) => {
    const opt = teacherOptions.find((o) => o.value === value);
    if (!opt) return;
    setValue('teacherTarget', value, { shouldValidate: true });
    setValue('visibility', opt.visibility, { shouldValidate: true });
    setValue('targetId', opt.targetId, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      dateTime: values.dateTime,
      visibility: values.visibility,
      targetId: values.visibility === 'school' || values.visibility === 'teachers' ? null : (values.targetId || null),
      description: values.description,
      location: values.location,
      organizer: values.organizer,
    };
    const result = isEdit ? await dispatch(updateEvent({ id, ...payload })) : await dispatch(createEvent(payload));
    if (!result.error) navigate('/events');
  };

  if (isEdit && loading && !current) return <Loader label="Loading event..." />;

  return (
    <PageWrapper>
      <PageHeader
        backTo="/events"
        backLabel="Back to Events"
        title={isEdit ? 'Edit Event' : 'Create Event'}
        description="Schedule a school, class, or section event with the right audience."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Event Details">
          <FormField control={control} name="title" label="Event Title" error={errors.title} />
          <FormField control={control} name="dateTime" label="Date & Time" type="datetime-local" error={errors.dateTime} />

          {isTeacher ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class</label>
              <select
                className="input-field"
                value={watch('teacherTarget') || ''}
                onChange={(e) => onTeacherTargetPick(e.target.value)}
              >
                <option value="">Select class</option>
                {teacherOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {teacherOptions.length === 0 ? (
                <p className="text-xs text-on-surface-variant">You don't teach any class yet.</p>
              ) : null}
              {errors.targetId ? <span className="text-xs font-medium text-error">{errors.targetId.message}</span> : null}
            </div>
          ) : (
            <>
              <FormField
                control={control}
                name="visibility"
                label="Visibility"
                type="select"
                options={NOTICE_VISIBILITY}
                error={errors.visibility}
              />
              {visibility === 'class' ? (
                <FormField control={control} name="targetId" label="Target Class" type="select" options={buildOptions(classes)} error={errors.targetId} />
              ) : null}
              {visibility === 'section' ? (
                <>
                  <FormField control={control} name="classId" label="Class" type="select" options={buildOptions(classes)} error={errors.classId} />
                  {classHasSections ? (
                    <FormField control={control} name="targetId" label="Target Section" type="select" options={buildOptions(sections)} error={errors.targetId} />
                  ) : classId ? (
                    <p className="text-sm text-on-surface-variant">This class has no sections. Choose a different class or change visibility to Class.</p>
                  ) : null}
                </>
              ) : null}
            </>
          )}

          <FormField control={control} name="location" label="Location" error={errors.location} />
          <FormField control={control} name="organizer" label="Organizer" error={errors.organizer} />
          <FormField control={control} name="description" label="Description" type="textarea" rows={5} error={errors.description} />
        </FormSection>
        <div className="flex justify-end gap-3">
          <Link to="/events"><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default EventForm;
