'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { UpdateUserModal, UpdateButton } from '@/components/molecules';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchUsers, logout } from '@/store/reducers';
import { useRouter } from 'next/navigation';
import type { User } from '@ebuddy/shared';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{ height: 'fit-content' }}
        >
          Logout
        </Button>
      </Box>

      {loading && (
        <Typography textAlign="center">Loading users...</Typography>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {user.email}
                </Typography>
                <UpdateButton
                  user={user}
                  onUpdateClick={handleUpdateClick}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}