const statusStyle = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-error',
  halfDay: 'bg-yellow-100 text-yellow-700',
};

const statusLabel = { present: 'Present', absent: 'Absent', halfDay: 'Half Day' };

const AttendanceReport = ({ records = [] }) => (
  <section className="glass-panel p-6">
    <h2 className="mb-4 text-xl font-bold text-on-surface">Attendance Report</h2>
    {!records.length ? (
      <p className="text-sm text-on-surface-variant">No records found for the selected period.</p>
    ) : (
      <div className="space-y-3">
        {records.map((record) => {
          const studentName = record.studentId?.name || record.studentName || record.name || 'Student';
          const rollNumber = record.studentId?.rollNumber;
          const dateStr = typeof record.date === 'string'
            ? record.date.slice(0, 10)
            : new Date(record.date).toISOString().slice(0, 10);
          return (
            <div key={record._id} className="flex items-center justify-between rounded-glass-sm bg-white/50 p-4">
              <div>
                <p className="font-semibold text-on-surface">
                  {studentName}
                  {rollNumber ? <span className="ml-2 text-xs font-normal text-on-surface-variant">#{rollNumber}</span> : null}
                </p>
                <p className="mt-0.5 text-sm text-on-surface-variant">{dateStr}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[record.status] || 'bg-white/40 text-on-surface-variant'}`}>
                {statusLabel[record.status] || record.status}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default AttendanceReport;
