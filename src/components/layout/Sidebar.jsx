import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from '../../redux/slices/authSlice';
import { navConfig } from '../../utils/roleNavConfig';

const isItemActive = (item, location) => {
  const itemPath = item.path;
  const pathname = location.pathname;
  // Exact match for root '/'
  if (itemPath === '/') return pathname === '/';
  // Match the item path or any nested path under it: /teachers, /teachers/123, /teachers/new
  const matches = pathname === itemPath || pathname.startsWith(`${itemPath}/`);
  if (!matches) return false;
  const scopeParam = new URLSearchParams(location.search).get('scope');
  const itemScope = item.search ? new URLSearchParams(item.search).get('scope') : null;
  return scopeParam === itemScope;
};

const Sidebar = ({ role = 'admin' }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const items = navConfig[role] || [];

  return (
    <aside className="custom-scrollbar hidden h-screen w-72 flex-col overflow-y-auto border-r border-white/30 bg-white/60 px-5 py-6 backdrop-blur-glass lg:flex">
      <div className="rounded-[28px] bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-primary-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">SMS</p>
        <h2 className="mt-3 text-2xl font-extrabold">School Management</h2>
        <p className="mt-2 text-sm text-white/80">Coordinated daily operations for admins, teachers, and students.</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map((item, idx) => {
          if (item.type === 'divider') {
            return (
              <div key={`divider-${idx}`} className="mb-1 mt-4 px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">{item.label}</p>
              </div>
            );
          }

          const Icon = item.icon;
          const active = isItemActive(item, location);
          const to = item.search ? `${item.path}${item.search}` : item.path;

          return (
            <Link
              key={`${item.path}-${item.search || 'default'}`}
              to={to}
              className={`flex items-center gap-3 rounded-glass-sm px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-primary text-white shadow-primary-glow-xs'
                  : 'text-on-surface-variant hover:bg-white/80 hover:text-on-surface'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
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
