import {
  createTeacher,
  deactivateTeacher,
  fetchMyTeacherProfile,
  fetchTeacherById,
  fetchTeachers,
  updateTeacher,
} from '../actions/teacherActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'teachers',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrentTeacher: (state) => {
      state.current = null;
    },
  },
  thunkMap: {
    fetchTeachers: {
      thunk: fetchTeachers,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchTeacherById: {
      thunk: fetchTeacherById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    fetchMyTeacherProfile: {
      thunk: fetchMyTeacherProfile,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createTeacher: {
      thunk: createTeacher,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateTeacher: {
      thunk: updateTeacher,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deactivateTeacher: {
      thunk: deactivateTeacher,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
  },
});

export const { clearCurrentTeacher } = slice.actions;
export default slice.reducer;
