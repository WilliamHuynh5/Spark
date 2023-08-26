import { Avatar, Box } from '@mui/material';
import React from 'react';
import Banner from './Banner';

interface EventBannerProps {
  backgroundImageSrc: string;
  avatarSrc: string;
}

const BannerWithAvatar = ({
  backgroundImageSrc,
  avatarSrc,
}: EventBannerProps) => {
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
            bottom: '43%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <Avatar
          src={avatarSrc}
          sx={{
            width: '10rem',
            height: '10rem',
            marginBottom: '1rem',
          }}
        ></Avatar>
      </Box>
    </React.Fragment>
  );
};

export default BannerWithAvatar;
