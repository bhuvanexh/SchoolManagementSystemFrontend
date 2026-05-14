import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const GRADE_COLORS = [
  { bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' },
  { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' },
  { bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
]

export default function MyClasses() {
  const { classes, students, subjects, addClass, updateClass, deleteClass } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ grade: 'Grade 10', section: 'A', subject: '', teacherName: 'Dr. Sarah Weaver' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.subject.trim()) return
    if (editing) {
      updateClass(editing.id, form)
      setEditing(null)
    } else {
      addClass(form)
    }
    setForm({ grade: 'Grade 10', section: 'A', subject: '', teacherName: 'Dr. Sarah Weaver' })
    setShowAdd(false)
  }

  const startEdit = (cls) => {
    setEditing(cls)
    setForm({ grade: cls.grade, section: cls.section, subject: cls.subject, teacherName: cls.teacherName })
    setShowAdd(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface">My Classes</h1>
          <p className="text-on-surface-variant mt-2">{classes.length} active class{classes.length !== 1 ? 'es' : ''} · {students.length} total students</p>
        </div>
        <button onClick={() => { setEditing(null); setShowAdd(!showAdd); setForm({ grade: 'Grade 10', section: 'A', subject: '', teacherName: 'Dr. Sarah Weaver' }) }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined">add</span>
          Add Class
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAdd && (
        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-8 space-y-5">
          <h3 className="text-xl font-bold text-on-surface">{editing ? 'Edit Class' : 'New Class'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Grade</label>
              <select value={form.grade} onChange={e => setF('grade', e.target.value)}
                className="w-full bg-white/60 border-none rounded-2xl p-4 text-on-surface appearance-none outline-none">
                {['Grade 9','Grade 10','Grade 11','Grade 12'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Section</label>
              <select value={form.section} onChange={e => setF('section', e.target.value)}
                className="w-full bg-white/60 border-none rounded-2xl p-4 text-on-surface appearance-none outline-none">
                {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Primary Subject</label>
              <input value={form.subject} onChange={e => setF('subject', e.target.value)} required placeholder="e.g., Advanced Mathematics"
                className="w-full bg-white/60 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-7 py-3 bg-primary text-white rounded-2xl font-bold shadow">
              {editing ? 'Save Changes' : 'Create Class'}
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setEditing(null) }}
              className="px-6 py-3 bg-surface-container text-on-surface-variant rounded-2xl font-bold">Cancel</button>
          </div>
        </form>
      )}

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls, i) => {
          const count = students.filter(s => s.classId === cls.id).length
          const clsSubjects = subjects.filter(s => s.classId === cls.id)
          const col = GRADE_COLORS[i % GRADE_COLORS.length]
          return (
            <div key={cls.id} className={`glass-panel rounded-3xl p-8 hover:scale-[1.02] transition-all group relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${col.bg} rounded-bl-[3rem] opacity-40`} />
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${col.bg} ${col.text} mb-3`}>
                      {cls.grade} — {cls.section}
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-on-surface">{cls.subject}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(cls)}
                      className="p-2 bg-white/70 rounded-xl text-primary shadow-sm border border-white/50">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => deleteClass(cls.id)}
                      className="p-2 bg-error-container rounded-xl text-error shadow-sm">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 mb-5">
                  <div className="text-center">
                    <div className="text-2xl font-black text-on-surface">{count}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Students</div>
                  </div>
                  <div className="h-8 w-px bg-indigo-100/50" />
                  <div className="text-center">
                    <div className="text-2xl font-black text-on-surface">{clsSubjects.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Subjects</div>
                  </div>
                </div>

                {/* Subjects list */}
                {clsSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {clsSubjects.slice(0, 3).map(s => (
                      <span key={s.id} className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.color || 'bg-surface-container text-on-surface-variant'}`}>
                        {s.name}
                      </span>
                    ))}
                    {clsSubjects.length > 3 && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant">+{clsSubjects.length - 3}</span>}
                  </div>
                )}

                {/* Student avatars */}
                {count > 0 && (
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-indigo-100/30">
                    <div className="flex -space-x-2">
                      {students.filter(s => s.classId === cls.id).slice(0, 5).map(s => (
                        <div key={s.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${s.color} text-indigo-900 font-bold text-[10px]`}>
                          {s.initials}
                        </div>
                      ))}
                      {count > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                          +{count - 5}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-on-surface-variant">{cls.teacherName}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {classes.length === 0 && (
          <div className="col-span-3 glass-panel rounded-3xl p-16 flex flex-col items-center text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3">class</span>
            <p className="font-bold text-lg">No classes yet.</p>
            <p className="text-sm mt-1">Click "Add Class" to create your first class.</p>
          </div>
        )}
      </div>
    </div>
  )
}
