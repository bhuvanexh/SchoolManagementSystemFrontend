import { ATTENDANCE_STATUSES } from '../../../utils/constants';

const AttendanceSheet = ({ students = [], values = {}, onChange }) => (
  <div className="glass-panel overflow-hidden">
    <div className="custom-scrollbar overflow-x-auto">
      <table className="min-w-full divide-y divide-white/40">
        <thead className="bg-white/40">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roll No</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/30 bg-white/20">
          {students.map((student) => (
            <tr key={student._id}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AttendanceSheet;
