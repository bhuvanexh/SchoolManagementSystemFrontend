import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import Badge from '../../../components/data-display/Badge';
import EmptyState from '../../../components/feedback/EmptyState';
import Loader from '../../../components/feedback/Loader';
import PageHeader from '../../../components/layout/PageHeader';
import PageWrapper from '../../../components/layout/PageWrapper';
import { fetchResultsByTest, submitResults } from '../../../redux/actions/resultActions';
import { fetchStudents } from '../../../redux/actions/studentActions';
import { clearStudents } from '../../../redux/slices/studentSlice';
import { fetchTestById } from '../../../redux/actions/testActions';

const GradingSheet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const test = useSelector((state) => state.tests.current);
  const results = useSelector((state) => state.results.testResults);
  const students = useSelector((state) => state.students.list);
  const studentsLoading = useSelector((state) => state.students.loading);
  const loading = useSelector((state) => state.results.loading);
  const testLoading = useSelector((state) => state.tests.loading);
  const [rows, setRows] = useState({});

  const isReadOnly = Boolean(test?.isPublished);
  const maxScore = Number(test?.maxScore) || 0;

  // Reset shared students/list state on mount and unmount so we don't show stale students from /students
  useEffect(() => {
    dispatch(clearStudents());
    dispatch(fetchTestById(id));
    dispatch(fetchResultsByTest(id));
    return () => {
      dispatch(clearStudents());
    };
  }, [dispatch, id]);

  // Fetch students once the test is loaded — by sectionId if present, otherwise by classId
  useEffect(() => {
    if (!test || test._id !== id) return;
    const sectionId = typeof test.sectionId === 'object' ? test.sectionId?._id : test.sectionId;
    const classId = typeof test.classId === 'object' ? test.classId?._id : test.classId;
    if (sectionId) {
      dispatch(fetchStudents({ sectionId }));
    } else if (classId) {
      dispatch(fetchStudents({ classId }));
    }
  }, [dispatch, test, id]);

  useEffect(() => {
    const nextRows = {};
    students.forEach((student) => {
      const existing = results.find((result) => {
        const resultStudentId = typeof result.studentId === 'object' ? result.studentId?._id : result.studentId;
        return String(resultStudentId) === String(student._id);
      });
      nextRows[student._id] = {
        marksObtained: existing?.marksObtained ?? '',
        isAbsent: existing?.isAbsent ?? false,
      };
    });
    setRows(nextRows);
  }, [results, students]);

  if (testLoading && !test) return <Loader label="Loading grading sheet..." />;

  const subjectName = test?.subjectId?.name || test?.subject?.name || 'Subject';
  const className = test?.classId?.name;
  const sectionName = test?.sectionId?.name;
  const classSectionLabel = className
    ? (!sectionName || sectionName === 'Default' ? `Class ${className}` : `Class ${className}-${sectionName}`)
    : null;

  return (
    <PageWrapper>
      <PageHeader
        title={`${isReadOnly ? 'Results' : 'Grade'} — ${test?.name || 'Test'}`}
        description={
          [classSectionLabel, isReadOnly ? 'Published results (read-only).' : 'Enter marks for each student or mark them absent.']
            .filter(Boolean)
            .join(' · ')
        }
      />

      <section className="glass-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-sm font-semibold text-on-surface">{subjectName}</p>
            {classSectionLabel ? <span className="text-sm text-on-surface-variant">{classSectionLabel}</span> : null}
            <span className="text-sm text-on-surface-variant">Max score {maxScore || 0}</span>
          </div>
          {isReadOnly ? <Badge tone="success">Published</Badge> : null}
        </div>
      </section>

      {studentsLoading ? (
        <Loader label="Loading students..." />
      ) : students.length === 0 ? (
        <EmptyState
          title="No students"
          message="No active students found in this class/section."
        />
      ) : (
        <section className="glass-panel overflow-hidden">
          <div className="custom-scrollbar overflow-x-auto">
            <table className="min-w-full divide-y divide-white/40">
              <thead className="bg-white/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Marks Obtained</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Absent?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30 bg-white/20">
                {students.map((student) => {
                  const row = rows[student._id] || {};
                  return (
                    <tr key={student._id}>
                      <td className="px-4 py-3">{student.rollNumber}</td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">
                        {isReadOnly ? (
                          <span className="text-sm text-on-surface">
                            {row.isAbsent ? 'Absent' : (row.marksObtained !== '' ? `${row.marksObtained} / ${maxScore}` : '—')}
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max={maxScore}
                            className="input-field"
                            disabled={row.isAbsent}
                            value={row.marksObtained ?? ''}
                            onChange={(event) => {
                              const raw = event.target.value;
                              if (raw === '') {
                                setRows((current) => ({ ...current, [student._id]: { ...current[student._id], marksObtained: '' } }));
                                return;
                              }
                              const num = Number(raw);
                              if (Number.isNaN(num)) return;
                              const capped = num > maxScore ? maxScore : num < 0 ? 0 : num;
                              setRows((current) => ({ ...current, [student._id]: { ...current[student._id], marksObtained: capped } }));
                            }}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isReadOnly ? (
                          <span className="text-sm text-on-surface-variant">{row.isAbsent ? 'Yes' : 'No'}</span>
                        ) : (
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-primary"
                            checked={Boolean(row.isAbsent)}
                            onChange={(event) => setRows((current) => ({
                              ...current,
                              [student._id]: {
                                ...current[student._id],
                                isAbsent: event.target.checked,
                                marksObtained: event.target.checked ? '' : current[student._id]?.marksObtained,
                              },
                            }))}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!isReadOnly && students.length > 0 ? (
        <div className="flex justify-end">
          <PrimaryButton
            type="button"
            disabled={loading}
            onClick={async () => {
              const result = await dispatch(
                submitResults({
                  testId: id,
                  results: students.map((student) => ({
                    studentId: student._id,
                    marksObtained: rows[student._id]?.isAbsent ? 0 : Number(rows[student._id]?.marksObtained || 0),
                    isAbsent: Boolean(rows[student._id]?.isAbsent),
                  })),
                })
              );
              if (!result.error) {
                dispatch(fetchResultsByTest(id));
                navigate('/tests');
              }
            }}
          >
            {loading ? 'Saving...' : 'Submit Results'}
          </PrimaryButton>
        </div>
      ) : null}
    </PageWrapper>
  );
};

export default GradingSheet;
