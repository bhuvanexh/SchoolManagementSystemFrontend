import { CheckCircle2 } from 'lucide-react';

import { ATTENDANCE_STATUSES } from '../../../utils/constants';

const AttendanceSheet = ({ students = [], values = {}, savedStudentIds = new Set(), onChange }) => (
  <div className="glass-panel overflow-hidden">
    <div className="custom-scrollbar overflow-x-auto">
      <table className="min-w-full divide-y divide-white/40">
        <thead className="bg-white/40">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roll No</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Saved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/30 bg-white/20">
          {students.map((student) => {
            const isSaved = savedStudentIds.has(student._id?.toString());
            return (
              <tr key={student._id} className={isSaved ? 'bg-white/10' : ''}>
                <td className="px-4 py-3 text-sm text-on-surface">{student.rollNumber}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{student.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {ATTENDANCE_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => onChange(student._id, status.value)}
                        className={values[student._id] === status.value ? 'btn-primary !px-4 !py-2' : 'btn-secondary !px-4 !py-2'}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {isSaved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  ) : (
                    <span className="text-xs text-on-surface-variant">Pending</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default AttendanceSheet;
