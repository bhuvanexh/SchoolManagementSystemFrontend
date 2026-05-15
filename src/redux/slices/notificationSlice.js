import {
  fetchNotifications,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../actions/notificationActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0, loading: false, error: null },
  thunkMap: {
    fetchNotifications: {
      thunk: fetchNotifications,
      onFulfilled: (state, action) => {
        state.list = action.payload?.notifications || action.payload || [];
      },
    },
    fetchUnreadCount: {
      thunk: fetchUnreadCount,
      onFulfilled: (state, action) => {
        state.unreadCount = action.payload?.count ?? action.payload ?? 0;
      },
    },
    markAsRead: {
      thunk: markAsRead,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      },
    },
    markAllAsRead: {
      thunk: markAllAsRead,
      onFulfilled: (state, action) => {
        state.list = action.payload?.notifications || state.list.map((item) => ({ ...item, isRead: true }));
        state.unreadCount = 0;
      },
    },
  },
});

export default slice.reducer;
