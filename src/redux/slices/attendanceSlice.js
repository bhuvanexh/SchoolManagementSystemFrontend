import {
  editAttendance,
  fetchSectionAttendance,
  fetchStudentAttendance,
  markAttendance,
} from '../actions/attendanceActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'attendance',
  initialState: { records: [], studentHistory: [], loading: false, error: null },
  thunkMap: {
    markAttendance: {
      thunk: markAttendance,
      onFulfilled: (state, action) => {
        state.records = action.payload?.records || action.payload || [];
      },
    },
    fetchSectionAttendance: {
      thunk: fetchSectionAttendance,
      onFulfilled: (state, action) => {
        state.records = action.payload?.records || action.payload || [];
      },
    },
    fetchStudentAttendance: {
      thunk: fetchStudentAttendance,
      onFulfilled: (state, action) => {
        state.studentHistory = action.payload?.records || action.payload || [];
      },
    },
    editAttendance: {
      thunk: editAttendance,
      onFulfilled: (state, action) => {
        const updated = action.payload;
        state.records = state.records.map((item) => (item._id === updated._id ? updated : item));
      },
    },
  },
});

export default slice.reducer;
