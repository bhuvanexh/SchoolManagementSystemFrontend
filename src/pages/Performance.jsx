import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Performance() {
  const { students, classes, marks, tests, attendance, getStudentAvgMarks, getStudentAttendanceRate } = useAppStore()
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '')
  const [selectedStudentId, setSelectedStudentId] = useState(null)

  const RADIUS = 58
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const classStudents = students.filter(s => s.classId === selectedClassId)
  const selected = students.find(s => s.id === selectedStudentId) || classStudents[0]

  const avg = selected ? getStudentAvgMarks(selected.id) : 0
  const attRate = selected ? getStudentAttendanceRate(selected.id) : 0
  const offset = CIRCUMFERENCE * (1 - attRate / 100)

  const marksLabel = (a) => {
    if (a >= 90) return 'Top Tier'
    if (a >= 75) return 'Excellent'
    if (a >= 60) return 'Steady'
    return 'At Risk'
  }
  const marksBar = (a) => {
    if (a >= 90) return 'bg-primary-container'
    if (a >= 75) return 'bg-indigo-900'
    if (a >= 60) return 'bg-indigo-400'
    return 'bg-error'
  }
  const attBadge = (r) => r >= 90 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : r >= 75 ? 'bg-slate-200 text-slate-600' : 'bg-error-container text-on-error-container'

  // Marks history for selected student (last 6)
  const studentTests = tests.filter(t => t.classId === selectedClassId)
  const studentMarksHistory = studentTests.slice(-6).map(t => {
    const m = marks.find(m => m.testId === t.id && m.studentId === selected?.id)
    return m?.absent ? 0 : (m?.marks || 0)
  })
  const maxMark = studentTests.slice(-6).map((t, i) => t.maxMarks || 100)

  // Homework/tasks hardcoded shape (depends on the homework module)
  const { homework } = useAppStore()
  const studentHomework = homework.filter(h => {
    const cls = classes.find(c => c.id === h.classId)
    return cls?.id === selectedClassId
  }).slice(0, 3)

  return (
    <div className="flex gap-8" style={{ height: 'calc(100vh - 11rem)' }}>
      {/* ── Left: Roster ── */}
      <section className="flex-[1.8] bg-white/60 backdrop-blur-3xl rounded-3xl shadow-[0_24px_80px_rgba(25,28,30,0.04)] border border-white/40 flex flex-col overflow-hidden">
        <div className="p-8 pb-4 flex flex-wrap justify-between items-end gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Student Roster</h3>
            <p className="text-sm text-on-surface-variant">Performance Analytics</p>
          </div>
          <div className="flex gap-3">
            <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(null) }}
              className="appearance-none bg-white/40 backdrop-blur-xl border-none ring-1 ring-outline-variant/20 rounded-full py-2.5 px-6 pr-10 text-sm font-semibold text-indigo-900 focus:ring-primary-container transition-all cursor-pointer outline-none">
              {classes.map(c => <option key={c.id} value={c.id}>{c.grade} - {c.section}</option>)}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-full text-xs font-bold shadow-lg shadow-indigo-900/20">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-indigo-900/5">
                <th className="pb-4">Student Name</th>
                <th className="pb-4">Marks Summary</th>
                <th className="pb-4">Attendance</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/5">
              {classStudents.map(s => {
                const a = getStudentAvgMarks(s.id)
                const r = getStudentAttendanceRate(s.id)
                const isSelected = (selected?.id === s.id)
                return (
                  <tr key={s.id} onClick={() => setSelectedStudentId(s.id)}
                    className={`group cursor-pointer transition-colors ${isSelected ? 'bg-indigo-900/5 ring-1 ring-inset ring-indigo-900/5' : 'hover:bg-white/40'}`}>
                    <td className={`py-6 ${isSelected ? 'pl-4 rounded-l-2xl' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full border-2 ${isSelected ? 'border-indigo-200' : 'border-white'} shadow-sm flex items-center justify-center ${s.color} text-indigo-900 font-bold text-xs flex-shrink-0`}>
                          {s.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-indigo-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400">Roll: #{s.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="w-40">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-indigo-900">{a}%</span>
                          <span className={`text-[10px] ${a < 60 ? 'text-error' : 'text-slate-400'}`}>{marksLabel(a)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-indigo-900/10 rounded-full overflow-hidden">
                          <div className={`h-full ${marksBar(a)} rounded-full`} style={{ width: `${a}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${attBadge(r)}`}>{r}%</span>
                    </td>
                    <td className={`py-6 text-right ${isSelected ? 'pr-4 rounded-r-2xl' : ''}`}>
                      {isSelected
                        ? <button className="p-2 bg-indigo-900 text-white rounded-xl shadow-sm material-symbols-outlined text-sm">chevron_right</button>
                        : <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-all duration-300 material-symbols-outlined text-sm">visibility</button>
                      }
                    </td>
                  </tr>
                )
              })}
              {classStudents.length === 0 && (
                <tr><td colSpan="4" className="text-center py-12 text-slate-400">No students in this class.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Right: Detail Panel ── */}
      {selected && (
        <aside className="flex-1 bg-indigo-900/5 backdrop-blur-3xl rounded-3xl border border-white/20 flex flex-col p-8 overflow-y-auto no-scrollbar">
          {/* Profile */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className={`w-24 h-24 rounded-3xl ring-4 ring-white shadow-xl mx-auto flex items-center justify-center ${selected.color} text-indigo-900 font-black text-3xl`}>
                {selected.initials}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">
                {avg >= 90 ? 'RANK #1' : avg >= 75 ? 'TOP 5' : 'ACTIVE'}
              </div>
            </div>
            <h4 className="text-2xl font-extrabold tracking-tighter text-indigo-900">{selected.name}</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{classes.find(c => c.id === selected.classId)?.subject || 'Student'}</p>
          </div>

          <div className="space-y-5">
            {/* Attendance Gauge */}
            <div className="bg-white/70 rounded-3xl p-6 shadow-sm border border-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance</span>
                <span className="material-symbols-outlined text-indigo-900/40">radar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-3">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-indigo-900/5" cx="64" cy="64" r={RADIUS} fill="transparent" stroke="currentColor" strokeWidth="8" />
                    <circle cx="64" cy="64" r={RADIUS} fill="transparent" stroke="#00714d" strokeWidth="10"
                      strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-indigo-900">{attRate}%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{attRate >= 90 ? 'On Track' : 'Needs Attention'}</span>
                  </div>
                </div>
                <p className="text-[10px] text-center text-slate-500">
                  {attendance.filter(a => a.studentId === selected.id && a.status === 'present').length} days present out of {attendance.filter(a => a.studentId === selected.id).length} recorded.
                </p>
              </div>
            </div>

            {/* Marks History */}
            <div className="bg-white/70 rounded-3xl p-6 shadow-sm border border-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Marks History</span>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-indigo-900/20 rounded-full" />
                  <div className="w-1 h-3 bg-indigo-900 rounded-full" />
                </div>
              </div>
              {studentMarksHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No test marks yet.</p>
              ) : (
                <>
                  <div className="h-24 w-full flex items-end justify-between gap-1 px-2 pt-4">
                    {studentMarksHistory.map((val, i) => {
                      const pct = maxMark[i] ? Math.round((val / maxMark[i]) * 100) : 0
                      return (
                        <div key={i} className={`flex-1 rounded-t-lg transition-all hover:bg-indigo-900 ${i === studentMarksHistory.length - 1 ? 'bg-indigo-900' : 'bg-indigo-900/10'}`}
                          style={{ height: `${Math.max(pct, 4)}%` }} title={`${val}/${maxMark[i]}`} />
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase px-1">
                    {studentTests.slice(-6).map(t => <span key={t.id}>{t.name.slice(0, 3)}</span>)}
                  </div>
                </>
              )}
            </div>

            {/* Assigned Tasks from Homework */}
            <div className="bg-white/70 rounded-3xl p-6 shadow-sm border border-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Assigned Tasks</span>
              {studentHomework.length === 0 && <p className="text-xs text-slate-400">No homework assigned.</p>}
              <div className="space-y-4">
                {studentHomework.map(hw => (
                  <div key={hw.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${hw.status === 'archived' ? 'bg-secondary-container' : 'bg-primary-fixed'}`}>
                      {hw.status === 'archived'
                        ? <span className="material-symbols-outlined text-[12px] text-on-secondary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                        : <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-indigo-900">{hw.title}</p>
                      <p className="text-[9px] text-slate-400">Due: {hw.dueDate}</p>
                    </div>
                    {hw.status === 'active' && <span className="text-[10px] font-black text-indigo-900">Pending</span>}
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-900/20 hover:scale-[1.02] transition-transform">
              Schedule Parent-Teacher Meeting
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
