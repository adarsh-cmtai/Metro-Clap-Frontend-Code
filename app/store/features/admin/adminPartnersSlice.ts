import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Partner } from '@/types';
import type { RootState } from '@/app/store/store';

interface AdminPartnersState {
  partners: Partner[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminPartnersState = {
  partners: [],
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAdminPartners = createAsyncThunk<
  Partner[],
  { search?: string, status?: string },
  { state: RootState }
>('adminPartners/fetch', async (params, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('Not authenticated');
  try {
    const config = { headers: { Authorization: `Bearer ${token}` }, params };
    const { data } = await axios.get(`${backendUrl}/api/admin/partners`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch partners');
  }
});

const adminPartnersSlice = createSlice({
  name: 'adminPartners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPartners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.status = 'succeeded';
        state.partners = action.payload;
      })
      .addCase(fetchAdminPartners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default adminPartnersSlice.reducer;