import React, { ReactNode } from 'react';
import { Box, SxProps } from '@mui/system';
import LoginForm from '../components/Auth/LoginForm';
import FunniWave from '../components/FunniWave/FunniWave';

interface StyledBoxProps {
  children: ReactNode;
  sx?: SxProps;
}

const StyledBox = ({ children, sx }: StyledBoxProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...sx,
    }}
  >
    {children}
  </Box>
);

const LoginPage = () => {
  return (
    <React.Fragment>
      <StyledBox sx={{ paddingBottom: '64px', marginTop: '12rem' }}>
        <LoginForm />
      </StyledBox>

      <FunniWave />
    </React.Fragment>
  );
};

export default LoginPage;
