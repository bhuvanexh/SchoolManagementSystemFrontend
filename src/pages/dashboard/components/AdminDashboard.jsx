import { Calendar, GraduationCap, School, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import Badge from '../../../components/data-display/Badge';
import StatCard from '../../../components/data-display/StatCard';
import { formatDate } from '../../../utils/formatters';

const AdminDashboard = ({ data = {} }) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Users} value={data?.totals?.teachers ?? 0} label="Teachers" color="primary" />
      <StatCard icon={GraduationCap} value={data?.totals?.students ?? 0} label="Students" color="secondary" />
      <StatCard icon={School} value={data?.totals?.classes ?? 0} label="Classes" color="tertiary" />
      <StatCard icon={Calendar} value={data?.upcomingEvents?.length ?? 0} label="Upcoming Events" color="primary" />
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <section className="glass-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Recent Notices</h2>
          <Link to="/notices" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="space-y-4">
          {(data?.recentNotices || []).slice(0, 5).map((notice) => (
            <article key={notice._id} className="rounded-glass-sm bg-white/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-on-surface">{notice.title}</h3>
                <Badge tone={notice.isPriority ? 'error' : 'neutral'}>
                  {notice.isPriority ? 'Priority' : notice.visibility || 'Notice'}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{notice.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Upcoming Events</h2>
          <Link to="/events" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="space-y-4">
          {(data?.upcomingEvents || []).slice(0, 5).map((event) => (
            <article key={event._id} className="rounded-glass-sm bg-white/50 p-4">
              <h3 className="font-semibold text-on-surface">{event.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{formatDate(event.dateTime)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default AdminDashboard;
