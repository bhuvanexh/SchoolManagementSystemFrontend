import {
  createSections,
  deleteSection,
  fetchSectionsByClass,
  reassignClassTeacher,
  updateSection,
} from '../actions/sectionActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'sections',
  initialState: { list: [], loading: false, error: null },
  thunkMap: {
    fetchSectionsByClass: {
      thunk: fetchSectionsByClass,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    createSections: {
      thunk: createSections,
      onFulfilled: (state, action) => {
        state.list = Array.isArray(action.payload) ? action.payload : [...state.list, action.payload];
      },
    },
    updateSection: {
      thunk: updateSection,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    reassignClassTeacher: {
      thunk: reassignClassTeacher,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteSection: {
      thunk: deleteSection,
      onFulfilled: (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export default slice.reducer;
