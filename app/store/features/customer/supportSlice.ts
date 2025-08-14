import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomerBooking } from '@/types';
import type { RootState } from '@/app/store/store';

interface SupportState {
    recentBookings: CustomerBooking[];
    bookingsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    ticketStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SupportState = {
    recentBookings: [],
    bookingsStatus: 'idle',
    ticketStatus: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchRecentBookings = createAsyncThunk<
    CustomerBooking[],
    void,
    { state: RootState }
>('customerSupport/fetchRecentBookings', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/customer/recent-bookings`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent bookings');
    }
});

interface TicketPayload { topic: string; message: string; }

export const submitSupportTicket = createAsyncThunk<
    any,
    TicketPayload,
    { state: RootState }
>('customerSupport/submitSupportTicket', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/customer/support-tickets`, payload, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to submit ticket');
    }
});

const supportSlice = createSlice({
    name: 'customerSupport',
    initialState,
    reducers: {
        resetTicketStatus: (state) => {
            state.ticketStatus = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentBookings.pending, (state) => {
                state.bookingsStatus = 'loading';
            })
            .addCase(fetchRecentBookings.fulfilled, (state, action: PayloadAction<CustomerBooking[]>) => {
                state.bookingsStatus = 'succeeded';
                state.recentBookings = action.payload;
            })
            .addCase(fetchRecentBookings.rejected, (state, action) => {
                state.bookingsStatus = 'failed';
                state.error = action.payload as string;
            })
            .addCase(submitSupportTicket.pending, (state) => {
                state.ticketStatus = 'loading';
                state.error = null;
            })
            .addCase(submitSupportTicket.fulfilled, (state) => {
                state.ticketStatus = 'succeeded';
            })
            .addCase(submitSupportTicket.rejected, (state, action) => {
                state.ticketStatus = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetTicketStatus } = supportSlice.actions;
export default supportSlice.reducer;