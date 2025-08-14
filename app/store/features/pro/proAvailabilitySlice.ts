// --- START OF FILE app/store/features/pro/proAvailabilitySlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/app/store/store';

interface AvailabilityData {
    date: string;
    unavailableHours: number[];
}

interface ProAvailabilityState {
    availability: { [date: string]: number[] };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProAvailabilityState = {
    availability: {},
    status: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAvailability = createAsyncThunk<
    AvailabilityData,
    string,
    { state: RootState }
>('proAvailability/fetch', async (date, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { 
            headers: { Authorization: `Bearer ${token}` },
            params: { date } 
        };
        const { data } = await axios.get(`${backendUrl}/api/pro/availability`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
});

export const updateAvailability = createAsyncThunk<
    any,
    AvailabilityData,
    { state: RootState }
>('proAvailability/update', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/pro/availability`, payload, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update availability');
    }
});


const proAvailabilitySlice = createSlice({
    name: 'proAvailability',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailability.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAvailability.fulfilled, (state, action: PayloadAction<AvailabilityData>) => {
                state.status = 'succeeded';
                state.availability[action.payload.date] = action.payload.unavailableHours;
                state.error = null;
            })
            .addCase(fetchAvailability.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateAvailability.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAvailability.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateAvailability.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default proAvailabilitySlice.reducer;

// --- END OF FILE app/store/features/pro/proAvailabilitySlice.ts ---