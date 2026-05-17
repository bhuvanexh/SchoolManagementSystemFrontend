import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Badge from '../../components/data-display/Badge';
import Loader from '../../components/feedback/Loader';
import EmptyState from '../../components/feedback/EmptyState';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchStudentAttendance } from '../../redux/actions/attendanceActions';
import { fetchResultsByStudent } from '../../redux/actions/resultActions';
import { fetchStudentById, fetchStudentSummary } from '../../redux/actions/studentActions';
import { clearCurrentStudent } from '../../redux/slices/studentSlice';
import ResultView from '../tests/components/ResultView';
import { formatDate } from '../../utils/formatters';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const TABS = ['attendance', 'results', 'syllabus'];

const StudentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const authProfile = useSelector((state) => state.auth.profile);
  const current = useSelector((state) => state.students.current);
  const summary = useSelector((state) => state.students.summary);
  const attendance = useSelector((state) => state.attendance.studentHistory);
  const attendanceLoading = useSelector((state) => state.attendance.loading);
  const results = useSelector((state) => state.results.studentResults);
  const resultsLoading = useSelector((state) => state.results.loading);
  const loading = useSelector((state) => state.students.loading);
  const [activeTab, setActiveTab] = useState('attendance');
  const [tabsLoaded, setTabsLoaded] = useState({ attendance: false, results: false });

  const studentId = id === 'me' || !id ? authProfile?._id : id;

  useEffect(() => {
    if (studentId) {
      // Reset any prior student data so it doesn't flash while loading
      dispatch(clearCurrentStudent());
      dispatch(fetchStudentById(studentId));
      dispatch(fetchStudentSummary(studentId));
      setTabsLoaded({ attendance: false, results: false });
    }
    return () => {
      dispatch(clearCurrentStudent());
    };
  }, [dispatch, studentId]);

  // Lazy-load attendance and results when tab is first visited
  useEffect(() => {
    if (!studentId) return;
    if (activeTab === 'attendance' && !tabsLoaded.attendance) {
      dispatch(fetchStudentAttendance({ studentId }));
      setTabsLoaded((prev) => ({ ...prev, attendance: true }));
    }
    if (activeTab === 'results' && !tabsLoaded.results) {
      dispatch(fetchResultsByStudent(studentId));
      setTabsLoaded((prev) => ({ ...prev, results: true }));
    }
  }, [activeTab, studentId, tabsLoaded, dispatch]);

  if (loading && !current) return <Loader label="Loading student details..." />;

  const syllabusItems = summary?.syllabusItems || [];
  const summaryLoading = !summary;

  return (
    <PageWrapper>
      <PageHeader
        backTo="/students"
        backLabel="Back to Students"
        title={current?.name || 'Student Detail'}
        description="Attendance, academic performance, and syllabus visibility in one place."
        actions={role !== 'student' && studentId ? <Link to={`/students/${studentId}/edit`}><PrimaryButton>Edit Student</PrimaryButton></Link> : null}
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roll No</p><p className="mt-2 font-semibold text-on-surface">{current?.rollNumber || '—'}</p></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class</p>
            {current?.sectionId?.classId?._id ? (
              <Link to={`/classes/${current.sectionId.classId._id}`} className="mt-2 inline-block font-semibold text-primary hover:underline">
                {current.sectionId.classId.name}
                {current.sectionId.name && current.sectionId.name !== 'Default' ? `-${current.sectionId.name}` : ''}
              </Link>
            ) : <p className="mt-2 font-semibold text-on-surface">—</p>}
          </div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Parent</p><p className="mt-2 font-semibold text-on-surface">{current?.parentName || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contact</p><p className="mt-2 font-semibold text-on-surface">{current?.parentContact || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Attendance</p><p className="mt-2 font-semibold text-on-surface">{summary?.attendancePercentage ?? '—'}%</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Days Present</p><p className="mt-2 font-semibold text-on-surface">{summary?.presentDays ?? '—'} / {summary?.totalDays ?? '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Syllabus</p><p className="mt-2 font-semibold text-on-surface">{syllabusItems.length ? `${syllabusItems.filter(i => i.status === 'completed').length} / ${syllabusItems.length} topics` : '—'}</p></div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'attendance' ? (
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Attendance History</h2>
          {attendanceLoading ? (
            <Loader label="Loading attendance..." />
          ) : attendance.length === 0 ? (
            <p className="mt-4 text-sm text-on-surface-variant">No attendance records found.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {attendance.map((record) => (
                <div key={record._id} className="flex items-center justify-between rounded-glass-sm bg-white/50 px-4 py-3">
                  <p className="text-sm font-semibold text-on-surface">{formatDate(record.date)}</p>
                  <Badge tone={record.status === 'present' ? 'success' : record.status === 'absent' ? 'error' : 'neutral'}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === 'results' ? (
        resultsLoading ? (
          <section className="glass-panel p-6"><Loader label="Loading results..." /></section>
        ) : (
          <ResultView results={results} />
        )
      ) : null}

      {activeTab === 'syllabus' ? (
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Syllabus</h2>
          {summaryLoading ? (
            <Loader label="Loading syllabus..." />
          ) : syllabusItems.length === 0 ? (
            <EmptyState title="No syllabus items" message="Syllabus topics will appear here once added." />
          ) : (
            <div className="mt-4 space-y-3">
              {syllabusItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3 rounded-glass-sm bg-white/50 px-4 py-3">
                  <div className="min-w-0">
                    <p className={`font-semibold text-on-surface ${item.status === 'completed' ? 'line-through opacity-60' : ''}`}>{item.topic}</p>
                    <p className="mt-0.5 text-sm text-on-surface-variant">
                      {item.subjectId?.name}
                      {item.estimatedPeriods ? ` · ${item.estimatedPeriods} ${item.estimatedPeriods === 1 ? 'lecture' : 'lectures'}` : ''}
                    </p>
                    {item.description ? <p className="mt-1 text-xs text-on-surface-variant/80">{item.description}</p> : null}
                  </div>
                  <Badge tone={item.status === 'completed' ? 'success' : 'neutral'}>{item.status === 'completed' ? 'Done' : 'Pending'}</Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </PageWrapper>
  );
};

export default StudentDetail;
