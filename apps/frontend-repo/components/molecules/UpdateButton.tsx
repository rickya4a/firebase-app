'use client';

import { Button, CircularProgress } from '@mui/material';
import type { User } from '@/apis/user';
import type { SxProps, Theme } from '@mui/material/styles';

interface UpdateButtonProps {
  user: User;
  onUpdateClick: (user: User) => void;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

export const UpdateButton = ({
  user,
  onUpdateClick,
  loading = false,
  sx
}: UpdateButtonProps) => {
  return (
    <Button
      variant="contained"
      onClick={() => onUpdateClick(user)}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
      sx={sx}
    >
      {loading ? 'Updating...' : 'Update User'}
    </Button>
  );
};