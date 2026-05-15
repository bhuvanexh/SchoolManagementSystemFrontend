import {
  editResult,
  fetchResultsByStudent,
  fetchResultsByTest,
  submitResults,
} from '../actions/resultActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'results',
  initialState: { testResults: [], studentResults: [], loading: false, error: null },
  thunkMap: {
    fetchResultsByTest: {
      thunk: fetchResultsByTest,
      onFulfilled: (state, action) => {
        state.testResults = action.payload;
      },
    },
    fetchResultsByStudent: {
      thunk: fetchResultsByStudent,
      onFulfilled: (state, action) => {
        state.studentResults = action.payload;
      },
    },
    submitResults: {
      thunk: submitResults,
      onFulfilled: (state, action) => {
        state.testResults = action.payload;
      },
    },
    editResult: {
      thunk: editResult,
      onFulfilled: (state, action) => {
        state.testResults = state.testResults.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
  },
});

export default slice.reducer;
