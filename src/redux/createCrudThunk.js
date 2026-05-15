import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosClient from './axiosClient';
import { getErrorMessage } from '../utils/helpers';

export const createApiThunk = (typePrefix, requestConfigBuilder, messages = {}) =>
  createAsyncThunk(typePrefix, async (payload, { rejectWithValue }) => {
    try {
      const config = typeof requestConfigBuilder === 'function' ? requestConfigBuilder(payload) : requestConfigBuilder;
      const response = await axiosClient(config);
      const result = response.data?.data ?? response.data;

      if (messages.success) {
        toast.success(typeof messages.success === 'function' ? messages.success(result, payload) : messages.success);
      }

      return result;
    } catch (error) {
      const message = getErrorMessage(error, messages.error || 'Request failed');
      toast.error(message);
      return rejectWithValue(message);
    }
  });
