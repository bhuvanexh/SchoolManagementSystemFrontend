import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

const STATUS = {
  present:  { label: 'Present',  active: 'bg-tertiary-fixed text-on-tertiary-fixed border-transparent shadow-sm',  hover: 'hover:bg-tertiary-fixed hover:text-on-tertiary-fixed hover:border-transparent' },
  absent:   { label: 'Absent',   active: 'bg-error-container text-on-error-container border-transparent shadow-sm', hover: 'hover:border-error-container hover:text-on-error-container' },
  half_day: { label: 'Half Day', active: 'bg-primary-fixed text-primary-container border-transparent shadow-sm',    hover: 'hover:border-primary-fixed hover:text-primary-container' },
}

export default function Attendance() {
  const { classes, students, attendance, markAttendance } = useAppStore()
  const today = new Date().toISOString().split('T')[0]

  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '')
  const [selectedDate,  setSelectedDate]  = useState(today)

  const classStudents = students.filter(s => s.classId === selectedClass)

  const getStatus = (studentId) =>
    attendance.find(a => a.studentId === studentId && a.classId === selectedClass && a.date === selectedDate)?.status || null

  const setStatus = (studentId, status) =>
    markAttendance({ studentId, classId: selectedClass, date: selectedDate, status })

  const markedCount  = classStudents.filter(s => getStatus(s.id) !== null).length
  const presentCount = classStudents.filter(s => getStatus(s.id) === 'present').length
  const pct          = classStudents.length ? Math.round((presentCount / classStudents.length) * 100) : 0

  const handleMarkAllPresent = () =>
    classStudents.forEach(s => setStatus(s.id, 'present'))

  const handleReset = () => {
    setSelectedClass(classes[0]?.id || '')
    setSelectedDate(today)
  }

  // Split class into grade and section for the dropdowns
  const uniqueGrades   = [...new Set(classes.map(c => c.grade))]
  const [selGrade, setSelGrade] = useState(classes[0]?.grade || '')
  const [selSection, setSelSection] = useState(classes[0]?.section || '')

  // Sync combined selector → selectedClass
  const syncClass = (grade, section) => {
    const found = classes.find(c => c.grade === grade && c.section === section)
    if (found) setSelectedClass(found.id)
    else {
      const fallback = classes.find(c => c.grade === grade)
      if (fallback) { setSelectedClass(fallback.id); setSelSection(fallback.section) }
    }
  }
  const sectionsForGrade = [...new Set(classes.filter(c => c.grade === selGrade).map(c => c.section))]

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">

      {/* ── Filter Section ── */}
      <section className="glass-panel p-8 rounded-3xl shadow-[0_24px_80px_rgba(25,28,30,0.04)] flex flex-wrap items-end gap-6">
        {/* Grade */}
        <div className="flex-1 min-w-[180px] space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container ml-1">Grade / Class</label>
          <div className="relative">
            <select
              value={selGrade}
              onChange={e => {
                setSelGrade(e.target.value)
                const firstSection = classes.find(c => c.grade === e.target.value)?.section || ''
                setSelSection(firstSection)
                syncClass(e.target.value, firstSection)
              }}
              className="w-full bg-white/50 border-none rounded-xl py-3 pl-4 pr-10 text-on-surface font-semibold appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
            >
              {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>

        {/* Section */}
        <div className="flex-1 min-w-[180px] space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container ml-1">Section</label>
          <div className="relative">
            <select
              value={selSection}
              onChange={e => {
                setSelSection(e.target.value)
                syncClass(selGrade, e.target.value)
              }}
              className="w-full bg-white/50 border-none rounded-xl py-3 pl-4 pr-10 text-on-surface font-semibold appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
            >
              {sectionsForGrade.map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex-1 min-w-[180px] space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container ml-1">Date Selector</label>
          <input
            type="date" value={selectedDate} max={today}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full bg-white/50 border-none rounded-xl py-3 px-4 text-on-surface font-semibold focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
          />
        </div>

        {/* Reset */}
        <div>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-white/40 text-primary-container rounded-xl font-bold text-sm border border-white/60 hover:bg-white/60 transition-all"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {/* ── Student Roster Table ── */}
      <section className="glass-panel p-10 rounded-3xl shadow-[0_24px_80px_rgba(25,28,30,0.04)] overflow-hidden">
        {/* Table header */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Student Roster</h2>
            <p className="text-on-surface-variant font-medium mt-1">
              Total Students: {classStudents.length} &bull; Marked: {markedCount}/{classStudents.length}
            </p>
          </div>
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-2 px-6 py-3 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl font-bold text-sm hover:brightness-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Mark All Present
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-on-secondary-container/60 border-b border-indigo-100/30">
                <th className="pb-6 px-4">Roll No.</th>
                <th className="pb-6 px-4">Student Name</th>
                <th className="pb-6 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/50">
              {classStudents.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-5xl block mb-2">group_off</span>
                    No students in this class.
                  </td>
                </tr>
              )}

              {classStudents.map((s) => {
                const current = getStatus(s.id)
                return (
                  <tr key={s.id} className="hover:bg-white/40 hover:scale-[1.01] transition-all duration-300 group">
                    {/* Roll No */}
                    <td className="py-6 px-4 font-bold text-indigo-900">#{s.rollNo}</td>

                    {/* Name */}
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center ${s.color} text-indigo-900 font-bold text-xs flex-shrink-0`}>
                          {s.initials}
                        </div>
                        <span className="font-bold text-on-surface">{s.name}</span>
                      </div>
                    </td>

                    {/* Status buttons */}
                    <td className="py-6 px-4">
                      <div className="flex justify-center items-center gap-3">
                        {Object.entries(STATUS).map(([key, cfg]) => {
                          const isActive = current === key
                          return (
                            <button
                              key={key}
                              onClick={() => setStatus(s.id, key)}
                              className={`px-5 py-2 rounded-full text-xs font-bold border-2 transition-all
                                ${isActive
                                  ? cfg.active
                                  : `border-slate-200 text-slate-400 ${cfg.hover}`
                                }`}
                            >
                              {cfg.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-wrap justify-between items-center gap-4">
          <button className="flex items-center gap-2 text-primary-container font-bold text-sm hover:underline">
            <span className="material-symbols-outlined">history</span>
            View Last 7 Days History
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-10 py-4 bg-white/20 border-2 border-indigo-100/50 text-indigo-900 rounded-[3rem] font-bold text-sm hover:bg-white/50 transition-all"
            >
              Edit History
            </button>
            <button
              onClick={handleMarkAllPresent}
              className="px-12 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-[3rem] font-bold text-sm shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </section>

      {/* ── Floating Stats Chip ── */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-4">
        <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-secondary-container/60">Live Progress</span>
            <span className="text-xl font-extrabold text-indigo-900">{pct}%</span>
          </div>
          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400">{presentCount}/{classStudents.length}</span>
            <span className="text-[9px] text-slate-300 uppercase">Present</span>
          </div>
        </div>
      </div>

    </div>
  )
}
