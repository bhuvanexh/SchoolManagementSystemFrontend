import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/feedback/Loader';
import ErrorState from '../../components/feedback/ErrorState';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchDashboard } from '../../redux/actions/dashboardActions';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  let content = <AdminDashboard data={data} />;

  if (user?.role === 'teacher') {
    content = <TeacherDashboard data={data} />;
  } else if (user?.role === 'student') {
    content = <StudentDashboard data={data} />;
  }

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" description="Your school operations snapshot, tailored to your role." />
      {loading ? <Loader label="Loading dashboard..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? content : null}
    </PageWrapper>
  );
};

export default Dashboard;
