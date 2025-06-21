import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { setMessage } from './uiSlice';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.register(username, email, password);
      dispatch(setMessage({ type: 'success', text: 'Registration successful! Please login.' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      dispatch(setMessage({ type: 'error', text: message }));
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authService.logout();
    dispatch(setMessage({ type: 'info', text: 'You have been logged out.' }));
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue('Session expired');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
