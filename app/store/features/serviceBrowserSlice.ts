// --- START OF FILE app/store/features/serviceBrowserSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Category, Service } from '@/types';

export interface ServiceCategory extends Category {
    services: Service[];
}

interface ServiceBrowserState {
    categories: ServiceCategory[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ServiceBrowserState = {
    categories: [],
    status: 'idle',
    error: null,
};

export const fetchServicesForLocation = createAsyncThunk(
    'serviceBrowser/fetchByLocation',
    async (locationId: string, { rejectWithValue }) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const { data } = await axios.get(`${backendUrl}/api/services/by-category`, { params: { locationId } });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

const serviceBrowserSlice = createSlice({
    name: 'serviceBrowser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServicesForLocation.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchServicesForLocation.fulfilled, (state, action: PayloadAction<ServiceCategory[]>) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchServicesForLocation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default serviceBrowserSlice.reducer;

// --- END OF FILE app/store/features/serviceBrowserSlice.ts ---