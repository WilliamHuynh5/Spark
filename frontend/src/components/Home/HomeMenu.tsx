import React, { useEffect, useState } from 'react';
import { Drawer, IconButton, List, ListItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../api';
import SocietyList from './SocietyList';
import HomeButton from './HomeButton';
import CreateModal from './CreateModal';
import ViewUsersButton from './ViewUsersButton';
import ViewSocApplicationsButton from './ViewSocApplicationsButton';
import ViewEventListButton from './ViewEventListButton';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 240,
  },
}));

const HomeMenu = () => {
  const token = getAuthenticatedToken();
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    const fetchApplcations = async () => {
      if (isGuest(token)) {
        return;
      }
      try {
        const isAdmin = (await api.profile.view(token)).isSiteAdmin;
        setIsAdmin(isAdmin);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };
    fetchApplcations();
  }, [token]);

  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <MenuIcon />
      </IconButton>
      <StyledDrawer
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <List>
          <ListItem>
            <HomeButton></HomeButton>
          </ListItem>
          {!isGuest(token) && (
            <ListItem>
              <CreateModal></CreateModal>
            </ListItem>
          )}
          <ListItem>
            <SocietyList></SocietyList>
          </ListItem>
          <ListItem>
            <ViewEventListButton></ViewEventListButton>
          </ListItem>
          {isAdmin && (
            <React.Fragment>
              <ListItem>
                <ViewUsersButton></ViewUsersButton>
              </ListItem>
              <ListItem>
                <ViewSocApplicationsButton></ViewSocApplicationsButton>
              </ListItem>
            </React.Fragment>
          )}
        </List>
      </StyledDrawer>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default HomeMenu;
