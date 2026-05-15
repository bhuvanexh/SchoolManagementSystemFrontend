import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchStudentAttendance } from '../../redux/actions/attendanceActions';
import { fetchResultsByStudent } from '../../redux/actions/resultActions';
import { fetchStudentById, fetchStudentSummary } from '../../redux/actions/studentActions';
import { calculateProgress } from '../../utils/helpers';
import ResultView from '../tests/components/ResultView';

const tabs = ['attendance', 'results', 'syllabus'];

const StudentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const authProfile = useSelector((state) => state.auth.profile);
  const current = useSelector((state) => state.students.current);
  const summary = useSelector((state) => state.students.summary);
  const attendance = useSelector((state) => state.attendance.studentHistory);
  const results = useSelector((state) => state.results.studentResults);
  const loading = useSelector((state) => state.students.loading);
  const [activeTab, setActiveTab] = useState('attendance');
  const studentId = id === 'me' || !id ? authProfile?._id : id;

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
      dispatch(fetchStudentSummary(studentId));
      dispatch(fetchStudentAttendance({ studentId }));
      dispatch(fetchResultsByStudent(studentId));
    }
  }, [dispatch, studentId]);

  const syllabusProgress = useMemo(() => calculateProgress(summary?.syllabusItems || []), [summary]);

  if (loading && !current) return <Loader label="Loading student details..." />;

  return (
    <PageWrapper>
      <PageHeader
        title={current?.name || 'Student Detail'}
        description="Attendance, academic performance, and syllabus visibility in one place."
        actions={role !== 'student' && studentId ? <Link to={`/students/${studentId}/edit`}><PrimaryButton>Edit Student</PrimaryButton></Link> : null}
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roll No</p><p className="mt-2 font-semibold text-on-surface">{current?.rollNumber || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class</p><p className="mt-2 font-semibold text-on-surface">{current?.sectionId?.classId?.name || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Section</p><p className="mt-2 font-semibold text-on-surface">{current?.sectionId?.name || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Parent</p><p className="mt-2 font-semibold text-on-surface">{current?.parentName || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Syllabus Progress</p><p className="mt-2 font-semibold text-on-surface">{syllabusProgress}%</p></div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
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
          <h2 className="text-xl font-bold text-on-surface">Attendance</h2>
          <div className="mt-4 space-y-3">
            {attendance.map((record) => (
              <div key={record._id} className="rounded-glass-sm bg-white/50 p-4">
                <p className="font-semibold text-on-surface">{record.date}</p>
                <p className="mt-1 text-sm capitalize text-on-surface-variant">{record.status}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'results' ? <ResultView results={results} /> : null}

      {activeTab === 'syllabus' ? (
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Syllabus</h2>
          <div className="mt-4 space-y-3">
            {(summary?.syllabusItems || []).map((item) => (
              <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
                <p className="font-semibold text-on-surface">{item.topic}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.subjectName} · {item.status}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </PageWrapper>
  );
};

export default StudentDetail;
