import { Bell, CheckSquare, ClipboardList, PenTool } from 'lucide-react';

import StatCard from '../../../components/data-display/StatCard';
import { formatDate, formatPercentage } from '../../../utils/formatters';

const StudentDashboard = ({ data = {} }) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={ClipboardList} value={formatPercentage(data?.attendancePercentage ?? 0)} label="Attendance" color="primary" />
      <StatCard icon={PenTool} value={data?.upcomingTests?.length ?? 0} label="Upcoming Tests" color="secondary" />
      <StatCard icon={CheckSquare} value={data?.recentResults?.length ?? 0} label="Recent Results" color="tertiary" />
      <StatCard icon={Bell} value={data?.activeNotices?.length ?? 0} label="Active Notices" color="primary" />
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Upcoming Tests</h2>
        <div className="mt-4 space-y-3">
          {(data?.upcomingTests || []).map((item) => (
            <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
              <p className="font-semibold text-on-surface">{item.name}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{formatDate(item.date)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Recent Results</h2>
        <div className="mt-4 space-y-3">
          {(data?.recentResults || []).map((item) => (
            <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
              <p className="font-semibold text-on-surface">{item.subjectName}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{item.marksObtained} / {item.maxScore}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default StudentDashboard;
