import React from 'react';
import { Box } from '@mui/material';
import RegisterForm from '../components/Auth/RegisterForm';
import FunniWave from '../components/FunniWave/FunniWave';

const LoginPage = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '64px', // Adjust the padding to match the FunniWave height
          marginTop: '9rem', // Adjust the margin to match the header height
        }}
      >
        <RegisterForm />
      </Box>
      <FunniWave />
    </React.Fragment>
  );
};

export default LoginPage;
