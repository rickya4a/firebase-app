import { createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { UpdateUserDto } from '@ebuddy/shared';
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getAllUsers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async (userData: UpdateUserDto, { rejectWithValue }) => {
    try {
      return await userApi.updateUser(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);