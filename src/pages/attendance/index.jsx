import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchSectionAttendance, fetchStudentAttendance, markAttendance } from '../../redux/actions/attendanceActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { fetchStudents } from '../../redux/actions/studentActions';
import { buildOptions } from '../../utils/helpers';
import AttendanceReport from './components/AttendanceReport';
import AttendanceSheet from './components/AttendanceSheet';

const Attendance = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);
  const students = useSelector((state) => state.students.list);
  const sections = useSelector((state) => state.sections.list);
  const records = useSelector((state) => state.attendance.records);
  const studentHistory = useSelector((state) => state.attendance.studentHistory);
  const loading = useSelector((state) => state.attendance.loading);
  const [mode, setMode] = useState('mark');
  const [filters, setFilters] = useState({
    sectionId: profile?.sectionId || '',
    date: new Date().toISOString().slice(0, 10),
    month: `${new Date().getMonth() + 1}`,
    year: `${new Date().getFullYear()}`,
  });
  const [values, setValues] = useState({});

  useEffect(() => {
    if (role === 'teacher' && profile?.classId) dispatch(fetchSectionsByClass(profile.classId));
  }, [dispatch, profile?.classId, role]);

  useEffect(() => {
    if (filters.sectionId) {
      dispatch(fetchStudents({ sectionId: filters.sectionId }));
      dispatch(fetchSectionAttendance({ sectionId: filters.sectionId, date: filters.date, month: filters.month, year: filters.year }));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    if (role === 'student' && profile?._id) {
      dispatch(fetchStudentAttendance({ studentId: profile._id, month: filters.month, year: filters.year }));
    }
  }, [dispatch, filters.month, filters.year, profile?._id, role]);

  useEffect(() => {
    const nextValues = {};
    students.forEach((student) => {
      nextValues[student._id] =
        records.find((record) => (record.studentId || record.student?._id) === student._id)?.status || 'present';
    });
    setValues(nextValues);
  }, [records, students]);

  const sectionOptions = useMemo(() => buildOptions(sections), [sections]);

  return (
    <PageWrapper>
      <PageHeader title="Attendance" description="Mark daily attendance and review attendance summaries by section or student." />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setMode('mark')} className={mode === 'mark' ? 'btn-primary' : 'btn-secondary'}>Mark Attendance</button>
        <button type="button" onClick={() => setMode('report')} className={mode === 'report' ? 'btn-primary' : 'btn-secondary'}>View Report</button>
      </div>

      <div className="glass-panel grid gap-4 p-6 md:grid-cols-4">
        {role !== 'student' ? <SelectInput value={filters.sectionId} onChange={(event) => setFilters((current) => ({ ...current, sectionId: event.target.value }))} options={sectionOptions} placeholder="Choose section" /> : null}
        <input className="input-field" type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
        <input className="input-field" type="number" min="1" max="12" value={filters.month} onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))} placeholder="Month" />
        <input className="input-field" type="number" value={filters.year} onChange={(event) => setFilters((current) => ({ ...current, year: event.target.value }))} placeholder="Year" />
      </div>

      {loading ? <Loader label="Loading attendance..." /> : null}

      {!loading && mode === 'mark' && role !== 'student' ? (
        <>
          <AttendanceSheet students={students} values={values} onChange={(studentId, status) => setValues((current) => ({ ...current, [studentId]: status }))} />
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              disabled={!filters.sectionId || loading}
              onClick={() =>
                dispatch(
                  markAttendance({
                    sectionId: filters.sectionId,
                    date: filters.date,
                    records: students.map((student) => ({
                      studentId: student._id,
                      status: values[student._id] || 'present',
                    })),
                  })
                )
              }
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </PrimaryButton>
          </div>
        </>
      ) : null}

      {!loading && mode === 'report' ? <AttendanceReport records={role === 'student' ? studentHistory : records} /> : null}
    </PageWrapper>
  );
};

export default Attendance;
