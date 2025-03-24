'use client';

import { useRef } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

type AuthCheckProps = {
  children: React.ReactNode;
};

type AuthCheckResponse = {
  message?: string;
  // Add other possible response properties here
};

const domain = '@sudents.opit.com, @faculty.opit.com, and @opit.com';

export default function AuthCheck({ children }: AuthCheckProps) {
  const { signOut } = useClerk();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthentication = async (): Promise<AuthCheckResponse> => {
    const res = await fetch('/api/auth-check');
    if (!res.ok) {
      throw new Error('You are not authorized to access this application.');
    }
    return res.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['authCheck'],
    queryFn: checkAuthentication,
    retry: false
  });

  // Handle error separately
  if (error) {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to sign out
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        signOut({ redirectUrl: '/' });
      }, 3000);
    }
  }

  // Handle user deletion case separately from errors
  const userDeleted = data?.message === 'User deleted';
  const errorMessage = error
    ? (error as Error).message
    : userDeleted
      ? `Your account has been deleted. Only Users with ${domain} email addresses are permitted.`
      : null;

  // Set timeout for user deleted case
  if (userDeleted && !timeoutRef.current) {
    timeoutRef.current = setTimeout(() => {
      signOut({ redirectUrl: '/' });
    }, 3000);
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={4}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Dialog
        open={errorMessage !== null}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', pt: 3 }}>
          <Typography
            variant="body1"
            color="error"
            gutterBottom
          >
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            href='/'
            variant="contained"
            color="primary"
          >
            Go to Home
          </Button>
        </DialogActions>
      </Dialog>
      {!errorMessage && children}
    </>
  );
}