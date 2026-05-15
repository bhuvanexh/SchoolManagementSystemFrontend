import { fetchDashboard } from '../actions/dashboardActions';
import { createEntitySlice } from '../sliceFactory';

const slice = createEntitySlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  thunkMap: {
    fetchDashboard: {
      thunk: fetchDashboard,
      onFulfilled: (state, action) => {
        state.data = action.payload;
      },
    },
  },
});

export default slice.reducer;
