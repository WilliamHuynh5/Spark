import React from 'react';
import SocietyApplicationForm from '../components/Forms/SocietyApplicationForm';
import HomeHeader from '../components/Common/HomeHeader';
import { Box } from '@mui/material';

const ApplySocietyPage = () => {
  return (
    <React.Fragment>
      <HomeHeader />
      <Box
        sx={{
          display: 'flex',
          placeItems: 'center',
          minHeight: '90vh',
        }}
      >
        <SocietyApplicationForm />
      </Box>
    </React.Fragment>
  );
};

export default ApplySocietyPage;
