import {
  createClass,
  deactivateClass,
  fetchClassById,
  fetchClasses,
  updateClass,
} from '../actions/classActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'classes',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrentClass: (state) => {
      state.current = null;
    },
  },
  thunkMap: {
    fetchClasses: {
      thunk: fetchClasses,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchClassById: {
      thunk: fetchClassById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createClass: {
      thunk: createClass,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateClass: {
      thunk: updateClass,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deactivateClass: {
      thunk: deactivateClass,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
  },
});

export const { clearCurrentClass } = slice.actions;
export default slice.reducer;
