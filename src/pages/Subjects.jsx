import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const SUBJECT_COLORS = [
  'bg-indigo-50 border-indigo-200/50',
  'bg-emerald-50 border-emerald-200/50',
  'bg-amber-50 border-amber-200/50',
  'bg-rose-50 border-rose-200/50',
  'bg-teal-50 border-teal-200/50',
]
const PROGRESS_COLORS = ['bg-indigo-900', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500', 'bg-teal-600']

export default function Subjects() {
  const { subjects, classes, addSubject, updateSubjectProgress, deleteSubject } = useAppStore()
  const [filterClass, setFilterClass] = useState('all')
  const [editing, setEditing] = useState({}) // subjectId -> new topicsDone value
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', classId: classes[0]?.id || '', topicsTotal: 20, color: 'bg-indigo-100 text-indigo-800' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = subjects.filter(s => filterClass === 'all' || s.classId === filterClass)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addSubject(form)
    setForm({ name: '', classId: classes[0]?.id || '', topicsTotal: 20, color: 'bg-indigo-100 text-indigo-800' })
    setShowAdd(false)
  }

  const totalTopics = subjects.reduce((s, sub) => s + sub.topicsTotal, 0)
  const doneTopics  = subjects.reduce((s, sub) => s + sub.topicsDone, 0)
  const overallPct  = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Total Subjects', value: subjects.length, icon: 'menu_book', bg: 'bg-primary-fixed', text: 'text-primary' },
          { label: 'Topics Covered', value: `${doneTopics}/${totalTopics}`, icon: 'task_alt', bg: 'bg-secondary-fixed', text: 'text-secondary' },
          { label: 'Overall Progress', value: `${overallPct}%`, icon: 'donut_large', bg: 'bg-tertiary-fixed', text: 'text-tertiary' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-3xl p-6 flex items-center gap-5`}>
            <span className={`material-symbols-outlined text-3xl ${s.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <div>
              <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Add */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => setFilterClass('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filterClass === 'all' ? 'bg-indigo-900 text-white shadow-lg' : 'bg-surface-container text-on-surface-variant hover:bg-white/70'}`}>
            All Subjects
          </button>
          {classes.map(c => (
            <button key={c.id} onClick={() => setFilterClass(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filterClass === c.id ? 'bg-indigo-900 text-white shadow-lg' : 'bg-surface-container text-on-surface-variant hover:bg-white/70'}`}>
              {c.grade} {c.section}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-lg hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="glass-panel rounded-3xl p-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px] space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Subject Name</label>
            <input value={form.name} onChange={e => setF('name', e.target.value)} required placeholder="e.g., Chemistry"
              className="w-full bg-white/60 border-none rounded-2xl p-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div className="flex-1 min-w-[140px] space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Class</label>
            <select value={form.classId} onChange={e => setF('classId', e.target.value)}
              className="w-full bg-white/60 border-none rounded-2xl p-3 text-on-surface appearance-none outline-none">
              {classes.map(c => <option key={c.id} value={c.id}>{c.grade} {c.section}</option>)}
            </select>
          </div>
          <div className="w-32 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Total Topics</label>
            <input type="number" min="1" value={form.topicsTotal} onChange={e => setF('topicsTotal', Number(e.target.value))}
              className="w-full bg-white/60 border-none rounded-2xl p-3 text-on-surface outline-none" />
          </div>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow">Save</button>
          <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 bg-surface-container text-on-surface-variant rounded-2xl font-bold text-sm">Cancel</button>
        </form>
      )}

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((sub, i) => {
          const pct = sub.topicsTotal ? Math.round((sub.topicsDone / sub.topicsTotal) * 100) : 0
          const cls = classes.find(c => c.id === sub.classId)
          const isEditing = editing[sub.id] !== undefined
          return (
            <div key={sub.id} className={`glass-panel border rounded-3xl p-7 flex flex-col gap-5 hover:scale-[1.01] transition-all group ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sub.color || 'bg-indigo-100 text-indigo-800'} inline-block mb-2`}>
                    {cls ? `${cls.grade} ${cls.section}` : 'General'}
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-on-surface">{sub.name}</h3>
                </div>
                <button onClick={() => deleteSubject(sub.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-error hover:bg-error-container rounded-full">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-on-surface-variant">Progress</span>
                  <span className="text-on-surface">{pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                  <div className={`h-full ${PROGRESS_COLORS[i % PROGRESS_COLORS.length]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant">
                  <span>{sub.topicsDone} topics done</span>
                  <span>{sub.topicsTotal} total</span>
                </div>
              </div>

              {/* Edit progress inline */}
              <div className="flex items-center gap-3 pt-2 border-t border-indigo-100/30">
                {isEditing ? (
                  <>
                    <input type="number" min="0" max={sub.topicsTotal}
                      value={editing[sub.id]}
                      onChange={e => setEditing(ed => ({ ...ed, [sub.id]: Number(e.target.value) }))}
                      className="w-24 text-center bg-white/70 border border-indigo-200/40 rounded-xl p-2 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm text-slate-400">/ {sub.topicsTotal} topics done</span>
                    <button onClick={() => { updateSubjectProgress(sub.id, editing[sub.id]); setEditing(ed => { const n={...ed}; delete n[sub.id]; return n }) }}
                      className="ml-auto px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow">Save</button>
                    <button onClick={() => setEditing(ed => { const n={...ed}; delete n[sub.id]; return n })}
                      className="px-3 py-2 bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant">✕</button>
                  </>
                ) : (
                  <button onClick={() => setEditing(ed => ({ ...ed, [sub.id]: sub.topicsDone }))}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-sm">edit</span> Update Progress
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
