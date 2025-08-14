import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AdminPartnerDetails } from '@/types';
import type { RootState } from '@/app/store/store';

interface State {
  details: AdminPartnerDetails | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: State = {
  details: null,
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchPartnerDetails = createAsyncThunk<AdminPartnerDetails, string, { state: RootState }>(
  'adminPartnerDetails/fetch',
  async (partnerId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${backendUrl}/api/admin/partners/${partnerId}/details`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminPartnerDetailsSlice = createSlice({
  name: 'adminPartnerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerDetails.pending, (state) => {
        state.status = 'loading';
        state.details = null;
      })
      .addCase(fetchPartnerDetails.fulfilled, (state, action: PayloadAction<AdminPartnerDetails>) => {
        state.status = 'succeeded';
        state.details = action.payload;
      })
      .addCase(fetchPartnerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default adminPartnerDetailsSlice.reducer;