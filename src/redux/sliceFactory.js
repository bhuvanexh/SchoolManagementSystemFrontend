import { createSlice } from '@reduxjs/toolkit';

export const createEntitySlice = ({
  name,
  initialState,
  reducers = {},
  thunkMap = {},
}) =>
  createSlice({
    name,
    initialState,
    reducers,
    extraReducers: (builder) => {
      Object.values(thunkMap).forEach(({ thunk, onFulfilled }) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.loading = false;
            if (onFulfilled) {
              onFulfilled(state, action);
            }
          })
          .addCase(thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      });
    },
  });
