import { CalendarCheck2, ClipboardList, PenTool, School } from 'lucide-react';
import { Link } from 'react-router-dom';

import Badge from '../../../components/data-display/Badge';
import StatCard from '../../../components/data-display/StatCard';
import { formatDate } from '../../../utils/formatters';

const TeacherDashboard = ({ data = {} }) => {
  const attendancePending = Object.values(data?.todayAttendanceStatus || {}).filter(
    (s) => s === 'not_marked'
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={School} value={data?.assignedSections?.length ?? 0} label="Assigned Sections" color="primary" />
        <StatCard icon={ClipboardList} value={attendancePending} label="Attendance Pending" color="secondary" />
        <StatCard icon={PenTool} value={data?.upcomingTests?.length ?? 0} label="Upcoming Tests" color="tertiary" />
        <StatCard icon={CalendarCheck2} value={data?.recentNotices?.length ?? 0} label="Recent Notices" color="primary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">My Sections</h2>
          <div className="mt-4 grid gap-3">
            {(data?.assignedSections || []).map((section) => {
              const status = data?.todayAttendanceStatus?.[section._id];
              return (
                <div key={section._id} className="flex items-center justify-between gap-3 rounded-glass-sm bg-white/50 p-4">
                  <div>
                    <p className="font-semibold text-on-surface">
                      Class {section.classId?.name} — Section {section.name}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">Room {section.roomNumber || '—'}</p>
                  </div>
                  <Badge tone={status === 'marked' ? 'success' : 'neutral'}>
                    {status === 'marked' ? 'Marked' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
            {!(data?.assignedSections?.length) && (
              <p className="text-sm text-on-surface-variant">No sections assigned yet.</p>
            )}
          </div>
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Upcoming Tests</h2>
            <Link to="/tests" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          <div className="grid gap-3">
            {(data?.upcomingTests || []).map((item) => (
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
            ))}
            {!(data?.upcomingTests?.length) && (
              <p className="text-sm text-on-surface-variant">No upcoming tests.</p>
            )}
          </div>
        </section>

        <section className="glass-panel p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Recent Notices</h2>
            <Link to="/notices" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          <div className="grid gap-3 xl:grid-cols-2">
            {(data?.recentNotices || []).map((notice) => (
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
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
