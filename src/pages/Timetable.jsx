const periods = [
  { label: 'Period 1', time: '08:30 AM' },
  { label: 'Period 2', time: '09:15 AM' },
  { label: 'Period 3', time: '10:00 AM' },
  { label: 'Period 4', time: '11:15 AM' },
  { label: 'Period 5', time: '12:00 PM' },
]

const reminders = [
  {
    icon: 'assignment_late', bg: 'bg-error-container', color: 'text-on-error-container',
    title: 'Review Quiz Results', sub: 'Grade 12 Physics (15 pending)',
  },
  {
    icon: 'labs', bg: 'bg-tertiary-fixed', color: 'text-on-tertiary-fixed',
    title: 'Lab Supplies Check', sub: 'Order Helium canisters for Mon',
  },
  {
    icon: 'psychology', bg: 'bg-primary-fixed', color: 'text-on-primary-fixed',
    title: 'Student Counseling', sub: 'Leo M. @ 03:00 PM',
  },
]

export default function Timetable() {
  return (
    <div className="flex gap-8 -mx-0">

      {/* ── Left: Timetable Grid ── */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-on-primary-fixed-variant/60 mb-2 block">
              Current Term: Spring 2024
            </span>
            <h2 className="text-5xl font-extrabold text-indigo-900 tracking-tighter leading-none">Schedule</h2>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white/50 backdrop-blur-xl rounded-full text-sm font-bold text-primary flex items-center gap-2 hover:bg-white transition-all shadow-sm">
              <span className="material-symbols-outlined">file_download</span>
              Export PDF
            </button>
            <button className="px-8 py-3 bg-primary-gradient rounded-full text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform">
              Add Special Event
            </button>
          </div>
        </div>

        {/* Grid Panel */}
        <div className="glass-panel rounded-3xl p-10 shadow-[0_24px_80px_rgba(25,28,30,0.06)] overflow-x-auto">
          <div className="grid grid-cols-6 gap-6 min-w-[700px]">

            {/* Period headers */}
            <div />
            {periods.map((p, i) => (
              <div key={i} className="flex flex-col items-center mb-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{p.label}</span>
                <span className="text-sm font-bold text-slate-600">{p.time}</span>
              </div>
            ))}

            {/* ── Monday ── */}
            <div className="flex items-center font-extrabold text-indigo-900 text-xl tracking-tighter">Monday</div>
            {/* P1 */}
            <div className="glass-panel rounded-3xl p-5 hover:scale-105 transition-all cursor-pointer group hover:bg-white/90">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">Physics</span>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-lg">more_horiz</span>
              </div>
              <h4 className="font-bold text-on-surface leading-tight mb-1">Quantum Theory</h4>
              <p className="text-xs text-on-surface-variant font-medium">Grade 12 • Sec B</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="material-symbols-outlined text-sm">location_on</span>Lab 402
              </div>
            </div>
            {/* P2 – NOW */}
            <div className="relative glass-panel rounded-3xl p-5 ring-4 ring-primary/5 shadow-2xl shadow-primary/10 scale-105" style={{ background: 'rgba(35,31,116,0.03)', borderColor: 'rgba(35,31,116,0.2)' }}>
              <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-secondary-container text-on-secondary-container text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 bg-on-secondary-container rounded-full animate-pulse" />
                NOW
              </div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Mathematics</span>
              </div>
              <h4 className="font-black text-primary leading-tight mb-1">Advanced Calculus</h4>
              <p className="text-xs text-primary-container font-semibold">Grade 11 • Sec A</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-primary/70">
                <span className="material-symbols-outlined text-sm">location_on</span>Hall A-12
              </div>
            </div>
            {/* P3 – Free */}
            <div className="glass-panel rounded-3xl p-5 bg-surface-container-low/30 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Period</span>
            </div>
            {/* P4 */}
            <div className="glass-panel rounded-3xl p-5 hover:scale-105 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-lg uppercase tracking-wider">Astrophysics</span>
              </div>
              <h4 className="font-bold text-on-surface leading-tight mb-1">Cosmology 101</h4>
              <p className="text-xs text-on-surface-variant font-medium">Grade 12 • Sec A</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="material-symbols-outlined text-sm">location_on</span>Room 102
              </div>
            </div>
            {/* P5 */}
            <div className="glass-panel rounded-3xl p-5 hover:scale-105 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Admin</span>
              </div>
              <h4 className="font-bold text-on-surface leading-tight mb-1">Faculty Meeting</h4>
              <p className="text-xs text-on-surface-variant font-medium">Conference Room</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="material-symbols-outlined text-sm">schedule</span>45 Mins
              </div>
            </div>

            {/* ── Tuesday ── */}
            <div className="flex items-center font-extrabold text-indigo-900 text-xl tracking-tighter opacity-70">Tuesday</div>
            {/* P1 */}
            <div className="glass-panel rounded-3xl p-5 opacity-80 hover:opacity-100 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">Physics</span>
              </div>
              <h4 className="font-bold text-on-surface leading-tight mb-1">Lab Work</h4>
              <p className="text-xs text-on-surface-variant font-medium">Grade 10 • Sec C</p>
            </div>
            {/* P2+P3 Double period – spans 2 cols */}
            <div className="col-span-2 glass-panel rounded-3xl p-5 opacity-80 hover:opacity-100 transition-all border-l-4 border-l-tertiary-fixed">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-lg uppercase tracking-wider">Double Period</span>
              </div>
              <h4 className="font-bold text-on-surface text-lg leading-tight mb-1">Deep Space Observations</h4>
              <p className="text-xs text-on-surface-variant font-medium">Observatory • Grad Students</p>
            </div>
            {/* P4 – Free */}
            <div className="glass-panel rounded-3xl p-5 bg-surface-container-low/30 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free</span>
            </div>
            {/* P5 */}
            <div className="glass-panel rounded-3xl p-5 opacity-80 hover:opacity-100 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">Mathematics</span>
              </div>
              <h4 className="font-bold text-on-surface leading-tight mb-1">Linear Algebra</h4>
              <p className="text-xs text-on-surface-variant font-medium">Grade 11 • Sec B</p>
            </div>

            {/* ── Wednesday ── */}
            <div className="flex items-center font-extrabold text-indigo-900 text-xl tracking-tighter opacity-70">Wednesday</div>
            <div className="col-span-5 flex items-center justify-center py-8 bg-surface-container-low/20 border border-slate-100/50 rounded-3xl">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Mid-Week Symposium</p>
                <p className="text-lg font-black text-primary-container">No Regular Classes Scheduled</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-96 flex-shrink-0 space-y-6">

        {/* Upcoming Next */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: '5rem' }}>rocket_launch</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container/40 block mb-6">Upcoming Next</span>
          <div className="space-y-6 relative z-10">
            <div>
              <h3 className="text-3xl font-black text-indigo-900 tracking-tighter mb-2">Linear Algebra</h3>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['AK', 'BL', 'CM'].map(initials => (
                    <div key={initials} className="w-6 h-6 rounded-full bg-primary-container border-2 border-white flex items-center justify-center text-[7px] font-bold text-white">{initials}</div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+24</div>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Grade 11, Section B</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 p-4 rounded-3xl border border-white/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Room</span>
                <p className="text-xl font-black text-primary">B-204</p>
              </div>
              <div className="bg-primary-container p-4 rounded-3xl shadow-lg">
                <span className="text-[10px] font-bold text-on-primary-container/60 uppercase block mb-1">Starts In</span>
                <p className="text-xl font-black text-white">12 Mins</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white text-primary font-black rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn">
              Prepare Materials
              <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Teacher Focus */}
        <div className="glass-panel rounded-3xl p-8 space-y-6">
          <h4 className="text-xl font-black text-indigo-900 tracking-tight">Teacher Focus</h4>
          <div className="space-y-4">
            {reminders.map(r => (
              <div key={r.title} className="flex gap-4 p-4 rounded-3xl hover:bg-white/50 transition-colors cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl ${r.bg} flex items-center justify-center ${r.color} shrink-0`}>
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{r.title}</p>
                  <p className="text-xs text-on-surface-variant">{r.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Library card */}
          <div className="pt-4">
            <div className="relative h-40 rounded-3xl overflow-hidden group/lib bg-gradient-to-br from-primary to-primary-container">
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="material-symbols-outlined text-white/30" style={{ fontSize: '3rem' }}>local_library</span>
                <div>
                  <p className="text-white text-xs font-bold opacity-80 mb-1">Academic Resource</p>
                  <p className="text-white font-black text-sm">Access Digital Library</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
