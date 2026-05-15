import {
  createNotice,
  deleteNotice,
  fetchNoticeById,
  fetchNotices,
  updateNotice,
} from '../actions/noticeActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'notices',
  initialState: { list: [], current: null, loading: false, error: null },
  thunkMap: {
    fetchNotices: {
      thunk: fetchNotices,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchNoticeById: {
      thunk: fetchNoticeById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createNotice: {
      thunk: createNotice,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateNotice: {
      thunk: updateNotice,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteNotice: {
      thunk: deleteNotice,
      onFulfilled: (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export default slice.reducer;
