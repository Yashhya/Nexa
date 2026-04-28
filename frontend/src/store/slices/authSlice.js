import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const user = localStorage.getItem('nexaUser') ? JSON.parse(localStorage.getItem('nexaUser')) : null;
const token = localStorage.getItem('nexaToken') || null;

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('nexaToken', res.data.token);
    localStorage.setItem('nexaUser', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('nexaToken', res.data.token);
    localStorage.setItem('nexaUser', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('nexaToken');
  localStorage.removeItem('nexaUser');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    localStorage.setItem('nexaUser', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data);
    localStorage.setItem('nexaUser', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, isLoading: false, error: null, isAuthenticated: !!token },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; })
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload; state.isAuthenticated = true; })
      .addCase(getMe.rejected, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; localStorage.removeItem('nexaToken'); localStorage.removeItem('nexaUser'); })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
