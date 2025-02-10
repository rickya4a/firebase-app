import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { User, UpdateUserDto } from '@ebuddy/shared';

type ApiErrorResponse = {
  response?: {
    data?: {
      error?: string;
    };
  };
};

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiErrorResponse;
    return apiError.response?.data?.error || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  loginStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  updateStatus: 'idle',
  loginStatus: 'idle',
};

export const login = createAsyncThunk(
  'users/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsers();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async (userData: UpdateUserDto, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(userData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.users = [];
      state.loginStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loginStatus = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.error = action.payload as string;
      })
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetUpdateStatus, logout } = userSlice.actions;
export default userSlice.reducer;