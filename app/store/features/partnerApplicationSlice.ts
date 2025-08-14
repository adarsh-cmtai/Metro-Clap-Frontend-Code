// --- START OF FILE app/store/features/partnerApplicationSlice.ts ---

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PartnerApplicationState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PartnerApplicationState = {
    status: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const submitPartnerApplication = createAsyncThunk(
    'partnerApplication/submit',
    async (applicationData: any, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/partner-applications`, applicationData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Submission failed');
        }
    }
);

const partnerApplicationSlice = createSlice({
    name: 'partnerApplication',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitPartnerApplication.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitPartnerApplication.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(submitPartnerApplication.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default partnerApplicationSlice.reducer;

// --- END OF FILE app/store/features/partnerApplicationSlice.ts ---