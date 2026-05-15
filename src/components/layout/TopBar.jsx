import { Bell, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import Avatar from '../data-display/Avatar';
import NotificationDropdown from '../../pages/notifications/components/NotificationDropdown';

const TopBar = ({ title = 'Dashboard' }) => {
  const [open, setOpen] = useState(false);
  const { user, profile } = useSelector((state) => state.auth);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  return (
    <header className="sticky top-0 z-30 mb-8 flex items-center justify-between gap-4 border-b border-white/30 bg-surface/80 px-4 py-5 backdrop-blur-glass lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-full bg-white/70 p-3 text-on-surface shadow-glass-md lg:hidden">
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant">Workspace</p>
          <h1 className="text-2xl font-extrabold text-on-surface">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-white/70 px-4 py-3 shadow-glass-md md:flex">
          <Search className="h-4 w-4 text-on-surface-variant" />
          <input
            className="w-48 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            placeholder="Search modules"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="relative rounded-full bg-white/70 p-3 text-on-surface shadow-glass-md"
          >
            <Bell className="h-4 w-4" />
            {unreadCount ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          <NotificationDropdown open={open} onClose={() => setOpen(false)} />
        </div>

        <div className="hidden items-center gap-3 rounded-full bg-white/70 px-3 py-2 shadow-glass-md sm:flex">
          <Avatar name={profile?.name || user?.username || user?.email || 'User'} size="sm" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{profile?.name || user?.username || 'User'}</p>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">{user?.role || 'guest'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
