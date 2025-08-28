import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Location } from '@/app/services/components/types';
import api from '@/lib/api';

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: LocationState = {
  locations: [],
  selectedLocation: null,
  status: 'idle',
};

export const fetchLocations = createAsyncThunk('location/fetchLocations', async () => {
  const response = await api.get<Location[]>('/admin/locations');
  return response.data;
});

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<Location | null>) => {
      state.selectedLocation = action.payload;
      if (typeof window !== 'undefined') {
        if(action.payload) {
          localStorage.setItem('selectedLocation', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('selectedLocation');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setSelectedLocation } = locationSlice.actions;
export default locationSlice.reducer;
