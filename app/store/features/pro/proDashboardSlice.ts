import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProDashboardData } from '@/types';
import type { RootState } from '@/app/store/store';
import { acceptJobItem, rejectJobRequest } from './proBookingsSlice';

interface ProDashboardState {
  data: ProDashboardData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProDashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchProDashboard = createAsyncThunk<
  ProDashboardData,
  void,
  { state: RootState }
>('proDashboard/fetch', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${backendUrl}/api/pro/dashboard`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data.');
  }
});

const proDashboardSlice = createSlice({
  name: 'proDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProDashboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProDashboard.fulfilled, (state, action: PayloadAction<ProDashboardData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(acceptJobItem.fulfilled, (state, action) => {
          if (state.data) {
              state.data.newJobRequests = state.data.newJobRequests.filter(
                  req => req.bookingId !== action.payload.bookingId
              );
          }
      })
      .addCase(rejectJobRequest.fulfilled, (state, action) => {
          if (state.data) {
              state.data.newJobRequests = state.data.newJobRequests.filter(
                  req => req.bookingId !== action.payload.bookingId
              );
          }
      });
  },
});

export default proDashboardSlice.reducer;