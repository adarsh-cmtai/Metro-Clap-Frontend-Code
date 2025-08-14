import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ReportData } from '@/types';
import type { RootState } from '@/app/store/store';

interface ReportsState {
  data: ReportData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchReports = createAsyncThunk<
  ReportData,
  void,
  { state: RootState }
>('admin/fetchReports', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data } = await axios.get<ReportData>(`${backendUrl}/api/admin/reports`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports.');
  }
});

const reportsSlice = createSlice({
  name: 'adminReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<ReportData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;