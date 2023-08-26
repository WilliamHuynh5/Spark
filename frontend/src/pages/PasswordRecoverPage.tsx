import React from 'react';
import { Box } from '@mui/material';
import FunniWave from '../components/FunniWave/FunniWave';
import RecoverForm from '../components/Auth/RecoverForm';

const PasswordRecoverPage = () => {
  return (
    <React.Fragment>
      <Box>
        <RecoverForm></RecoverForm>
      </Box>
      <FunniWave></FunniWave>
    </React.Fragment>
  );
};

export default PasswordRecoverPage;
