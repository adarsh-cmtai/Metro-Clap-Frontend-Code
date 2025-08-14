import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { DashboardData } from '@/types';
import type { RootState } from '@/app/store/store';

interface DashboardState {
  data: DashboardData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { state: RootState }
>('admin/fetchDashboardData', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    // console.log("No token found");
    return rejectWithValue('No token found');
  }
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.get<DashboardData>(`${backendUrl}/api/admin/dashboard-stats`, config);
    // console.log("this is data",response.data);   
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;