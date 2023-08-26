import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import {
  Celebration,
  DeleteForever,
  Diversity1,
  Edit,
  PersonAddAlt1,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

interface SocietyMenuProps {
  societyId: number;
}

export default function SocietyMenu({ societyId }: SocietyMenuProps) {
  const token = getAuthenticatedToken();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const getPerms = async () => {
      if (isGuest(token)) {
        return;
      }
      const isSiteAdmin = (await api.profile.view(token)).isSiteAdmin;
      const userDetails = await api.profile.view(token);
      const isModerator = userDetails.modSocieties.find(
        (sid) => sid === societyId,
      );
      const isSocAdmin = userDetails.adminSocieties.find(
        (sid) => sid === societyId,
      );
      if (isSiteAdmin || isModerator || isSocAdmin) {
        setCanEdit(true);
      }
      if (isSiteAdmin || isSocAdmin) {
        setCanDelete(true);
      }
    };
    getPerms();
  }, [token, societyId]);

  const handleJoinSociety = async () => {
    if (token === null) {
      setErrorMsg('Guest user cannot join a scoiety');
      setShowError(true);
      return;
    }
    try {
      await api.society.join(token, societyId);
      setShowJoinConfirmation(true); // Show the join confirmation modal
      handleClose(); // Close the menu
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const handleDeleteSociety = async () => {
    if (token === null) {
      setErrorMsg('Guest user cannot delete a scoiety');
      setShowError(true);
      return;
    }
    try {
      await api.society.remove(token, societyId);
      setShowDeleteConfirmation(true); // Show the delete confirmation modal
      handleClose(); // Close the menu
      navigate('/home');
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false); // State to control visibility of the join confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control visibility of the delete confirmation modal
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
    handleClose();
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteConfirmation();
    await handleDeleteSociety();
  };

  const handleCloseJoinConfirmation = () => {
    setShowJoinConfirmation(false);
  };

  return (
    <Box>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        Society Menu
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleJoinSociety} disableRipple>
          <PersonAddAlt1 />
          Join Society
        </MenuItem>
        <MenuItem
          onClick={() => navigate(`/society/${societyId}/members`)}
          disableRipple
        >
          <Diversity1 />
          View Members
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {canEdit && (
          <MenuItem
            onClick={() => navigate(`/event/${societyId}/create`)}
            disableRipple
          >
            <Celebration />
            Create Event
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem
            onClick={() => navigate(`/society/${societyId}/edit`)}
            disableRipple
          >
            <Edit />
            Edit Society
          </MenuItem>
        )}

        {canDelete && (
          <MenuItem
            onClick={handleOpenDeleteConfirmation}
            sx={{ color: 'red', fontWeight: 'bold' }}
            disableRipple
          >
            <DeleteForever />
            Delete Society
          </MenuItem>
        )}
      </StyledMenu>

      {/* Popup Modal for Join Confirmation */}
      <Dialog open={showJoinConfirmation} onClose={handleCloseJoinConfirmation}>
        <DialogTitle>Join Society</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully joined the society!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseJoinConfirmation}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Modal for Delete Confirmation */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
      >
        <DialogTitle>Delete Society</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this society?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="primary"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Box>
  );
}
