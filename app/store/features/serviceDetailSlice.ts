// --- START OF FILE app/store/features/serviceDetailSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Service } from '@/types';

interface ServiceDetailState {
    service: Service | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ServiceDetailState = {
    service: null,
    status: 'idle',
    error: null,
};

export const fetchServiceBySlug = createAsyncThunk(
    'serviceDetail/fetchBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const { data } = await axios.get(`${backendUrl}/api/services/${slug}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service details');
        }
    }
);

const serviceDetailSlice = createSlice({
    name: 'serviceDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServiceBySlug.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchServiceBySlug.fulfilled, (state, action: PayloadAction<Service>) => {
                state.status = 'succeeded';
                state.service = action.payload;
            })
            .addCase(fetchServiceBySlug.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default serviceDetailSlice.reducer;

// --- END OF FILE app/store/features/serviceDetailSlice.ts ---