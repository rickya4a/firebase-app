'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/reducers';
import type { AppDispatch } from '@/store/store';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch(logout());
        router.push('/');
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          dispatch(logout());
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        dispatch(logout());
        router.push('/');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, dispatch]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};