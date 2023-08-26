import React from 'react';
import { Box } from '@mui/material';

const SocietyPostsHeader = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '10px',
          display: 'inline-block',
          '@media (max-width: 800px)': {
            display: 'block',
            textAlign: 'center',
          },
        }}
      >
        <Box
          sx={{
            ml: '2rem',
            mr: '2rem',
            mb: '2rem',
            '@media (max-width: 800px)': {
              mr: '0rem',
              ml: '0rem',
            },
          }}
        >
          <h2>Society Posts</h2>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default SocietyPostsHeader;
