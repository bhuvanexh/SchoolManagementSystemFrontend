import { Bell, CheckSquare, ClipboardList, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

import Badge from '../../../components/data-display/Badge';
import StatCard from '../../../components/data-display/StatCard';
import { formatDate, formatPercentage } from '../../../utils/formatters';

const StudentDashboard = ({ data = {} }) => {
  const upcomingTests = data?.upcomingTests || [];
  const recentResults = data?.recentResults || [];
  const activeNotices = data?.activeNotices || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} value={formatPercentage(data?.attendancePercentage ?? 0)} label="Attendance" color="primary" />
        <StatCard icon={PenTool} value={upcomingTests.length} label="Upcoming Tests" color="secondary" />
        <StatCard icon={CheckSquare} value={recentResults.length} label="Recent Results" color="tertiary" />
        <StatCard icon={Bell} value={activeNotices.length} label="Active Notices" color="primary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Upcoming Tests</h2>
            <Link to="/tests" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          {upcomingTests.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No upcoming tests.</p>
          ) : (
            <div className="space-y-3">
              {upcomingTests.map((item) => {
                const subjectName = item.subjectId?.name || item.subjectName || 'Subject';
                const testDate = item.testDate || item.date;
                return (
                  <Link
                    key={item._id}
                    to={`/tests/${item._id}/view`}
                    className="block rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-on-surface">{item.name || 'Test'}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">{subjectName}</p>
                      </div>
                      {testDate ? <p className="shrink-0 text-sm text-on-surface-variant">{formatDate(testDate)}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Recent Results</h2>
            <Link to="/tests" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          {recentResults.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No results yet.</p>
          ) : (
            <div className="space-y-3">
              {recentResults.map((item) => {
                const testName = item.testId?.name || item.testName || 'Test';
                const subjectName = item.testId?.subjectId?.name || item.subjectName || '';
                const maxScore = item.testId?.maxScore ?? item.maxScore;
                const testDate = item.testId?.testDate || item.testDate;
                const pct = item.percentage != null ? Number(item.percentage).toFixed(1) : null;
                const testId = item.testId?._id || item.testId;
                return (
                  <Link
                    key={item._id}
                    to={testId ? `/tests/${testId}/view` : '#'}
                    className="block rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-on-surface">{testName}</p>
                        {subjectName ? <p className="mt-0.5 text-sm text-on-surface-variant">{subjectName}</p> : null}
                      </div>
                      {testDate ? <p className="shrink-0 text-sm text-on-surface-variant">{formatDate(testDate)}</p> : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-on-surface">
                      {item.isAbsent
                        ? 'Absent'
                        : `${item.marksObtained ?? '—'} / ${maxScore ?? '?'}${pct ? ` · ${pct}%` : ''}`}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="glass-panel p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Active Notices</h2>
            <Link to="/notices" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          {activeNotices.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No active notices.</p>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {activeNotices.map((notice) => (
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

export default StudentDashboard;
