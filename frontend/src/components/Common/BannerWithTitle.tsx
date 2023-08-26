import { Box, Typography } from '@mui/material';
import React from 'react';
import Banner from './Banner';

interface EventBannerProps {
  backgroundImageSrc: string;
  title: string;
}

const BannerWithTitle = ({ backgroundImageSrc, title }: EventBannerProps) => {
  return (
    <React.Fragment>
      <Banner backgroundImageSrc={backgroundImageSrc}></Banner>
      <Box
        sx={{
          width: '100%',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          top: '43%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          '@media (max-width: 1300px)': {
            left: '20%',
          },
          '@media (max-width: 800px)': {
            left: '50%',
            right: '50%',
            top: '43%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: 'black',
            fontSize: 'clamp(1rem, 15vw, 2rem)',
            fontWeight: '700',
          }}
        >
          {title}
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default BannerWithTitle;
