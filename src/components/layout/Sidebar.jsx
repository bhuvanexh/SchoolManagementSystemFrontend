import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from '../../redux/slices/authSlice';
import { navConfig } from '../../utils/roleNavConfig';

const Sidebar = ({ role = 'admin' }) => {
  const dispatch = useDispatch();
  const items = navConfig[role] || [];

  return (
    <aside className="custom-scrollbar hidden h-screen w-72 flex-col overflow-y-auto border-r border-white/30 bg-white/60 px-5 py-6 backdrop-blur-glass lg:flex">
      <div className="rounded-[28px] bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-primary-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">SMS</p>
        <h2 className="mt-3 text-2xl font-extrabold">School Management</h2>
        <p className="mt-2 text-sm text-white/80">Coordinated daily operations for admins, teachers, and students.</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-glass-sm px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-primary text-white shadow-primary-glow-xs'
                    : 'text-on-surface-variant hover:bg-white/80 hover:text-on-surface'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => dispatch(logout())}
        className="mt-6 flex items-center gap-3 rounded-glass-sm bg-white/70 px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
