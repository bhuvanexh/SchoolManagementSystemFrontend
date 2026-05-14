import { useState } from 'react'

const upcomingLessons = [
  {
    id: 1,
    subject: 'Physics',
    subjectBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    date: '26 OCT',
    title: 'Quantum Mechanics Introduction',
    description:
      'Exploring the dual nature of light and the fundamentals of Schrödinger\'s equation for Grade 10-A.',
    classLabel: '10A',
    period: 'Period 3',
  },
  {
    id: 2,
    subject: 'Mathematics',
    subjectBg: 'bg-secondary-fixed text-on-secondary-fixed',
    date: '27 OCT',
    title: 'Complex Derivatives',
    description:
      'Advanced application of the chain rule in logarithmic and exponential functions.',
    classLabel: '11C',
    period: 'Period 1',
  },
  {
    id: 4,
    subject: 'History',
    subjectBg: 'bg-primary-fixed text-on-primary-fixed',
    date: '01 NOV',
    title: 'The Renaissance Shift',
    description:
      'Analyzing the cultural and scientific paradigm shift in 14th century Europe.',
    classLabel: '10B',
    period: 'Period 4',
  },
]

const today = new Date().toISOString().split('T')[0]

export default function Planner() {
  const [date, setDate] = useState(today)
  const [classVal, setClassVal] = useState('Grade 10-A')
  const [subject, setSubject] = useState('Adv. Physics')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // No-op for now; just prevent page reload
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-indigo-950 font-manrope">
            Lesson Planner
          </h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">
            Wednesday, October 25, 2023
          </p>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* ── Left: Planner Form ── */}
        <section className="col-span-12 lg:col-span-5 xl:col-span-4">
          <div
            className="rounded-[3rem] p-8 shadow-2xl shadow-indigo-900/5 sticky top-32"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {/* Form heading */}
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase mb-4">
                New Entry
              </span>
              <h3 className="text-3xl font-extrabold tracking-tighter text-on-surface leading-tight">
                Draft Your Next Lesson
              </h3>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Schedule Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-[1.5rem] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Class + Subject */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Class
                  </label>
                  <select
                    value={classVal}
                    onChange={(e) => setClassVal(e.target.value)}
                    className="w-full bg-surface-container-low/40 border-none rounded-[1.5rem] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none outline-none"
                  >
                    <option>Grade 10-A</option>
                    <option>Grade 10-B</option>
                    <option>Grade 11-C</option>
                    <option>Grade 12-A</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface-container-low/40 border-none rounded-[1.5rem] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none outline-none"
                  >
                    <option>Adv. Physics</option>
                    <option>Mathematics</option>
                    <option>Chemistry</option>
                    <option>Literature</option>
                  </select>
                </div>
              </div>

              {/* Topic Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Mechanics"
                  className="w-full bg-surface-container-low/40 border-none rounded-[1.5rem] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Description & Objectives */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Description &amp; Objectives
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the learning goals and required materials..."
                  className="w-full bg-surface-container-low/40 border-none rounded-[1.5rem] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-[3rem] font-bold text-lg shadow-xl text-white flex items-center justify-center gap-2 group border-t border-white/20 hover:scale-[1.02] transition-all"
                style={{
                  background: 'linear-gradient(to bottom right, #231f74, #3a388b)',
                  boxShadow: '0 20px 60px rgba(35,31,116,0.25)',
                }}
              >
                <span>Schedule Lesson</span>
                <span
                  className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                  style={{ fontSize: '20px' }}
                >
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
        </section>

        {/* ── Right: Upcoming Agenda ── */}
        <section className="col-span-12 lg:col-span-7 xl:col-span-8">
          {/* Section heading */}
          <div className="flex justify-between items-end mb-8 px-4">
            <div>
              <h3 className="text-3xl font-extrabold tracking-tighter text-indigo-950">
                Upcoming Agenda
              </h3>
              <p className="text-on-surface-variant font-medium">
                You have 6 lessons scheduled for the next 7 days.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="p-3 rounded-2xl transition-all hover:bg-white/70"
                style={{ background: 'rgba(255,255,255,0.4)' }}
              >
                <span className="material-symbols-outlined text-indigo-900">filter_list</span>
              </button>
              <button
                className="p-3 rounded-2xl transition-all hover:bg-white/70"
                style={{ background: 'rgba(255,255,255,0.4)' }}
              >
                <span className="material-symbols-outlined text-indigo-900">sort</span>
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard lesson cards */}
            {upcomingLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-[3rem] p-8 hover:scale-[1.02] transition-all group flex flex-col justify-between min-h-[280px]"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest ${lesson.subjectBg}`}
                    >
                      {lesson.subject}
                    </span>
                    <span className="text-sm font-bold text-on-surface-variant">{lesson.date}</span>
                  </div>
                  <h4 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{lesson.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-indigo-100/30 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-indigo-900 font-bold text-sm">
                      {lesson.classLabel}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {lesson.period}
                    </span>
                  </div>
                  <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                    Details{' '}
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* ── Large Featured Card (full-width) ── */}
            <div
              className="rounded-[3rem] p-8 md:col-span-2 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.5)',
              }}
            >
              {/* Image panel */}
              <div className="w-full md:w-1/3 h-48 rounded-[2rem] overflow-hidden relative flex-shrink-0">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0d2137 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* SVG atom illustration */}
                  <svg viewBox="0 0 200 200" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" transform="rotate(60 100 100)" />
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" transform="rotate(120 100 100)" />
                    <circle cx="100" cy="100" r="12" fill="url(#glow1)" />
                    <circle cx="100" cy="100" r="7" fill="#93c5fd" />
                    <circle cx="180" cy="100" r="5" fill="#6366f1" />
                    <circle cx="55" cy="36" r="5" fill="#22d3ee" />
                    <circle cx="55" cy="164" r="5" fill="#3b82f6" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay rounded-[2rem]" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>
                    priority_high
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-error">
                    Lab Session Priority
                  </span>
                </div>
                <h4 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
                  Molecular Dynamics Lab
                </h4>
                <p className="text-on-surface-variant mb-6">
                  Practical examination of thermal conductivity. Ensure all safety equipment is
                  calibrated and Grade 12-A is briefed on protocols.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Date
                    </span>
                    <span className="text-sm font-bold text-indigo-950">30 October</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Class
                    </span>
                    <span className="text-sm font-bold text-indigo-950">Grade 12-A</span>
                  </div>
                  <button
                    className="ml-auto p-3 rounded-full border border-indigo-100/50 transition-all hover:bg-white"
                    style={{ background: 'rgba(255,255,255,0.6)' }}
                  >
                    <span className="material-symbols-outlined text-indigo-900">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Empty Slot Placeholder ── */}
            <div className="rounded-[3rem] border-2 border-dashed border-indigo-200/40 p-8 flex flex-col items-center justify-center text-center opacity-60">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <span className="material-symbols-outlined text-slate-400">add</span>
              </div>
              <p className="text-sm font-bold text-slate-400 tracking-tight">
                Empty Slot
                <br />
                No Lesson Scheduled
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
