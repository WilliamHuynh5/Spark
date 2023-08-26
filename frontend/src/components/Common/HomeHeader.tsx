import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material';
import ProfileMenu from '../Home/ProfileMenu';
import HomeMenu from '../Home/HomeMenu';

const StyledToolBar = styled(Toolbar)`
  background-color: #ffcc02;
  display: flex;
  justify-content: space-between;
`;

interface HomeHeaderProps {
  searchBar?: React.ReactNode;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ searchBar }) => {
  return (
    <React.Fragment>
      <AppBar>
        <StyledToolBar>
          <Box>
            <HomeMenu></HomeMenu>
          </Box>
          <Box sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
            {searchBar !== undefined && searchBar}
          </Box>
          <Box>
            <ProfileMenu></ProfileMenu>
          </Box>
        </StyledToolBar>
      </AppBar>
      <Box sx={{ marginBottom: '4.05rem' }}></Box>
    </React.Fragment>
  );
};

export default HomeHeader;
