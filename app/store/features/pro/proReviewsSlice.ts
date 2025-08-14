// --- START OF FILE app/store/features/pro/proReviewsSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProReviewsData } from '@/types';
import type { RootState } from '@/app/store/store';

interface ProReviewsState {
    data: ProReviewsData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProReviewsState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchProReviews = createAsyncThunk<
    ProReviewsData,
    void,
    { state: RootState }
>('proReviews/fetch', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/pro/reviews`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
});

const proReviewsSlice = createSlice({
    name: 'proReviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProReviews.fulfilled, (state, action: PayloadAction<ProReviewsData>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchProReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default proReviewsSlice.reducer;

// --- END OF FILE app/store/features/pro/proReviewsSlice.ts ---