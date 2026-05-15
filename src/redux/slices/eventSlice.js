import {
  createEvent,
  deleteEvent,
  fetchEventById,
  fetchEvents,
  updateEvent,
} from '../actions/eventActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'events',
  initialState: { list: [], current: null, loading: false, error: null },
  thunkMap: {
    fetchEvents: {
      thunk: fetchEvents,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchEventById: {
      thunk: fetchEventById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createEvent: {
      thunk: createEvent,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateEvent: {
      thunk: updateEvent,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteEvent: {
      thunk: deleteEvent,
      onFulfilled: (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export default slice.reducer;
