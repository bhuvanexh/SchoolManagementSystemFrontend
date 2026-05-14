import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Tests() {
  const { tests, marks, addTest, deleteTest, saveMarks, classes, students, subjects } = useAppStore()
  const today = new Date().toISOString().split('T')[0]

  const [selectedTest, setSelectedTest] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '', classId: classes[0]?.id || '', date: today, maxMarks: 100 })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Marks entry state keyed by studentId
  const [entryMarks, setEntryMarks] = useState({})

  const classSubjects = subjects.filter(s => s.classId === form.classId).map(s => s.name)

  const handleCreateTest = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addTest(form)
    setForm(f => ({ ...f, name: '' }))
  }

  const loadTest = (test) => {
    setSelectedTest(test)
    const existing = {}
    marks.filter(m => m.testId === test.id).forEach(m => {
      existing[m.studentId] = { marks: m.marks, absent: m.absent }
    })
    setEntryMarks(existing)
  }

  const handleSave = () => {
    if (!selectedTest) return
    const arr = Object.entries(entryMarks).map(([studentId, data]) => ({
      studentId, marks: Number(data.marks) || 0, absent: data.absent || false,
    }))
    saveMarks(selectedTest.id, arr)
    alert('Marks saved!')
  }

  const testStudents = selectedTest ? students.filter(s => s.classId === selectedTest.classId) : []
  const avg = useMemo(() => {
    if (!selectedTest) return 0
    const present = Object.values(entryMarks).filter(m => !m.absent && m.marks !== '' && m.marks !== undefined)
    if (!present.length) return 0
    return Math.round(present.reduce((s, m) => s + Number(m.marks), 0) / present.length)
  }, [entryMarks, selectedTest])

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* ── Left Panel ── */}
      <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-8">
        {/* Create Test */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase mb-3">New Test</span>
            <h3 className="text-2xl font-extrabold tracking-tighter text-on-surface">Create Test</h3>
          </div>
          <form className="space-y-4" onSubmit={handleCreateTest}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Test Name</label>
              <input value={form.name} onChange={e => setF('name', e.target.value)} required placeholder="e.g., Unit Test 3"
                className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Class</label>
                <select value={form.classId} onChange={e => setF('classId', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface appearance-none outline-none">
                  {classes.map(c => <option key={c.id} value={c.id}>{c.grade} {c.section}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                <select value={form.subject} onChange={e => setF('subject', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface appearance-none outline-none">
                  <option value="">Select…</option>
                  {classSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Date</label>
                <input type="date" value={form.date} onChange={e => setF('date', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Max Marks</label>
                <input type="number" value={form.maxMarks} min="1" max="1000" onChange={e => setF('maxMarks', Number(e.target.value))}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl p-4 text-on-surface outline-none" />
              </div>
            </div>
            <button type="submit"
              className="w-full bg-primary-gradient text-white py-4 rounded-3xl font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Create Test
            </button>
          </form>
        </div>

        {/* Test list */}
        <div className="glass-panel rounded-3xl p-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">All Tests</h4>
          {tests.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No tests yet.</p>}
          {tests.map(t => {
            const cls = classes.find(c => c.id === t.classId)
            return (
              <button key={t.id} onClick={() => loadTest(t)}
                className={`w-full text-left px-4 py-4 rounded-2xl mb-2 transition-all group flex items-start justify-between gap-3 ${selectedTest?.id === t.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/50'}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">{t.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.subject} · {cls ? `${cls.grade} ${cls.section}` : ''} · {t.date}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteTest(t.id); if(selectedTest?.id === t.id) setSelectedTest(null) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-error p-1 rounded-full hover:bg-error-container flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right: Marks Entry ── */}
      <div className="col-span-12 lg:col-span-8">
        {!selectedTest ? (
          <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center text-slate-400 min-h-[400px]">
            <span className="material-symbols-outlined text-6xl mb-4">quiz</span>
            <h3 className="text-xl font-bold mb-2">Select a Test</h3>
            <p className="text-sm">Click a test on the left to enter marks for its students.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-on-surface">{selectedTest.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  {selectedTest.subject} · {classes.find(c => c.id === selectedTest.classId)?.grade} {classes.find(c => c.id === selectedTest.classId)?.section} · Max: {selectedTest.maxMarks} marks
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-primary">{avg}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Class Average</div>
              </div>
            </div>

            {testStudents.length === 0 && (
              <p className="text-center text-slate-400 py-8">No students in this class.</p>
            )}

            <div className="space-y-3">
              {testStudents.map(s => {
                const entry = entryMarks[s.id] || { marks: '', absent: false }
                return (
                  <div key={s.id} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${entry.absent ? 'opacity-40 bg-error-container/10' : 'bg-surface-container-low/30 hover:bg-white/50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color} text-indigo-900 font-bold text-xs flex-shrink-0`}>{s.initials}</div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface text-sm">{s.name}</p>
                      <p className="text-[10px] text-slate-400">Roll #{s.rollNo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number" min="0" max={selectedTest.maxMarks}
                        value={entry.absent ? '' : entry.marks}
                        disabled={entry.absent}
                        placeholder={entry.absent ? 'Absent' : '0'}
                        onChange={e => setEntryMarks(em => ({ ...em, [s.id]: { ...em[s.id], marks: e.target.value } }))}
                        className="w-20 text-center bg-white/60 border border-indigo-100/50 rounded-xl py-2 font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-slate-400">/{selectedTest.maxMarks}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!entry.absent}
                          onChange={e => setEntryMarks(em => ({ ...em, [s.id]: { ...em[s.id], absent: e.target.checked } }))}
                          className="rounded" />
                        <span className="text-xs font-bold text-error">Absent</span>
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handleSave}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                Save Marks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
