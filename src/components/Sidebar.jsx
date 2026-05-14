import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/classes', icon: 'groups', label: 'My Classes' },
  { to: '/attendance', icon: 'fact_check', label: 'Attendance' },
  { to: '/timetable', icon: 'calendar_today', label: 'Timetable' },
  { to: '/subjects', icon: 'menu_book', label: 'Subjects' },
  { to: '/homework', icon: 'assignment', label: 'Homework' },
  { to: '/tests', icon: 'quiz', label: 'Tests' },
  { to: '/notices', icon: 'campaign', label: 'Notices' },
  { to: '/events', icon: 'event', label: 'Events' },
  { to: '/planner', icon: 'edit_calendar', label: 'Planner' },
  { to: '/performance', icon: 'trending_up', label: 'Performance' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-6 gap-2 bg-slate-50/50 backdrop-blur-2xl w-72 rounded-r-[3rem] border-r border-white/20 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-indigo-900 leading-tight">Lumina Academy</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Teacher Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="pt-4 mt-4 border-t border-slate-200/50">
        <button className="nav-item w-full">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium tracking-wide">Settings</span>
        </button>
      </div>
    </aside>
  )
}
