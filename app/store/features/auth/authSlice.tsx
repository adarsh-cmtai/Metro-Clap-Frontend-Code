import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '@/types';
import type { RootState, AppDispatch } from '@/app/store/store';
import { syncAndFetchCart } from '../cart/cartSlice';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface UpdateProfilePayload {
    name: string;
    email?: string;
    avatarUrl?: string;
    bio?: string;
    serviceablePincodes?: string;
    skills?: string[];
}

interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  if (token && userJson) {
    initialState.token = token;
    initialState.user = JSON.parse(userJson) as User;
    initialState.status = 'succeeded';
  }
}

export const fetchCurrentUser = createAsyncThunk<User, void, { state: RootState }>(
    'auth/fetchCurrentUser',
    async (_, { getState, rejectWithValue }) => {
        const { token, user } = getState().auth;
        if (!token || !user) return rejectWithValue('Not authorized');
        
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            let apiUrl = '';
            if (user.role === 'customer') {
                apiUrl = `${backendUrl}/api/customer/profile`; 
            } else if (user.role === 'partner') {
                apiUrl = `${backendUrl}/api/pro/profile`;
            } else {
                 return rejectWithValue('Invalid role for fetching profile');
            }
            const { data } = await axios.get(apiUrl, config);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async ({ mobileNumber, role }: { mobileNumber: string; role: string }, { rejectWithValue }) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.post(`${backendUrl}/api/auth/generate-otp`, { mobileNumber, role });
      return mobileNumber;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const registerPartnerOtp = createAsyncThunk(
  'auth/registerPartnerOtp',
  async ({ mobileNumber }: { mobileNumber: string }, { rejectWithValue }) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.post(`${backendUrl}/api/auth/partner/register`, { mobileNumber });
      return mobileNumber;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtpAndLogin = createAsyncThunk(
  'auth/verifyOtpAndLogin',
  async ({ mobileNumber, otp }: { mobileNumber: string; otp: string }, { dispatch, rejectWithValue }) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const { data } = await axios.post<LoginResponse>(`${backendUrl}/api/auth/verify-otp`, { mobileNumber, otp });
      if (data.token) {
        (dispatch as AppDispatch)(syncAndFetchCart());
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const updateProfile = createAsyncThunk<
  User, UpdateProfilePayload, { state: RootState }
>('auth/updateProfile', async (profileData, { getState, rejectWithValue }) => {
  const { token, user } = getState().auth;
  if (!token || !user) return rejectWithValue('Not authorized');
  
  try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      let apiUrl = '';
      if (user.role === 'customer') {
          apiUrl = `${backendUrl}/api/customer/profile`;
      } else if (user.role === 'partner') {
          apiUrl = `${backendUrl}/api/pro/profile`;
      } else {
          return rejectWithValue('Invalid user role for profile update');
      }

      const { data } = await axios.put(apiUrl, profileData, config);
      return data;
  } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
  }
});

export const updatePassword = createAsyncThunk<
  { message: string },
  UpdatePasswordPayload,
  { state: RootState }
>('auth/updatePassword', async (passwordData, { getState, rejectWithValue }) => {
  const { token, user } = getState().auth;
  if (!token || !user) return rejectWithValue('Not authorized');

  if (user.role !== 'customer') {
    return rejectWithValue('Password change is only available for customers.');
  }
  
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const apiUrl = `${backendUrl}/api/customer/profile/password`;
    
    const { data } = await axios.put(apiUrl, passwordData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update password');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerPartnerOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerPartnerOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerPartnerOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtpAndLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(verifyOtpAndLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;