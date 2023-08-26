import Button from '@mui/joy/Button';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Button
        sx={{ backgroundColor: '#ffcc02', fontSize: '1rem', width: '100%' }}
        onClick={() => navigate('/home')}
      >
        <HomeIcon sx={{ marginRight: '0.3rem' }}></HomeIcon>
        home
      </Button>
    </React.Fragment>
  );
};

export default HomeButton;
