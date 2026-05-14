import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAppStore } from '../store/useAppStore'


const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/classes': 'My Classes',
  '/attendance': 'Attendance Marking',
  '/timetable': 'Timetable',
  '/subjects': 'Subjects & Syllabus',
  '/homework': 'Homework & Notes',
  '/tests': 'Tests & Marks',
  '/notices': 'Notices',
  '/events': 'Events',
  '/planner': 'Lesson Planner',
  '/performance': 'Student Performance',
}

export default function Layout() {
  const location = useLocation()
  const { getPendingHomeworkCount, notices } = useAppStore()
  const title = pageTitles[location.pathname] || 'Lumina Academy'
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const pendingHW = getPendingHomeworkCount()
  const unreadNotices = notices.length

  return (
    <div className="mesh-bg min-h-screen">
      <Sidebar />
      <main className="ml-72 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 flex justify-between items-center w-full px-12 py-6 bg-white/70 backdrop-blur-xl z-40">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tighter text-indigo-900">{title}</h1>
            <p className="text-on-surface-variant font-medium text-sm">{today}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-200/20 rounded-full px-4 py-2 border border-white/40 focus-within:bg-white/80 transition-all">
              <span className="material-symbols-outlined text-slate-500 text-sm" style={{ fontSize: '18px' }}>search</span>
              <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 placeholder:text-slate-400 ml-2" placeholder="Search portal..." type="text" />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white/50 transition-all">
                <span className="material-symbols-outlined">notifications</span>
                {pendingHW > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {pendingHW > 9 ? '9+' : pendingHW}
                  </span>
                )}
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white/50 transition-all">
                <span className="material-symbols-outlined">apps</span>
              </button>
              <div className="h-10 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm ring-2 ring-indigo-100">
                  EV
                </div>
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-bold text-indigo-900 leading-none">Prof. Elena Vance</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Senior Fellow</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <div className="px-12 py-10 pb-24">
          <Outlet />
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group" style={{ boxShadow: '0 20px 60px rgba(35,31,116,0.4)' }}>
          <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-500">add</span>
        </button>
      </div>
    </div>
  )
}
