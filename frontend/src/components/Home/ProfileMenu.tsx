import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
  getAuthenticatedToken,
  isGuest,
  removeAuthenticatedToken,
} from '../../helper/helper';
import ErrorPopup from '../Common/ErrorPopup';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [showError, setShowError] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const token = getAuthenticatedToken();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    if (!isGuest(token)) {
      removeAuthenticatedToken();
      api.auth.logout(token);
    }
    navigate('/auth/login');
  };

  const handleProfileView = () => {
    if (!isGuest(token)) {
      navigate('/profile/view');
    } else {
      setErrorMsg('Guest accounts do not have a profile.');
      setShowError(true);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ width: '40' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} sx={{ ml: 2 }}>
            <Avatar sx={{ width: 40, height: 40, backgroundColor: 'grey' }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleProfileView()}>
          <Avatar
            sx={{
              marginRight: '0.5rem',
              width: '2rem',
              height: '2rem',
              backgroundColor: 'grey',
            }}
          />{' '}
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ProfileMenu;
