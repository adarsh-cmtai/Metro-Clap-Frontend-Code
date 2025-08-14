import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/app/store/store';

interface Transaction {
    bookingId: string;
    total: number;
    commission: number;
    earning: number;
    date: string;
}

interface BankDetails {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    vpa?: string;
}

interface EarningsData {
    totalEarnings: number;
    lastPayout: number;
    nextPayout: number;
    transactions: Transaction[];
}

interface ProEarningsState {
    data: EarningsData | null;
    bankDetails: BankDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProEarningsState = {
    data: null,
    bankDetails: null,
    status: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchEarningsData = createAsyncThunk<
    EarningsData,
    void,
    { state: RootState }
>('proEarnings/fetchData', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/pro/earnings`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch earnings data');
    }
});

export const fetchBankDetails = createAsyncThunk<
    BankDetails,
    void,
    { state: RootState }
>('proEarnings/fetchBankDetails', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/pro/bank-details`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank details');
    }
});

export const updateBankDetails = createAsyncThunk<
    BankDetails,
    BankDetails,
    { state: RootState }
>('proEarnings/updateBankDetails', async (details, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/pro/bank-details`, details, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update bank details');
    }
});


const proEarningsSlice = createSlice({
    name: 'proEarnings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEarningsData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEarningsData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchEarningsData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchBankDetails.fulfilled, (state, action) => {
                state.bankDetails = action.payload;
            })
            .addCase(updateBankDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateBankDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bankDetails = action.payload;
            })
            .addCase(updateBankDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default proEarningsSlice.reducer;