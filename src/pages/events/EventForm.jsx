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
import { NOTICE_VISIBILITY } from '../../utils/constants';
import { fetchClasses } from '../../redux/actions/classActions';
import { createEvent, fetchEventById, updateEvent } from '../../redux/actions/eventActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { buildOptions } from '../../utils/helpers';
import { eventSchema } from '../../validation/eventSchema';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const current = useSelector((state) => state.events.current);
  const loading = useSelector((state) => state.events.loading);

  const { control, watch, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: { title: '', dateTime: '', visibility: role === 'teacher' ? 'class' : 'school', targetId: '', description: '', location: '', organizer: '', classId: '' },
    mode: 'onChange',
  });

  const visibility = watch('visibility');
  const classId = watch('classId');

  useEffect(() => {
    dispatch(fetchClasses());
    if (isEdit) dispatch(fetchEventById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (classId) dispatch(fetchSectionsByClass(classId));
  }, [classId, dispatch]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      reset({
        ...current,
        dateTime: (current.dateTime || '').slice(0, 16),
      });
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      dateTime: values.dateTime,
      visibility: values.visibility,
      targetId: values.targetId || null,
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
      <PageHeader title={isEdit ? 'Edit Event' : 'Create Event'} description="Schedule a school, class, or section event with the right audience." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Event Details">
          <FormField control={control} name="title" label="Event Title" error={errors.title} />
          <FormField control={control} name="dateTime" label="Date & Time" type="datetime-local" error={errors.dateTime} />
          <FormField control={control} name="visibility" label="Visibility" type="select" options={NOTICE_VISIBILITY.filter((option) => role === 'teacher' ? option.value !== 'school' : true)} error={errors.visibility} />
          {visibility === 'class' ? <FormField control={control} name="targetId" label="Target Class" type="select" options={buildOptions(classes)} error={errors.targetId} /> : null}
          {visibility === 'section' ? (
            <>
              <FormField control={control} name="classId" label="Class" type="select" options={buildOptions(classes)} error={errors.classId} />
              <FormField control={control} name="targetId" label="Target Section" type="select" options={buildOptions(sections)} error={errors.targetId} />
            </>
          ) : null}
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
