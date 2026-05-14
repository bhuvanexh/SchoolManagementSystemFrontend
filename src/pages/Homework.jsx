import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Homework() {
  const { homework, addHomework, deleteHomework, updateHomework, classes, subjects } = useAppStore()
  const today = new Date().toISOString().split('T')[0]
  const [tab, setTab] = useState('active')
  const [form, setForm] = useState({
    title: '', subject: '', classId: classes[0]?.id || '', dueDate: today, description: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    addHomework(form)
    setForm(f => ({ ...f, title: '', description: '' }))
  }

  const filtered = homework.filter(h => tab === 'all' ? true : h.status === tab)
  const classSubjects = subjects.filter(s => s.classId === form.classId).map(s => s.name)

  const dueDateLabel = (dateStr) => {
    const dt = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((dt - new Date().setHours(0,0,0,0)) / 86400000)
    if (diffDays < 0) return { txt: 'Overdue', cls: 'text-error' }
    if (diffDays === 0) return { txt: 'Due Today', cls: 'text-amber-600' }
    if (diffDays === 1) return { txt: 'Due Tomorrow', cls: 'text-amber-500' }
    return { txt: `Due ${dt.toLocaleDateString('en', { day: 'numeric', month: 'short' })}`, cls: 'text-on-surface-variant' }
  }

  const TAB_STYLES = {
    active:   'bg-indigo-900 text-white shadow-lg shadow-indigo-900/20',
    archived: 'bg-surface-container text-on-surface-variant',
    all:      'bg-surface-container text-on-surface-variant',
  }

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* ── Left: Create Form ── */}
      <section className="col-span-12 lg:col-span-4 sticky top-8">
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase mb-4">New Assignment</span>
            <h3 className="text-2xl font-extrabold tracking-tighter text-on-surface">Create Homework</h3>
          </div>

          <form className="space-y-5" onSubmit={handleCreate}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required
                placeholder="e.g., Chapter 5 Exercises"
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Class</label>
                <select value={form.classId} onChange={e => set('classId', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none outline-none">
                  {classes.map(c => <option key={c.id} value={c.id}>{c.grade} {c.section}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                <select value={form.subject} onChange={e => set('subject', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none outline-none">
                  <option value="">Select…</option>
                  {classSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Instructions</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="Describe the assignment tasks..."
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none outline-none" />
            </div>

            <button type="submit"
              className="w-full bg-primary-gradient text-white py-4 rounded-3xl font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_add</span>
              Assign Homework
            </button>
          </form>
        </div>
      </section>

      {/* ── Right: Assignment List ── */}
      <section className="col-span-12 lg:col-span-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {['active', 'archived', 'all'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all ${tab === t ? TAB_STYLES.active : TAB_STYLES.archived}`}>
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="ml-2 text-xs opacity-70">{homework.filter(h => t === 'all' ? true : h.status === t).length}</span>
            </button>
          ))}
        </div>

        {/* Assignment cards */}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl block mb-2">assignment</span>
            <p className="font-bold text-sm">No {tab} assignments.</p>
          </div>
        )}

        {filtered.map(hw => {
          const { txt, cls } = dueDateLabel(hw.dueDate)
          const hwClass = classes.find(c => c.id === hw.classId)
          return (
            <div key={hw.id} className={`glass-panel rounded-3xl p-6 hover:scale-[1.01] transition-all group ${hw.status === 'archived' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {hw.subject || 'General'}
                    </span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full">
                      {hwClass ? `${hwClass.grade} ${hwClass.section}` : 'All Classes'}
                    </span>
                    <span className={`text-[11px] font-bold ${cls}`}>{txt}</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-on-surface truncate group-hover:text-primary transition-colors">{hw.title}</h4>
                  {hw.description && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{hw.description}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button onClick={() => deleteHomework(hw.id)}
                    className="p-2 text-error hover:bg-error-container rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  {hw.status === 'active' && (
                    <button onClick={() => updateHomework(hw.id, { status: 'archived' })}
                      className="px-3 py-1 text-[10px] bg-surface-container-low rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
