const AttendanceReport = ({ records = [] }) => (
  <section className="glass-panel p-6">
    <h2 className="text-xl font-bold text-on-surface">Attendance Report</h2>
    <div className="mt-4 space-y-3">
      {records.map((record) => (
        <div key={record._id || `${record.studentId}-${record.date}`} className="rounded-glass-sm bg-white/50 p-4">
          <p className="font-semibold text-on-surface">{record.studentName || record.name || 'Student'}</p>
          <p className="mt-1 text-sm capitalize text-on-surface-variant">{record.date} · {record.status}</p>
        </div>
      ))}
    </div>
  </section>
);

export default AttendanceReport;
