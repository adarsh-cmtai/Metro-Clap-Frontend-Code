import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Booking } from '@/types';
import type { RootState } from '@/app/store/store';
import toast from 'react-hot-toast';

interface BookingsState {
  bookings: Booking[];
  singleBooking: Booking | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  singleBooking: null,
  status: 'idle',
  error: null,
};

interface FetchParams {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchBookings = createAsyncThunk<
  Booking[],
  FetchParams,
  { state: RootState }
>('admin/fetchBookings', async (params, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const config = { 
        headers: { Authorization: `Bearer ${token}` },
        params
    };
    const { data } = await axios.get<Booking[]>(`${backendUrl}/api/admin/bookings`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings.');
  }
});

export const fetchBookingDetails = createAsyncThunk<Booking, string, { state: RootState }>(
    'adminBookings/fetchDetails',
    async (id, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${backendUrl}/api/admin/bookings/${id}`, config);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking details');
        }
    }
);

export const broadcastBooking = createAsyncThunk<Booking, string, { state: RootState }>(
    'adminBookings/broadcast',
    async (id, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(`${backendUrl}/api/admin/bookings/${id}/broadcast`, {}, config);
            toast.success(data.message || 'Booking broadcasted successfully!');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to broadcast booking.');
            return rejectWithValue(error.response?.data?.message || 'Failed to broadcast booking');
        }
    }
);

export const assignPartnerToItem = createAsyncThunk<
    Booking,
    { bookingId: string; itemId: string; partnerId: string },
    { state: RootState }
>('adminBookings/assignPartnerToItem', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const { bookingId, itemId, partnerId } = payload;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`${backendUrl}/api/admin/bookings/${bookingId}/items/${itemId}/assign`, { partnerId }, config);
        toast.success('Partner assigned successfully!');
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to assign partner.');
        return rejectWithValue(error.response?.data?.message || 'Failed to assign partner');
    }
});

export const initiatePayout = createAsyncThunk<
    Booking,
    { bookingId: string; itemId: string },
    { state: RootState }
>('adminBookings/initiatePayout', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/admin/payouts/initiate`, payload, config);
        toast.success('Payout successful!');
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Payout failed.');
        return rejectWithValue(error.response?.data?.message || 'Payout failed.');
    }
});

const bookingsSlice = createSlice({
  name: 'adminBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBookingDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.singleBooking = action.payload;
      })
      .addCase(fetchBookingDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(broadcastBooking.fulfilled, (state, action) => {
          if (state.singleBooking) {
              state.singleBooking.status = 'Searching';
          }
      })
      .addCase(assignPartnerToItem.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.status = 'succeeded';
        state.singleBooking = action.payload;
      })
      .addCase(initiatePayout.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.status = 'succeeded';
        state.singleBooking = action.payload;
      });
  },
});

export default bookingsSlice.reducer;