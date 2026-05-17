import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Badge from '../../components/data-display/Badge';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchResultsByStudent } from '../../redux/actions/resultActions';
import { fetchTestById } from '../../redux/actions/testActions';
import { formatDate } from '../../utils/formatters';

const TestDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);
  const test = useSelector((state) => state.tests.current);
  const testLoading = useSelector((state) => state.tests.loading);
  const studentResults = useSelector((state) => state.results.studentResults);
  const resultsLoading = useSelector((state) => state.results.loading);

  const isStudent = role === 'student';
  const studentId = profile?._id;

  useEffect(() => {
    dispatch(fetchTestById(id));
    if (isStudent && studentId) {
      dispatch(fetchResultsByStudent(studentId));
    }
  }, [dispatch, id, isStudent, studentId]);

  const myResult = useMemo(() => {
    if (!isStudent) return null;
    return studentResults.find((r) => {
      const tid = typeof r.testId === 'object' ? r.testId?._id : r.testId;
      return String(tid) === String(id);
    }) || null;
  }, [isStudent, studentResults, id]);

  if (testLoading && !test) return <Loader label="Loading test details..." />;
  if (!test) return <EmptyState title="Test not found" message="The test you are looking for does not exist or is not visible to you." />;

  const subjectName = test?.subjectId?.name || '—';
  const className = test?.classId?.name;
  const sectionName = test?.sectionId?.name;
  const classSectionLabel = className
    ? (!sectionName || sectionName === 'Default' ? `Class ${className}` : `Class ${className}-${sectionName}`)
    : '—';

  const maxScore = Number(test?.maxScore) || 0;
  const percentage = myResult?.percentage != null ? Number(myResult.percentage).toFixed(1) : null;

  return (
    <PageWrapper>
      <PageHeader
        backTo="/tests"
        backLabel="Back to Tests"
        title={test?.name || 'Test Detail'}
        description="Test information and your result."
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Subject</p>
            <p className="mt-2 font-semibold text-on-surface">{subjectName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class</p>
            <p className="mt-2 font-semibold text-on-surface">{classSectionLabel}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</p>
            <p className="mt-2 font-semibold text-on-surface">{test?.testDate ? formatDate(test.testDate) : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Max Score</p>
            <p className="mt-2 font-semibold text-on-surface">{maxScore}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</p>
            <div className="mt-2"><Badge tone={test?.isPublished ? 'success' : 'neutral'}>{test?.isPublished ? 'Published' : 'Draft'}</Badge></div>
          </div>
        </div>
      </section>

      {isStudent ? (
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">My Result</h2>
          {resultsLoading && !myResult ? (
            <Loader label="Loading result..." />
          ) : !myResult ? (
            <p className="mt-4 text-sm text-on-surface-variant">
              {test?.isPublished
                ? 'Your result for this test has not been recorded yet.'
                : 'This test has not been published. Your result will appear here once it is published.'}
            </p>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Marks Obtained</p>
                <p className="mt-2 font-semibold text-on-surface">
                  {myResult.isAbsent ? 'Absent' : `${myResult.marksObtained ?? '—'} / ${maxScore}`}
                </p>
              </div>
              {!myResult.isAbsent && percentage != null ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Percentage</p>
                  <p className="mt-2 font-semibold text-on-surface">{percentage}%</p>
                </div>
              ) : null}
              {myResult.grade ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Grade</p>
                  <p className="mt-2 font-semibold text-on-surface">{myResult.grade}</p>
                </div>
              ) : null}
            </div>
          )}
        </section>
      ) : null}
    </PageWrapper>
  );
};

export default TestDetail;
