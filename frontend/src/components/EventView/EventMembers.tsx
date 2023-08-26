import React from 'react';
import { Box } from '@mui/material';

const EventMembers = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '10px',
          width: '30%',
          '@media (max-width: 800px)': {
            width: '100%',
            textAlign: 'center',
          },
        }}
      >
        <Box sx={{ ml: '2rem' }}>
          <h2>Guests</h2>
          <h3>Coming Soon! (Sprint 3???)</h3>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default EventMembers;
