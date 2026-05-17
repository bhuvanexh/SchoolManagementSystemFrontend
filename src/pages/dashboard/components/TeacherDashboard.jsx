import { CalendarCheck2, ClipboardList, PenTool, School } from 'lucide-react';
import { Link } from 'react-router-dom';

import Badge from '../../../components/data-display/Badge';
import StatCard from '../../../components/data-display/StatCard';
import { formatDate } from '../../../utils/formatters';

const TeacherDashboard = ({ data = {} }) => {
  const attendancePending = Object.values(data?.todayAttendanceStatus || {}).filter(
    (s) => s === 'not_marked'
  ).length;

  const sections = data?.assignedSections || [];
  const upcomingTests = data?.upcomingTests || [];
  const recentNotices = data?.recentNotices || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={School} value={sections.length} label="My Classes" color="primary" />
        <StatCard icon={ClipboardList} value={attendancePending} label="Attendance Pending" color="secondary" />
        <StatCard icon={PenTool} value={upcomingTests.length} label="Upcoming Tests" color="tertiary" />
        <StatCard icon={CalendarCheck2} value={recentNotices.length} label="Recent Notices" color="primary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">My Classes</h2>
          <div className="mt-4 grid gap-3">
            {sections.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No classes assigned to you yet.</p>
            ) : (
              sections.map((section) => {
                const status = data?.todayAttendanceStatus?.[section._id];
                const className = section.classId?.name;
                const sectionName = section.name;
                const label = className
                  ? (sectionName && sectionName !== 'Default' ? `Class ${className}-${sectionName}` : `Class ${className}`)
                  : `Section ${sectionName || '—'}`;
                return (
                  <Link
                    key={section._id}
                    to={`/classes/${section.classId?._id || ''}`}
                    className="flex items-center justify-between gap-3 rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70"
                  >
                    <div>
                      <p className="font-semibold text-on-surface">{label}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Room {section.roomNumber || '—'}</p>
                    </div>
                    <Badge tone={status === 'marked' ? 'success' : 'neutral'}>
                      {status === 'marked' ? "Today's attendance marked" : "Today's attendance pending"}
                    </Badge>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Upcoming Tests</h2>
            <Link to="/tests" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          <div className="grid gap-3">
            {upcomingTests.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No upcoming tests.</p>
            ) : (
              upcomingTests.map((item) => (
                <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-on-surface">{item.name}</p>
                    <Badge tone={item.isPublished ? 'success' : 'neutral'}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {item.subjectId?.name ? `${item.subjectId.name} · ` : ''}{formatDate(item.testDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="glass-panel p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Recent Notices</h2>
            <Link to="/notices" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          {recentNotices.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No recent notices.</p>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {recentNotices.map((notice) => (
                <article key={notice._id} className="rounded-glass-sm bg-white/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-on-surface">{notice.title}</p>
                    <Badge tone={notice.isPriority ? 'error' : 'neutral'}>
                      {notice.isPriority ? 'Priority' : notice.visibility || 'Notice'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">{notice.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
