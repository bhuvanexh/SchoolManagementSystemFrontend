import {
  createCoreSubject,
  deleteCoreSubject,
  fetchCoreSubjects,
  updateCoreSubject,
} from '../actions/coreSubjectActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'coreSubjects',
  initialState: { list: [], loading: false, error: null },
  thunkMap: {
    fetchCoreSubjects: {
      thunk: fetchCoreSubjects,
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    },
    createCoreSubject: {
      thunk: createCoreSubject,
      onFulfilled: (state, action) => {
        state.list.unshift(action.payload);
      },
    },
    updateCoreSubject: {
      thunk: updateCoreSubject,
      onFulfilled: (state, action) => {
        state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
      },
    },
    deleteCoreSubject: {
      thunk: deleteCoreSubject,
      onFulfilled: (state, action) => {
        const deletedId = action.meta.arg;
        state.list = state.list.filter((item) => item._id !== deletedId);
      },
    },
  },
});

export default slice.reducer;
