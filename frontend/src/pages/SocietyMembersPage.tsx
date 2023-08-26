import React from 'react';
import { Typography, Container } from '@mui/material';
import HomeHeader from '../components/Common/HomeHeader';
import MemberList from '../components/User/MemberList';

const SocietyMembersPage: React.FC = () => {
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
        <Typography
          variant="h2"
          color="inherit"
          align="center"
          sx={{ marginBottom: '1rem' }}
        >
          Modify Society Member Permissions 🔼
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
          align="center"
          sx={{ marginBottom: '2rem' }}
        >
          View all the members of a society. These are all users that have
          joined. As a society administrator or site admin you can also
          promote/demote other members of the society to appropriate permission
          levels.
        </Typography>
        <MemberList />
      </Container>
    </React.Fragment>
  );
};

export default SocietyMembersPage;
