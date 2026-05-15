import { CalendarCheck2, ClipboardList, PenTool, School } from 'lucide-react';

import Badge from '../../../components/data-display/Badge';
import StatCard from '../../../components/data-display/StatCard';
import { formatDate } from '../../../utils/formatters';

const TeacherDashboard = ({ data = {} }) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={School} value={data?.assignedSections?.length ?? 0} label="Assigned Sections" color="primary" />
      <StatCard icon={ClipboardList} value={data?.attendancePending ?? 0} label="Attendance Pending" color="secondary" />
      <StatCard icon={PenTool} value={data?.upcomingTests?.length ?? 0} label="Upcoming Tests" color="tertiary" />
      <StatCard icon={CalendarCheck2} value={data?.recentNotices?.length ?? 0} label="Recent Notices" color="primary" />
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Assigned Sections</h2>
        <div className="mt-4 grid gap-3">
          {(data?.assignedSections || []).map((item) => (
            <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
              <p className="font-semibold text-on-surface">{item.className} - {item.sectionName}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{item.studentCount || 0} students</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Upcoming Tests</h2>
        <div className="mt-4 grid gap-3">
          {(data?.upcomingTests || []).map((item) => (
            <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-on-surface">{item.name}</p>
                <Badge tone={item.isPublished ? 'success' : 'neutral'}>{item.isPublished ? 'Published' : 'Draft'}</Badge>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">{formatDate(item.date)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default TeacherDashboard;
