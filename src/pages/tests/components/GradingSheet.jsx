import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import Loader from '../../../components/feedback/Loader';
import PageHeader from '../../../components/layout/PageHeader';
import PageWrapper from '../../../components/layout/PageWrapper';
import { fetchResultsByTest, submitResults } from '../../../redux/actions/resultActions';
import { fetchStudents } from '../../../redux/actions/studentActions';
import { fetchTestById } from '../../../redux/actions/testActions';

const GradingSheet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const test = useSelector((state) => state.tests.current);
  const results = useSelector((state) => state.results.testResults);
  const students = useSelector((state) => state.students.list);
  const loading = useSelector((state) => state.results.loading);
  const [rows, setRows] = useState({});

  useEffect(() => {
    dispatch(fetchTestById(id));
    dispatch(fetchResultsByTest(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (test?.sectionId || test?.section?._id) {
      dispatch(fetchStudents({ sectionId: test.sectionId || test.section?._id }));
    }
  }, [dispatch, test]);

  useEffect(() => {
    const nextRows = {};
    students.forEach((student) => {
      const existing = results.find((result) => (result.studentId || result.student?._id) === student._id);
      nextRows[student._id] = {
        marksObtained: existing?.marksObtained ?? '',
        isAbsent: existing?.isAbsent ?? false,
      };
    });
    setRows(nextRows);
  }, [results, students]);

  if (loading && !test) return <Loader label="Loading grading sheet..." />;

  return (
    <PageWrapper>
      <PageHeader title={`Grade ${test?.name || 'Test'}`} description="Enter marks for each student or mark them absent when needed." />

      <section className="glass-panel p-6">
        <p className="text-sm text-on-surface-variant">{test?.subject?.name || 'Subject'} · Max score {test?.maxScore || 0}</p>
      </section>

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
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-4 py-3">{student.rollNumber}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max={test?.maxScore || 100}
                      className="input-field"
                      disabled={rows[student._id]?.isAbsent}
                      value={rows[student._id]?.marksObtained ?? ''}
                      onChange={(event) => setRows((current) => ({
                        ...current,
                        [student._id]: { ...current[student._id], marksObtained: event.target.value },
                      }))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={Boolean(rows[student._id]?.isAbsent)}
                      onChange={(event) => setRows((current) => ({
                        ...current,
                        [student._id]: {
                          ...current[student._id],
                          isAbsent: event.target.checked,
                          marksObtained: event.target.checked ? '' : current[student._id]?.marksObtained,
                        },
                      }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
                  marksObtained: Number(rows[student._id]?.marksObtained || 0),
                  isAbsent: Boolean(rows[student._id]?.isAbsent),
                })),
              })
            );
            if (!result.error) navigate('/tests');
          }}
        >
          {loading ? 'Saving...' : 'Submit Results'}
        </PrimaryButton>
      </div>
    </PageWrapper>
  );
};

export default GradingSheet;
