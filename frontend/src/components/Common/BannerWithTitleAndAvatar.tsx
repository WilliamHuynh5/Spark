import { Avatar, Box } from '@mui/material';
import React from 'react';
import Banner from './Banner';

interface EventBannerProps {
  backgroundImageSrc: string;
  avatarSrc: string;
  title: string;
}

const BannerWithTitleAndAvatar = ({
  backgroundImageSrc,
  avatarSrc,
  title,
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
          left: '50%',
          right: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Avatar
          src={avatarSrc}
          sx={{
            width: '10rem',
            height: '10rem',
            marginTop: '4rem',
            marginBottom: '1rem',
          }}
        ></Avatar>
        <Box sx={{ marginTop: '-2.5rem' }}>
          <h1>{title}</h1>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default BannerWithTitleAndAvatar;
