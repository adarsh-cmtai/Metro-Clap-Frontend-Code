import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProAssignedJob } from '@/types';
import type { RootState, AppDispatch } from '@/app/store/store';
import { fetchProDashboard } from './proDashboardSlice';
import toast from 'react-hot-toast';

interface ProBookingsState {
  bookings: ProAssignedJob[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProBookingsState = {
  bookings: [],
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ThunkApiConfig {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}

export const fetchProBookings = createAsyncThunk<
  ProAssignedJob[],
  void,
  { state: RootState }
>('proBookings/fetch', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${backendUrl}/api/pro/bookings`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings.');
  }
});

export const acceptJobItem = createAsyncThunk<
    { bookingId: string }, 
    { bookingId: string, itemId: string }, 
    ThunkApiConfig
>('proBookings/accept', 
    async ({ bookingId, itemId }, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${backendUrl}/api/pro/bookings/${bookingId}/items/${itemId}/accept`, {}, config);
        toast.success('Job accepted!');
        dispatch(fetchProDashboard());
        dispatch(fetchProBookings());
        return { bookingId };
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to accept job.');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const confirmAssignment = createAsyncThunk<
    { itemId: string },
    { bookingId: string; itemId: string },
    ThunkApiConfig
>('proBookings/confirm', async (payload, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${backendUrl}/api/pro/bookings/${payload.bookingId}/items/${payload.itemId}/confirm`, {}, config);
        toast.success('Assignment confirmed!');
        dispatch(fetchProBookings());
        return { itemId: payload.itemId };
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to confirm assignment.');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const declineAssignment = createAsyncThunk<
    { itemId: string },
    { bookingId: string; itemId: string; reason: string },
    ThunkApiConfig
>('proBookings/decline', async (payload, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const { bookingId, itemId, reason } = payload;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${backendUrl}/api/pro/bookings/${bookingId}/items/${itemId}/decline`, { reason }, config);
        toast.success('Assignment declined.');
        dispatch(fetchProBookings());
        return { itemId: payload.itemId };
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to decline assignment.');
        return rejectWithValue(error.response?.data?.message);
    }
});


export const rejectJobRequest = createAsyncThunk<
    { bookingId: string }, 
    string, 
    ThunkApiConfig
>('proBookings/reject', 
    async (bookingId, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${backendUrl}/api/pro/bookings/${bookingId}/reject`, {}, config);
        toast.success('Job rejected.');
        dispatch(fetchProDashboard());
        return { bookingId };
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to reject job.');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const startJobWithOtp = createAsyncThunk<
    ProAssignedJob,
    { bookingId: string; itemId: string; otp: string },
    { state: RootState }
>('proBookings/startJobWithOtp', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const { bookingId, itemId, otp } = payload;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`${backendUrl}/api/pro/bookings/${bookingId}/items/${itemId}/start`, { otp }, config);
        toast.success('OTP verified! Job started.');
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to start job.');
        return rejectWithValue(error.response?.data?.message || 'Failed to start job');
    }
});

export const updateJobStatus = createAsyncThunk<
    ProAssignedJob, 
    { bookingId: string, itemId: string, status: 'CompletedByPartner' }, 
    { state: RootState }
>('proBookings/updateStatus', async (payload, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { bookingId, itemId, status } = payload;
        const { data } = await axios.put(`${backendUrl}/api/pro/bookings/${bookingId}/items/${itemId}/status`, { status }, config);
        toast.success(`Job status updated to ${status}!`);
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update job status.');
        return rejectWithValue(error.response?.data?.message);
    }
});

const proBookingsSlice = createSlice({
  name: 'proBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProBookings.fulfilled, (state, action: PayloadAction<ProAssignedJob[]>) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchProBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(startJobWithOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startJobWithOtp.fulfilled, (state, action: PayloadAction<ProAssignedJob>) => {
            state.status = 'succeeded';
            const index = state.bookings.findIndex(b => b.itemId === action.payload.itemId);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
       })
       .addCase(startJobWithOtp.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
       })
      .addCase(updateJobStatus.fulfilled, (state, action: PayloadAction<ProAssignedJob>) => {
            const index = state.bookings.findIndex(b => b.itemId === action.payload.itemId);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
       })
       .addCase(confirmAssignment.fulfilled, (state, action) => {
            const index = state.bookings.findIndex(b => b.itemId === action.payload.itemId);
            if (index !== -1) {
                state.bookings[index].status = 'Assigned';
            }
       })
       .addCase(declineAssignment.fulfilled, (state, action) => {
            state.bookings = state.bookings.filter(b => b.itemId !== action.payload.itemId);
       });
  },
});

export default proBookingsSlice.reducer;