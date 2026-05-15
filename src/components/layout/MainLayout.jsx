import { useEffect } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchNotifications, fetchUnreadCount } from '../../redux/actions/notificationActions';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role || 'admin');
  const matches = useMatches();
  const currentMatch = [...matches].reverse().find((match) => match.handle?.title);
  const title = currentMatch?.handle?.title || 'Dashboard';

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="mesh-bg min-h-screen lg:flex">
      <Sidebar role={role} />
      <div className="min-h-screen flex-1">
        <TopBar title={title} />
        <main className="px-4 pb-10 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
