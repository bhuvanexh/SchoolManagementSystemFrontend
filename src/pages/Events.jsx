import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const BADGE_COLORS = {
  Academic: 'bg-secondary-container/30 text-on-secondary-container',
  Faculty:  'bg-error-container/30 text-on-error-container',
  Workshop: 'bg-tertiary-container/30 text-on-tertiary-container',
  General:  'bg-primary-fixed/30 text-on-primary-fixed',
}
const CAL_COLORS = {
  Academic: 'bg-tertiary-fixed text-on-tertiary-fixed',
  Faculty:  'bg-primary-fixed text-on-primary-fixed-variant',
  Workshop: 'bg-surface-container-highest text-on-surface',
  General:  'bg-secondary-container text-on-secondary-container',
}

export default function Events() {
  const { events, addEvent, deleteEvent, classes } = useAppStore()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    title: '', date: today, time: '09:00', audience: 'General Campus', description: '', badge: 'Academic',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    addEvent(form)
    setForm({ title: '', date: today, time: '09:00', audience: 'General Campus', description: '', badge: 'Academic' })
  }

  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const getMonthDay = (dateStr) => {
    const dt = new Date(dateStr + 'T12:00:00')
    return { month: dt.toLocaleString('en', { month: 'short' }).toUpperCase(), day: dt.getDate() }
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tighter text-on-surface leading-tight">
            Orchestrate <br />
            <span className="text-primary underline decoration-secondary-fixed underline-offset-8">Memorable</span> Academic Moments.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Design, schedule, and oversee campus activities from one unified portal.
          </p>
        </div>
        <div className="bg-primary p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Active Events</p>
            <h3 className="text-4xl font-bold italic tracking-tighter">{upcoming.length} Upcoming</h3>
          </div>
          <div className="relative z-10 flex -space-x-3 mt-6">
            {['bg-slate-200', 'bg-slate-300', 'bg-slate-400'].map((bg, i) => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-primary ${bg}`} />
            ))}
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary-fixed/20 rounded-full blur-3xl" />
        </div>
      </section>

      <section className="grid grid-cols-12 gap-8">
        {/* Create Event Form */}
        <div className="col-span-12 lg:col-span-7">
          <div className="glass-panel bg-white/70 rounded-3xl p-10 shadow-[0_24px_80px_rgba(25,28,30,0.04)] border border-white/40">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary-fixed rounded-2xl">
                <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-indigo-900">Create New Event</h3>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Event Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Science Fair 2024"
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} min={today}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Time</label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Audience</label>
                <select value={form.audience} onChange={e => set('audience', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium appearance-none outline-none">
                  {classes.map(c => <option key={c.id} value={`${c.grade} - ${c.section}`}>{c.grade} - {c.section}</option>)}
                  <option>All Faculty Members</option>
                  <option>General Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Category</label>
                <select value={form.badge} onChange={e => set('badge', e.target.value)}
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium appearance-none outline-none">
                  {Object.keys(BADGE_COLORS).map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                  placeholder="Briefly describe the event goals..."
                  className="w-full bg-surface-container-low/40 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 text-on-surface font-medium transition-all resize-none outline-none" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit"
                  className="w-full bg-primary-gradient text-white font-bold py-5 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group">
                  <span>Schedule Event</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Upcoming Timeline */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold tracking-tight text-indigo-900">Upcoming Timeline</h3>
            <span className="text-sm font-bold text-on-primary-fixed-variant">{upcoming.length} events</span>
          </div>

          {upcoming.length === 0 && (
            <div className="glass-panel rounded-3xl p-8 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">event_busy</span>
              <p className="font-bold text-sm">No upcoming events. Schedule one!</p>
            </div>
          )}

          {upcoming.slice(0, 4).map(ev => {
            const { month, day } = getMonthDay(ev.date)
            const fmt12 = (t) => {
              const [h, m] = t.split(':').map(Number)
              const ampm = h >= 12 ? 'PM' : 'AM'
              return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
            }
            return (
              <div key={ev.id} className="glass-panel bg-white/70 rounded-3xl p-6 shadow-sm border border-white/30 hover:scale-[1.02] transition-transform group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className={`flex-shrink-0 w-20 h-24 ${CAL_COLORS[ev.badge] || CAL_COLORS.General} rounded-3xl flex flex-col items-center justify-center shadow-inner`}>
                    <span className="text-xs font-extrabold uppercase tracking-widest">{month}</span>
                    <span className="text-3xl font-black">{day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${BADGE_COLORS[ev.badge] || BADGE_COLORS.General}`}>
                        {ev.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-on-surface truncate group-hover:text-primary transition-colors">{ev.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="material-symbols-outlined text-base">group</span>
                        <span className="font-medium truncate max-w-[100px]">{ev.audience}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        <span className="font-medium">{fmt12(ev.time)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteEvent(ev.id)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error-container rounded-full">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            )
          })}

          <div className="relative overflow-hidden bg-surface-container-highest/30 rounded-3xl p-8 border border-white/20">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-on-surface opacity-60 mb-1">Collaborative Planning</h5>
                <p className="text-on-surface font-semibold">Want to co-host an event with another teacher?</p>
              </div>
              <button className="bg-white p-3 rounded-full shadow-md text-primary flex-shrink-0 ml-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-secondary-container/10 pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  )
}
