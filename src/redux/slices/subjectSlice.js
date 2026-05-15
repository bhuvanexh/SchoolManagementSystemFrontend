import {
  createSubject,
  deleteSubject,
  fetchSubjectById,
  fetchSubjects,
  reassignSubjectTeacher,
  updateSubject,
} from '../actions/subjectActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'subjects',
  initialState: { list: [], current: null, loading: false, error: null },
  thunkMap: {
    fetchSubjects: {
      thunk: fetchSubjects,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchSubjectById: {
      thunk: fetchSubjectById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createSubject: {
      thunk: createSubject,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateSubject: {
      thunk: updateSubject,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    reassignSubjectTeacher: {
      thunk: reassignSubjectTeacher,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteSubject: {
      thunk: deleteSubject,
      onFulfilled: (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export default slice.reducer;
