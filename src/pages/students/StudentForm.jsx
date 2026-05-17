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
import { BLOOD_GROUP_OPTIONS } from '../../utils/constants';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { createStudent, fetchStudentById, updateStudent } from '../../redux/actions/studentActions';
import { studentSchema } from '../../validation/studentSchema';
import { buildOptions } from '../../utils/helpers';

const StudentForm = () => {
  const handlePhoneKeyDown = (event) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowed.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  };

  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.students);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);

  const isResettingRef = useRef(false);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      name: '',
      rollNumber: '',
      dob: '',
      parentName: '',
      parentContact: '',
      email: '',
      classId: searchParams.get('classId') || '',
      sectionId: searchParams.get('sectionId') || profile?.sectionId || '',
      address: '',
      bloodGroup: '',
      notes: '',
    },
    mode: 'onChange',
  });

  const classId = watch('classId');

  const selectedClass = useMemo(
    () => (classId ? classes.find((c) => c._id === classId) ?? null : null),
    [classes, classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  useEffect(() => {
    dispatch(fetchClasses());
    if (isEdit) dispatch(fetchStudentById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (classId) {
      dispatch(fetchSectionsByClass(classId));
    }
  }, [classId, dispatch]);

  // When class changes (user interaction), clear section
  useEffect(() => {
    if (isResettingRef.current) return;
    dispatch(clearSections());
    setValue('sectionId', '');
  }, [classId]); // eslint-disable-line react-hooks/exhaustive-deps

  // For classes without sections, auto-pick the (single default) section once it loads
  useEffect(() => {
    if (!classId || classHasSections) return;
    if (sections.length > 0) {
      setValue('sectionId', sections[0]._id, { shouldValidate: true });
    }
  }, [classId, classHasSections, sections, setValue]);

  useEffect(() => {
    if (isEdit && current?._id === id) {
      isResettingRef.current = true;
      reset({
        ...current,
        // sectionId is populated as { _id, name, classId: { _id, name } }
        classId: current.sectionId?.classId?._id || current.sectionId?.classId || '',
        sectionId: current.sectionId?._id || current.sectionId || '',
      });
      setTimeout(() => { isResettingRef.current = false; }, 0);
    }
  }, [current, id, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      classId: undefined,
    };
    const result = isEdit ? await dispatch(updateStudent({ id, ...payload })) : await dispatch(createStudent(payload));
    if (!result.error) navigate(isEdit ? `/students/${id}` : '/students');
  };

  if (isEdit && loading && !current) return <Loader label="Loading student..." />;

  return (
    <PageWrapper>
      <PageHeader title={isEdit ? 'Edit Student' : 'Add Student'} description="Capture admission, guardian, and section information for each student." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Student Details">
          <FormField control={control} name="name" label="Student Name" error={errors.name} />
          <FormField control={control} name="rollNumber" label="Roll Number" error={errors.rollNumber} />
          <FormField control={control} name="dob" label="Date of Birth" type="date" error={errors.dob} />
          <FormField control={control} name="parentName" label="Parent Name" error={errors.parentName} />
          <FormField
            control={control}
            name="parentContact"
            label="Parent Contact"
            error={errors.parentContact}
            maxLength={10}
            inputMode="numeric"
            onKeyDown={handlePhoneKeyDown}
          />
          <FormField control={control} name="email" label="Email" type="email" error={errors.email} />
          {role === 'admin' ? (
            <FormField control={control} name="classId" label="Class" type="select" options={buildOptions(classes)} error={errors.classId} />
          ) : null}
          {classHasSections || role === 'teacher' ? (
            <FormField
              control={control}
              name="sectionId"
              label="Section"
              type="select"
              options={buildOptions(sections)}
              error={errors.sectionId}
              disabled={role === 'teacher'}
            />
          ) : null}
          <FormField control={control} name="bloodGroup" label="Blood Group" type="select" options={BLOOD_GROUP_OPTIONS.map((group) => ({ label: group, value: group }))} error={errors.bloodGroup} />
          <FormField control={control} name="address" label="Address" type="textarea" rows={4} error={errors.address} />
          <FormField control={control} name="notes" label="Notes" type="textarea" rows={4} error={errors.notes} />
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link to={isEdit ? `/students/${id}` : '/students'}><SecondaryButton type="button">Cancel</SecondaryButton></Link>
          <PrimaryButton type="submit" disabled={!isValid || loading}>{loading ? 'Saving...' : 'Save'}</PrimaryButton>
        </div>
      </form>
    </PageWrapper>
  );
};

export default StudentForm;
