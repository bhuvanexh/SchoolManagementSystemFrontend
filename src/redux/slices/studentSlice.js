import {
  createStudent,
  deactivateStudent,
  fetchStudentById,
  fetchStudents,
  fetchStudentSummary,
  transferStudent,
  updateStudent,
} from '../actions/studentActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'students',
  initialState: { list: [], current: null, summary: null, loading: false, error: null },
  reducers: {
    clearStudents: (state) => { state.list = []; },
    clearCurrentStudent: (state) => { state.current = null; state.summary = null; },
  },
  thunkMap: {
    fetchStudents: {
      thunk: fetchStudents,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchStudentById: {
      thunk: fetchStudentById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    fetchStudentSummary: {
      thunk: fetchStudentSummary,
      onFulfilled: (state, action) => {
        state.summary = action.payload;
      },
    },
    createStudent: {
      thunk: createStudent,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateStudent: {
      thunk: updateStudent,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deactivateStudent: {
      thunk: deactivateStudent,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    transferStudent: {
      thunk: transferStudent,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
  },
});

export const { clearStudents, clearCurrentStudent } = slice.actions;
export default slice.reducer;
