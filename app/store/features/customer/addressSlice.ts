// --- START OF FILE app/store/features/customer/addressSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Address } from '@/types';
import type { RootState } from '@/app/store/store';

// This is the data structure for adding/updating an address.
export interface AddressFormData {
    _id?: string;
    type: 'Home' | 'Office' | 'Other';
    line1: string;
    line2: string;
    city: string;
    pincode: string;
}

// Define the state structure for this slice
interface AddressState {
  addresses: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AddressState = {
  addresses: [],
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Async thunk for fetching addresses
export const fetchMyAddresses = createAsyncThunk<
  Address[],
  void,
  { state: RootState }
>('customerAddresses/fetchMyAddresses', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/customer/addresses`, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
});

// Async thunk for adding a new address
export const addMyAddress = createAsyncThunk<
  Address,
  AddressFormData,
  { state: RootState }
>('customerAddresses/addMyAddress', async (addressData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/customer/addresses`, addressData, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
});

// Async thunk for updating an address
export const updateMyAddress = createAsyncThunk<
  Address,
  AddressFormData,
  { state: RootState }
>('customerAddresses/updateMyAddress', async (addressData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`${backendUrl}/api/customer/addresses/${addressData._id}`, addressData, config);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
});

// Async thunk for deleting an address
export const deleteMyAddress = createAsyncThunk<
  string, // Returns the ID of the deleted address on success
  string, // Takes the ID of the address to delete
  { state: RootState }
>('customerAddresses/deleteMyAddress', async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${backendUrl}/api/customer/addresses/${id}`, config);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
});

// The slice definition
const addressSlice = createSlice({
  name: 'customerAddresses',
  initialState,
  reducers: {
    resetAddressStatus: (state) => {
        state.status = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetching Addresses
      .addCase(fetchMyAddresses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.status = 'succeeded';
        state.addresses = action.payload;
      })
      .addCase(fetchMyAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Adding an Address
      .addCase(addMyAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addMyAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.status = 'succeeded';
        state.addresses.push(action.payload);
      })
      .addCase(addMyAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Updating an Address
      .addCase(updateMyAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateMyAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.status = 'succeeded';
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
            state.addresses[index] = action.payload;
        }
      })
      .addCase(updateMyAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Deleting an Address
      .addCase(deleteMyAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteMyAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
      })
      .addCase(deleteMyAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetAddressStatus } = addressSlice.actions;
export default addressSlice.reducer;

// --- END OF FILE app/store/features/customer/addressSlice.ts ---