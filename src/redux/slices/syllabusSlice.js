import {
  createSyllabusItem,
  deleteSyllabusItem,
  fetchSyllabus,
  reorderSyllabus,
  toggleSyllabusStatus,
  updateSyllabusItem,
} from '../actions/syllabusActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'syllabus',
  initialState: { items: [], loading: false, error: null },
  thunkMap: {
    fetchSyllabus: {
      thunk: fetchSyllabus,
      onFulfilled: (state, action) => {
        state.items = action.payload;
      },
    },
    createSyllabusItem: {
      thunk: createSyllabusItem,
      onFulfilled: (state, action) => {
        state.items.push(action.payload);
      },
    },
    updateSyllabusItem: {
      thunk: updateSyllabusItem,
      onFulfilled: (state, action) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    toggleSyllabusStatus: {
      thunk: toggleSyllabusStatus,
      onFulfilled: (state, action) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    reorderSyllabus: {
      thunk: reorderSyllabus,
      onFulfilled: (state, action) => {
        state.items = action.payload;
      },
    },
    deleteSyllabusItem: {
      thunk: deleteSyllabusItem,
      onFulfilled: (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export default slice.reducer;
