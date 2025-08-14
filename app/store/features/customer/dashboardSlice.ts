import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomerDashboardData } from '@/types';
import type { RootState } from '@/app/store/store';

interface CustomerDashboardState {
  data: CustomerDashboardData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomerDashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchCustomerDashboard = createAsyncThunk<
  CustomerDashboardData,
  void,
  { state: RootState }
>('customer/fetchDashboard', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data } = await axios.get(`${backendUrl}/api/customer/dashboard`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data.');
  }
});

const customerDashboardSlice = createSlice({
  name: 'customerDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDashboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCustomerDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default customerDashboardSlice.reducer;  