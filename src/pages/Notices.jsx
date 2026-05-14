import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const BADGE_COLORS = {
  Academics: 'bg-tertiary-fixed text-on-tertiary-fixed',
  Events:    'bg-primary-fixed text-on-primary-fixed',
  Critical:  'bg-error-container text-on-error-container',
  General:   'bg-surface-container text-on-surface-variant',
}

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  return `${d} day${d > 1 ? 's' : ''} ago`
}

export default function Notices() {
  const { notices, addNotice, deleteNotice, classes } = useAppStore()
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [audience, setAudience] = useState(classes[0] ? `${classes[0].grade} - ${classes[0].section}` : 'All Students')
  const [badge, setBadge]       = useState('Academics')

  const handlePublish = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addNotice({ title, description, audience, badge })
    setTitle(''); setDesc('')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <section>
        <h1 className="text-5xl font-extrabold tracking-tighter text-indigo-950 mb-2">Notices &amp; Announcements</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Broadcast academic updates, event reminders, and official circulars to students and faculty across campus.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-10 shadow-[0_24px_80px_rgba(25,28,30,0.04)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-fixed rounded-2xl text-primary">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Create New Notice</h3>
          </div>

          <form className="space-y-6" onSubmit={handlePublish}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Title</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Upcoming Mid-term Examination Schedule"
                required
                className="w-full bg-surface-container-low/40 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-6 text-on-surface transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
              <textarea
                value={description} onChange={e => setDesc(e.target.value)}
                rows={4} placeholder="Detailed announcement text..."
                className="w-full bg-surface-container-low/40 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-6 text-on-surface transition-all resize-none outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Audience</label>
                <select
                  value={audience} onChange={e => setAudience(e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 text-on-surface appearance-none cursor-pointer outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={`${c.grade} - ${c.section}`}>{c.grade} - {c.section}</option>
                  ))}
                  <option value="All Students">All Students</option>
                  <option value="Faculty & Staff">Faculty &amp; Staff</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
                <select
                  value={badge} onChange={e => setBadge(e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 text-on-surface appearance-none cursor-pointer outline-none"
                >
                  {Object.keys(BADGE_COLORS).map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-gradient text-white py-5 rounded-3xl font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              Publish Announcement
            </button>
          </form>
        </section>

        {/* Recent Notices */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-700">history</span>
              <h3 className="text-xl font-bold tracking-tight">Recent Notices</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">{notices.length} total</span>
          </div>

          {notices.length === 0 && (
            <div className="glass-panel rounded-3xl p-8 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">campaign</span>
              <p className="font-bold text-sm">No notices yet. Publish one!</p>
            </div>
          )}

          {notices.slice(0, 5).map(n => (
            <div key={n.id} className="glass-panel rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${BADGE_COLORS[n.badge] || BADGE_COLORS.General}`}>
                    {n.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium text-outline">{timeAgo(n.createdAt)}</p>
                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error-container p-1 rounded-full"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-indigo-950 leading-tight mb-1">{n.title}</h4>
                  {n.description && <p className="text-xs text-slate-500 line-clamp-2">{n.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">group</span>
                      <span className="text-xs font-semibold">{n.audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Accent card */}
          <div className="mt-2 rounded-3xl p-8 overflow-hidden relative min-h-[140px] flex items-center bg-indigo-900 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-indigo-950 opacity-90" />
            <div className="relative z-10">
              <h4 className="text-white text-xl font-bold mb-1">Stay Connected</h4>
              <p className="text-white/60 text-sm leading-snug">
                {notices.filter(n => n.badge === 'Academics').length} academic · {notices.filter(n => n.badge === 'Events').length} event · {notices.filter(n => n.badge === 'Critical').length} critical notices published.
              </p>
              <div className="mt-3">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">+850 Active Readers</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
