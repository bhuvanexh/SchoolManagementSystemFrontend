import {
  createTest,
  deleteTest,
  fetchTestById,
  fetchTests,
  publishTest,
  updateTest,
} from '../actions/testActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'tests',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearTests: (state) => { state.list = []; state.current = null; },
  },
  thunkMap: {
    fetchTests: {
      thunk: fetchTests,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    fetchTestById: {
      thunk: fetchTestById,
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    },
    createTest: {
      thunk: createTest,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateTest: {
      thunk: updateTest,
      onFulfilled: (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    publishTest: {
      thunk: publishTest,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteTest: {
      thunk: deleteTest,
      onFulfilled: (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.meta.arg);
      },
    },
  },
});

export const { clearTests } = slice.actions;
export default slice.reducer;
