import React, { useState, useEffect } from 'react';
import {
  SelectChangeEvent,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Permission,
  PermissionLevel,
  UserToDisplay,
  permissionToPermissionLevel,
} from '../../types/user';
import UserCard from './UserCard';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const authUserToken = getAuthenticatedToken();
  if (isGuest(authUserToken)) {
    navigate('/auth/login');
  }
  const users: UserToDisplay[] = [];
  const [userList, setUserList] = useState<UserToDisplay[]>(users);
  const [userToRemove, setUserToRemove] = useState<UserToDisplay | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showPermissionSaveModal, setShowPermissionSaveModal] =
    useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = (await api.admin.users(authUserToken)).users;
        const formattedUsers = users.map((u) => {
          const perm = u.isAdmin ? Permission.SITE_ADMIN : Permission.MEMBER;
          return {
            id: u.id,
            name: `${u.nameFirst} ${u.nameLast}`,
            zId: u.zId,
            email: u.email,
            permissions: perm,
            originalPermissions: perm,
          };
        });
        setUserList(formattedUsers);
      } catch (err: unknown) {
        let message = `An unknown error has occurred. Contact your system admin.\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    fetchData();
  }, [authUserToken]);

  const handleChangePermission = (
    event: SelectChangeEvent<Permission>,
    userId: number
  ) => {
    const updatedPermission = event.target.value as Permission;
    const updatedUsers: UserToDisplay[] = userList.map((user) => {
      if (user.id === userId) {
        return { ...user, permissions: updatedPermission };
      }
      return user;
    });
    setUserList(updatedUsers);
  };

  const handleResetPermission = (userId: number) => {
    const updatedUsers: UserToDisplay[] = JSON.parse(JSON.stringify(userList));
    const userToUpdate = updatedUsers.find((u) => u.id === userId);
    if (userToUpdate) {
      userToUpdate.permissions = userToUpdate.originalPermissions;
    }
    setUserList(updatedUsers);
  };

  const handleSavePermission = (userId: number) => {
    const userToChange = userList.find((u) => u.id === userId);
    if (!userToChange) {
      console.log(`Can't find user with id: ${userId}`);
    } else {
      const permissionLevel: PermissionLevel = permissionToPermissionLevel(
        userToChange.permissions
      );
      api.perm.site.allocate(authUserToken, userId, permissionLevel);
      setShowPermissionSaveModal(true);
    }
  };

  const handleRemoveUser = (userId: number) => {
    const userToChange = userList.find((u) => u.id === userId);
    if (!userToChange) {
      console.log(`Can't find user with id: ${userId}`);
    } else {
      setUserToRemove(userToChange);
      setConfirmationDialogOpen(true);
    }
  };

  const handleConfirmRemoveUser = async () => {
    if (userToRemove) {
      try {
        await api.admin.user.remove(authUserToken, userToRemove.id);

        // Update user list after successful removal
        const updatedUsers = userList.filter(
          (user) => user.id !== userToRemove.id
        );
        setUserList(updatedUsers);
      } catch (err: unknown) {
        // Handle any errors that may occur during the removal process
        let message = `An unknown error has occurred. Contact your system admin.\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    }
    setConfirmationDialogOpen(false);
  };

  const handleCancelRemoveUser = () => {
    setConfirmationDialogOpen(false);
  };

  const closePermissionSaveModal = () => {
    setShowPermissionSaveModal(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        {userList.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onChangePermission={handleChangePermission}
            onResetPermission={handleResetPermission}
            onSavePermission={handleSavePermission}
            onRemoveUser={handleRemoveUser}
          />
        ))}
      </Box>
      {/* Popup Modal for permission save confirmation */}
      <Dialog open={showPermissionSaveModal} onClose={closePermissionSaveModal}>
        <DialogTitle>Permissions Saved</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully updated the site member permissions!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closePermissionSaveModal}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCancelRemoveUser}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemoveUser} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemoveUser} color="primary" autoFocus>
            Remove
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

export default UserList;
