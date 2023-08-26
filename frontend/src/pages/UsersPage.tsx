import React from 'react';
import { Typography, Container } from '@mui/material';
import HomeHeader from '../components/Common/HomeHeader';
import UserList from '../components/User/UserList';

const UsersPage: React.FC = () => {
  return (
    <React.Fragment>
      <HomeHeader />
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '8rem',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h2" color="inherit" sx={{ marginBottom: '1rem' }}>
          Modify User Permissions 💪
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
          align="justify"
          sx={{ marginBottom: '2rem' }}
        >
          Promote/demote other users of the application to "Site Admin" level
          permissions.
        </Typography>
        <UserList />
      </Container>
    </React.Fragment>
  );
};

export default UsersPage;
