import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import { Delete, FileDownload } from '@mui/icons-material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import { useEffect, useState } from 'react';
import ErrorPopup from '../Common/ErrorPopup';
import QRCode from 'qrcode.react';
import { ApiError } from '../../api/utils/apiTypes';
import { BACKEND_PORT, BACKEND_HOST } from '../../config.json';

/**
 * Interface representing the props for the AdminMenu component.
 */
interface EventId {
  eventId: number;
}

/**
 * StyledMenu is a customized Menu component that overrides default styles.
 * It uses the MenuProps interface from MUI.
 * @param props - The MenuProps object.
 * @returns A customized Menu component.
 */
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
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

/**
 * AdminMenu is a custom component that displays a menu for an admin user to perform actions on an event.
 * It takes the `eventId` prop to identify the event associated with the menu.
 * @param eventId - The ID of the event.
 * @returns The AdminMenu component.
 */
const AdminMenu = ({ eventId }: EventId) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [qrModalOpen, setQRModalOpen] = useState(false);

  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const open = Boolean(anchorEl);
  const token = getAuthenticatedToken();

  useEffect(() => {
    const getPerms = async () => {
      if (isGuest(token)) {
        return;
      }
      const numSocietyId = (await api.event.get(eventId)).societyId;
      const isSiteAdmin = (await api.profile.view(token)).isSiteAdmin;
      const userDetails = await api.profile.view(token);
      const isModerator = userDetails.modSocieties.find(
        (sid) => sid === numSocietyId,
      );
      const isSocAdmin = userDetails.adminSocieties.find(
        (sid) => sid === numSocietyId,
      );
      if (isSiteAdmin || isSocAdmin) {
        setCanEdit(true);
        setCanDelete(true);
      } else if (isModerator) {
        setCanEdit(true);
      }
    };
    getPerms();
  }, [eventId, token]);

  /**
   * Event handler to open the menu.
   * @param event - The mouse event that triggered the click.
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Event handler to close the menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditEvent = async () => {
    if (isGuest(token)) {
      setErrorMsg('Guest users cannot edit events');
      setShowError(true);
      return;
    }
    try {
      handleClose();
      navigate(`/event/${eventId}/edit`);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const handleQrCodeEvent = () => {
    setQRModalOpen(true);
  };

  /**
   * Event handler to navigate to the event attendance form page.
   */
  const handleAttendanceForm = async () => {
    handleClose();
    navigate(`/event/${eventId}/form`);
  };

  /**
   * Event handler to navigate to download the CSV .
   */
  const handleAttendanceData = async () => {
    try {
      await api.event.generateCSV(token, eventId);
      handleClose();
      fetch(
        `${
          BACKEND_HOST === 'localhost' ? 'http' : 'https'
        }://${BACKEND_HOST}:${BACKEND_PORT}/attendance/event-${eventId}.csv`,
      ).then((response) => {
        response.blob().then((blob) => {
          // Creating new object of CSV
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          const alink = document.createElement('a');
          alink.href = fileURL;
          alink.download = `event-${eventId}.csv`;
          alink.click();
        });
      });
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  /**
   * Event handler to delete the event.
   * It makes an API call to delete the event and then navigates to the home page.
   */
  const handleDeleteEvent = async () => {
    try {
      await api.event.remove(token, eventId);
      handleClose();
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

  /**
   * Event handler to open the delete confirmation dialog.
   */
  const handleOpenDeleteConfirmation = () => {
    if (isGuest(token)) {
      setErrorMsg('Guest users cannot delete an event.');
      setShowError(true);
      return;
    }
    setDeleteConfirmationOpen(true);
  };

  /**
   * Event handler to close the delete confirmation dialog.
   */
  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };

  /**
   * Event handler to confirm the deletion of the event.
   * It triggers the `handleDeleteEvent` function after confirmation.
   */
  const handleConfirmDelete = () => {
    handleCloseDeleteConfirmation();
    handleDeleteEvent();
  };

  const closeQRModal = () => {
    setQRModalOpen(false);
    navigate(`/event/${eventId}`);
  };

  return (
    <React.Fragment>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Event Menu
      </Button>
      <Dialog open={qrModalOpen} onClose={closeQRModal}>
        <DialogTitle>Attendance Form QR</DialogTitle>
        <DialogContent>
          <QRCode
            value={`http://localhost:5173/event/${eventId}/form`}
            size={350}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => navigate(`/event/${eventId}/qrcode`)}
            variant="contained"
            color="primary"
          >
            Open In Page
          </Button>
          <Button onClick={closeQRModal} variant="contained" color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {canEdit && (
          <MenuItem onClick={handleEditEvent} disableRipple>
            <EditIcon />
            Edit Event
          </MenuItem>
        )}

        <MenuItem onClick={handleAttendanceForm} disableRipple>
          <FileCopyIcon />
          Attendance Form
        </MenuItem>
        <MenuItem onClick={handleQrCodeEvent} disableRipple>
          <QrCode2Icon />
          QR Code
        </MenuItem>
        {canEdit && (
          <MenuItem onClick={handleAttendanceData} disableRipple>
            <FileDownload />
            Attendance Data
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        {canDelete && (
          <MenuItem
            onClick={handleOpenDeleteConfirmation}
            sx={{ color: 'red', fontWeight: 'bold' }}
            disableRipple
          >
            <Delete />
            Delete Event
          </MenuItem>
        )}
      </StyledMenu>

      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
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
    </React.Fragment>
  );
};

export default AdminMenu;
