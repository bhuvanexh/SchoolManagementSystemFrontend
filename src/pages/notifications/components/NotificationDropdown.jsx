import { Bell, CheckCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { markAllAsRead, markAsRead } from '../../../redux/actions/notificationActions';
import { formatDateTime } from '../../../utils/formatters';

const NotificationDropdown = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [] } = useSelector((state) => state.notifications);

  if (!open) return null;

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      await dispatch(markAsRead(notification._id));
    }

    if (notification.link) {
      navigate(notification.link);
    }

    onClose?.();
  };

  return (
    <div className="absolute right-0 top-14 z-40 w-[360px] rounded-glass bg-white/95 p-4 shadow-glass backdrop-blur-glass">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Notifications</h3>
        <button
          type="button"
          onClick={() => dispatch(markAllAsRead())}
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>
      <div className="custom-scrollbar mt-4 max-h-96 space-y-3 overflow-y-auto">
        {list.length ? (
          list.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() => handleClick(notification)}
              className={`w-full rounded-glass-sm p-4 text-left transition hover:bg-surface ${
                notification.isRead ? 'bg-surface-container-low' : 'bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface">{notification.message || 'New update'}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{formatDateTime(notification.createdAt)}</p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-glass-sm bg-surface-container-low p-5 text-center text-sm text-on-surface-variant">
            No notifications right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
