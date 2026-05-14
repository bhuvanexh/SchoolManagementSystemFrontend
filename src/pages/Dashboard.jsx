import { useAppStore } from '../store/useAppStore'

export default function Dashboard() {
  const {
    students, classes, homework, tests, lessons, events, notices,
    getTodayAttendanceRate, getPendingHomeworkCount, getUpcomingTestsCount, getTodaysLessons,
  } = useAppStore()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const dateLabel = today.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const attRate = getTodayAttendanceRate()
  const pendingHW = getPendingHomeworkCount()
  const upcomingTests = getUpcomingTestsCount()
  const todaysLessons = getTodaysLessons()
  const upcomingEvents = events.filter(e => e.date >= todayStr).slice(0, 2)
  const recentNotices = notices.slice(0, 3)

  const statCards = [
    { label: 'Total Students',   value: students.length,  icon: 'groups',     sub: `Across ${classes.length} classes`,     bg: 'bg-primary-fixed',     text: 'text-primary' },
    { label: 'Today\'s Attendance', value: `${attRate}%`, icon: 'fact_check',  sub: 'Present today',                        bg: 'bg-secondary-fixed',   text: 'text-secondary' },
    { label: 'Pending Homework', value: pendingHW,         icon: 'assignment',  sub: 'Active assignments',                   bg: 'bg-tertiary-fixed',    text: 'text-tertiary' },
    { label: 'Upcoming Tests',   value: upcomingTests,     icon: 'quiz',        sub: 'Scheduled tests',                      bg: 'bg-error-container',   text: 'text-error' },
    { label: 'Active Classes',   value: classes.length,    icon: 'class',       sub: 'Sections managed',                     bg: 'bg-primary-fixed',     text: 'text-primary' },
    { label: 'Today\'s Lessons', value: todaysLessons.length, icon: 'edit_calendar', sub: 'Lessons planned today',          bg: 'bg-surface-container-high', text: 'text-on-surface' },
  ]

  const periodColors = ['bg-tertiary-fixed text-on-tertiary-fixed', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-primary-fixed text-on-primary-fixed', 'bg-surface-container text-on-surface-variant']

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div className="flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface">Good morning, <span className="text-primary">Teacher.</span></h1>
        <p className="text-on-surface-variant mt-2">{dateLabel}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-3xl p-5 flex flex-col gap-2 shadow-sm`}>
            <span className={`material-symbols-outlined ${s.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/60">{s.label}</p>
            <p className="text-[10px] text-on-surface/40">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Today's Lessons / Schedule */}
        <section className="col-span-12 lg:col-span-5 glass-panel rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Today's Lessons</h3>
            <span className="text-xs font-bold text-slate-400 uppercase">{todaysLessons.length} planned</span>
          </div>

          {todaysLessons.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">edit_calendar</span>
              <p className="text-sm font-bold">No lessons scheduled today.</p>
              <p className="text-xs mt-1">Use the Planner to add lessons.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysLessons.map((l, i) => (
                <div key={l.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/30 hover:bg-white/50 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${periodColors[i % periodColors.length]}`}>
                    <span className="text-xs font-extrabold">{l.period?.split(' ')[1] || i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface truncate">{l.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{l.subject} · {l.period}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming from all lessons */}
          {todaysLessons.length === 0 && (() => {
            const soon = lessons.filter(l => l.date > todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
            return soon.length > 0 && (
              <>
                <div className="mt-6 mb-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Upcoming Lessons</span>
                </div>
                <div className="space-y-3">
                  {soon.map((l, i) => (
                    <div key={l.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/30">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${periodColors[i % periodColors.length]}`}>
                        <span className="text-[10px] font-extrabold text-center leading-tight">{new Date(l.date+'T12:00:00').toLocaleString('en',{month:'short',day:'numeric'})}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface truncate">{l.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{l.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </section>

        {/* Recent Activity */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          {/* Upcoming Events */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Upcoming Events</h3>
              <span className="text-xs font-bold text-slate-400">{events.filter(e => e.date >= todayStr).length} scheduled</span>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/30 hover:bg-white/40 transition-all">
                    <div className="w-12 h-12 bg-primary-fixed rounded-2xl flex flex-col items-center justify-center text-primary flex-shrink-0">
                      <span className="text-[9px] font-extrabold uppercase">{new Date(ev.date+'T12:00:00').toLocaleString('en',{month:'short'})}</span>
                      <span className="text-lg font-black leading-tight">{new Date(ev.date+'T12:00:00').getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface truncate">{ev.title}</p>
                      <p className="text-xs text-slate-400">{ev.time} · {ev.audience}</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-surface-container rounded-full font-bold text-on-surface-variant flex-shrink-0">{ev.badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notices */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Recent Notices</h3>
              <span className="text-xs font-bold text-slate-400">{notices.length} total</span>
            </div>
            {recentNotices.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No notices published yet.</p>
            ) : (
              <div className="space-y-3">
                {recentNotices.map(n => (
                  <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low/30 hover:bg-white/40 transition-all">
                    <div className="w-10 h-10 bg-surface-container-high rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-indigo-700 text-sm">campaign</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface text-sm truncate">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.audience}</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-primary-fixed rounded-full font-bold text-primary flex-shrink-0">{n.badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Homework */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Active Homework</h3>
              <span className="text-xs font-bold text-slate-400">{pendingHW} pending</span>
            </div>
            {homework.filter(h => h.status === 'active').length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">All caught up!</p>
            ) : (
              <div className="space-y-3">
                {homework.filter(h => h.status === 'active').slice(0, 3).map(hw => {
                  const cls = classes.find(c => c.id === hw.classId)
                  return (
                    <div key={hw.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/30">
                      <span className="material-symbols-outlined text-indigo-400">assignment</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface text-sm truncate">{hw.title}</p>
                        <p className="text-[10px] text-slate-400">{hw.subject} · Due {hw.dueDate}</p>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-surface-container rounded-full font-bold text-on-surface-variant flex-shrink-0">
                        {cls ? `${cls.grade} ${cls.section}` : 'All'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
