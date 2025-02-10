'use client';

import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/store/reducers';
import type { AppDispatch, RootState } from '@/store/store';
import type { User, UserUpdateData } from '@/apis/user';

interface UpdateUserModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export const UpdateUserModal = ({ user, open, onClose }: UpdateUserModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateStatus, error } = useSelector((state: RootState) => state.users);
  const [formData, setFormData] = useState<UserUpdateData>({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(formData)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="update-user-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Update User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            disabled={updateStatus === 'loading'}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            disabled={updateStatus === 'loading'}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={updateStatus === 'loading'}
              startIcon={updateStatus === 'loading' ? <CircularProgress size={20} /> : null}
            >
              {updateStatus === 'loading' ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={updateStatus === 'loading'}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};