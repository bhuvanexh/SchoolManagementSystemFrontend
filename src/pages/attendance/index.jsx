import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import ClassSectionFilter from '../../components/filters/ClassSectionFilter';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useFilterParams from '../../hooks/useFilterParams';
import { fetchSectionAttendance, fetchStudentAttendance, markAttendance } from '../../redux/actions/attendanceActions';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { fetchStudents } from '../../redux/actions/studentActions';
import { buildOptions } from '../../utils/helpers';
import AttendanceReport from './components/AttendanceReport';
import AttendanceSheet from './components/AttendanceSheet';

const today = new Date().toISOString().slice(0, 10);

const Attendance = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const students = useSelector((state) => state.students.list);
  const records = useSelector((state) => state.attendance.records);
  const studentHistory = useSelector((state) => state.attendance.studentHistory);
  const loading = useSelector((state) => state.attendance.loading);
  const [mode, setMode] = useState(role === 'student' ? 'report' : 'mark');
  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [params, setParams] = useFilterParams();

  const date = params.date || today;
  const classId = params.classId;
  const sectionId = params.sectionId;

  const [dateYear, dateMonth] = date.split('-');
  const month = String(Number(dateMonth));
  const year = dateYear;

  const selectedClass = useMemo(
    () => (classId ? classes.find((c) => c._id === classId) ?? null : null),
    [classes, classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  // Resolve the effective sectionId: for classes without sections, use the auto-default section
  const effectiveSectionId = useMemo(() => {
    if (sectionId) return sectionId;
    if (classId && selectedClass && !selectedClass.hasSections && sections.length > 0) {
      return sections[0]._id;
    }
    return '';
  }, [sectionId, classId, selectedClass, sections]);

  useEffect(() => {
    if (role !== 'student') dispatch(fetchClasses());
  }, [dispatch, role]);

  // Pre-fill teacher's single class+section assignment into URL params
  useEffect(() => {
    if (role === 'teacher' && profile?.classTeacherSections?.length === 1) {
      const assignment = profile.classTeacherSections[0];
      if (!classId && !sectionId) {
        setParams({ classId: assignment.classId || '', sectionId: assignment.sectionId || '' });
      }
    }
  }, [profile?.classTeacherSections, role]);

  // Fetch sections whenever class changes so we can resolve the default section
  useEffect(() => {
    if (classId) dispatch(fetchSectionsByClass(classId));
  }, [classId, dispatch]);

  // Fetch students + section attendance whenever effective section or date changes
  useEffect(() => {
    if (effectiveSectionId) {
      dispatch(fetchStudents({ sectionId: effectiveSectionId }));
      dispatch(fetchSectionAttendance({ sectionId: effectiveSectionId, date, month, year }));
    }
  }, [effectiveSectionId, date, dispatch]);

  // Student role: fetch own attendance when month/year changes
  useEffect(() => {
    if (role === 'student' && profile?._id) {
      dispatch(fetchStudentAttendance({ studentId: profile._id, month, year }));
    }
  }, [dispatch, month, year, profile?._id, role]);

  // Seed mark-attendance toggles from saved records.
  // r.studentId is a populated object from the API, so compare by _id.
  // Also snapshot these as initialValues so we can compute the delta later.
  useEffect(() => {
    const next = {};
    const initial = {};
    students.forEach((student) => {
      const record = records.find((r) => {
        const id = r.studentId?._id || r.studentId;
        return id?.toString() === student._id?.toString();
      });
      const status = record?.status || 'present';
      next[student._id] = status;
      // Initial value is only set if there's a saved record; otherwise it's "unsaved"
      initial[student._id] = record?.status || null;
    });
    setValues(next);
    setInitialValues(initial);
  }, [records, students]);

  // Compute which student rows have changed vs. saved records (or are newly being saved)
  const changedRecords = useMemo(() => {
    return students
      .filter((s) => {
        const current = values[s._id] || 'present';
        const saved = initialValues[s._id];
        // Changed if no saved record exists OR the value differs from saved
        return saved === null || saved === undefined || saved !== current;
      })
      .map((s) => ({ studentId: s._id, status: values[s._id] || 'present' }));
  }, [students, values, initialValues]);

  const hasChanges = changedRecords.length > 0;

  // Set of studentIds that have a saved record for the selected date
  const savedStudentIds = useMemo(
    () => new Set(records.map((r) => (r.studentId?._id || r.studentId)?.toString())),
    [records]
  );

  const classOptions = useMemo(() => {
    if (role === 'admin') return buildOptions(classes);
    const allowedClassIds = new Set(
      (profile?.classTeacherSections || []).map((item) => item.classId).filter(Boolean)
    );
    return buildOptions(classes.filter((item) => allowedClassIds.has(item._id)));
  }, [classes, profile?.classTeacherSections, role]);

  const singleSectionTeacher = role === 'teacher' && (profile?.classTeacherSections || []).length === 1;

  const dateInput = (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</label>
      <input
        className="input-field"
        type="date"
        value={date}
        max={today}
        onChange={(e) => setParams({ date: e.target.value })}
      />
    </div>
  );

  const markedCount = students.filter((s) => savedStudentIds.has(s._id?.toString())).length;
  const allMarked = students.length > 0 && markedCount === students.length;

  return (
    <PageWrapper>
      <PageHeader title="Attendance" description="Mark daily attendance and review attendance summaries by section or student." />

      {role !== 'student' ? (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setMode('mark')} className={mode === 'mark' ? 'btn-primary' : 'btn-secondary'}>Mark Attendance</button>
          <button type="button" onClick={() => setMode('report')} className={mode === 'report' ? 'btn-primary' : 'btn-secondary'}>View Report</button>
        </div>
      ) : null}

      {role !== 'student' ? (
        <ClassSectionFilter
          classOptions={classOptions}
          disabled={singleSectionTeacher}
          className="md:grid-cols-3"
          extra={dateInput}
        />
      ) : (
        <div className="glass-panel p-6">{dateInput}</div>
      )}

      {loading ? <Loader label="Loading attendance..." /> : null}

      {!loading && mode === 'mark' && role !== 'student' ? (
        !classId ? (
          <EmptyState title="No class selected" message="Choose a class above to mark attendance." />
        ) : classHasSections && !sectionId ? (
          <EmptyState title="No section selected" message="Choose a section above to mark attendance." />
        ) : !students.length ? (
          <EmptyState title="No students" message="No active students found in this class." />
        ) : (
          <>
            {allMarked ? (
              <div className="glass-panel-sm p-4 text-sm text-on-surface-variant">
                Attendance already recorded for all {students.length} students on {date}. You can still edit and re-save.
              </div>
            ) : markedCount > 0 ? (
              <div className="glass-panel-sm p-4 text-sm text-on-surface-variant">
                {markedCount} of {students.length} students already have attendance recorded for {date}.
              </div>
            ) : null}
            <AttendanceSheet
              students={students}
              values={values}
              savedStudentIds={savedStudentIds}
              onChange={(studentId, status) => setValues((cur) => ({ ...cur, [studentId]: status }))}
            />
            <div className="flex items-center justify-end gap-3">
              {!hasChanges && allMarked ? (
                <p className="text-xs text-on-surface-variant">No changes to save.</p>
              ) : null}
              <PrimaryButton
                type="button"
                disabled={loading || !effectiveSectionId || !hasChanges}
                onClick={() =>
                  dispatch(
                    markAttendance({
                      sectionId: effectiveSectionId,
                      date,
                      records: changedRecords,
                    })
                  )
                }
              >
                {loading ? 'Saving...' : `Save Attendance${hasChanges ? ` (${changedRecords.length})` : ''}`}
              </PrimaryButton>
            </div>
          </>
        )
      ) : null}

      {!loading && mode === 'report' ? (
        <AttendanceReport records={role === 'student' ? studentHistory : records} />
      ) : null}
    </PageWrapper>
  );
};

export default Attendance;
