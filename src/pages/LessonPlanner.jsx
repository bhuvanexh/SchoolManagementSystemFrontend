import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function LessonPlanner() {
  const { lessons, classes, subjects, addLesson, deleteLesson } = useAppStore()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    date: today, classId: classes[0]?.id || '', subject: '',
    title: '', description: '', period: 'Period 1',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    addLesson(form)
    setForm(f => ({ ...f, title: '', description: '' }))
  }

  const classSubjects = subjects.filter(s => s.classId === form.classId).map(s => s.name)
  const upcoming = lessons.filter(l => l.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const formatDate = (dateStr) => {
    const dt = new Date(dateStr + 'T12:00:00')
    return dt.toLocaleString('en', { day: '2-digit', month: 'short' }).toUpperCase()
  }

  const getBadgeBg = (i) => {
    const colors = ['bg-tertiary-fixed text-on-tertiary-fixed', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-primary-fixed text-on-primary-fixed', 'bg-surface-container-high text-on-surface']
    return colors[i % colors.length]
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* ── Left: Planner Form ── */}
      <section className="col-span-12 lg:col-span-5 xl:col-span-4">
        <div className="glass-panel rounded-3xl p-8 shadow-2xl sticky top-32">
          <div className="mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase mb-4">New Entry</span>
            <h3 className="text-3xl font-extrabold tracking-tighter text-on-surface leading-tight">Draft Your Next Lesson</h3>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Schedule Date</label>
              <input type="date" value={form.date} min={today} onChange={e => set('date', e.target.value)}
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Class</label>
                <select value={form.classId} onChange={e => set('classId', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none outline-none">
                  {classes.map(c => <option key={c.id} value={c.id}>{c.grade} {c.section}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                <select value={form.subject} onChange={e => set('subject', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none outline-none">
                  <option value="">Select…</option>
                  {classSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Period</label>
              <select value={form.period} onChange={e => set('period', e.target.value)}
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none outline-none">
                {['Period 1','Period 2','Period 3','Period 4','Period 5','Period 6'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Topic Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required
                placeholder="e.g., Quantum Mechanics"
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Description &amp; Objectives</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Outline the learning goals and required materials..."
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none outline-none" />
            </div>

            <button type="submit"
              className="w-full bg-primary-gradient text-white py-4 rounded-3xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group border-t border-white/20">
              <span>Schedule Lesson</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>
        </div>
      </section>

      {/* ── Right: Upcoming Agenda ── */}
      <section className="col-span-12 lg:col-span-7 xl:col-span-8">
        <div className="flex justify-between items-end mb-8 px-4">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tighter text-indigo-950">Upcoming Agenda</h3>
            <p className="text-on-surface-variant font-medium">
              {upcoming.length} lesson{upcoming.length !== 1 ? 's' : ''} scheduled.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/40 hover:bg-white/70 p-3 rounded-2xl transition-all">
              <span className="material-symbols-outlined text-indigo-900">filter_list</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.slice(0, 5).map((l, i) => {
            const cls = classes.find(c => c.id === l.classId)
            return (
              <div key={l.id} className="glass-panel rounded-3xl p-8 hover:scale-[1.02] transition-all group flex flex-col justify-between min-h-[280px] relative">
                <button onClick={() => deleteLesson(l.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error-container p-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest ${getBadgeBg(i)}`}>
                      {l.subject || 'General'}
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant">{formatDate(l.date)}</span>
                  </div>
                  <h4 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2 group-hover:text-primary transition-colors">{l.title}</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{l.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-indigo-100/30 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-indigo-900 font-bold text-sm">
                      {cls ? `${cls.grade.replace('Grade ', '')}${cls.section}` : '?'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{l.period}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty slot if fewer than even count */}
          {upcoming.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-indigo-200/40 p-8 flex flex-col items-center justify-center text-center opacity-60 min-h-[280px]">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400">add</span>
              </div>
              <p className="text-sm font-bold text-slate-400 tracking-tight">No Lessons Scheduled<br />Use the form to add one.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
