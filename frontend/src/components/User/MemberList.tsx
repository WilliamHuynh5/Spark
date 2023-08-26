import React, { useEffect, useState } from 'react';
import {
  SelectChangeEvent,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  SocietyPermission,
  MemberToDisplay,
  SocietyPermissionLevel,
  stringToSocietyPermission,
  societyPermissionToPermissionLevel,
} from '../../types/user';
import MemberCard from './MemberCard';
import api from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';

const MemberList: React.FC = () => {
  const navigate = useNavigate();

  const token = getAuthenticatedToken();
  const { societyId } = useParams();
  if (!societyId) {
    navigate('/auth/login');
  }
  const numSocietyId = parseInt(societyId as string);

  const [isSocietyAdmin, setIsSocietyAdmin] = useState<boolean>(false);
  const [membersList, setMembersList] = useState<MemberToDisplay[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showPermissionSaveModal, setShowPermissionSaveModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const members = (await api.society.members(numSocietyId)).members;
        const displayMembers = members.map((u) => {
          const perm = stringToSocietyPermission(u.role);
          return {
            userId: u.userId,
            name: `${u.nameFirst} ${u.nameLast}`,
            zId: u.zId,
            permissions: perm,
            originalPermissions: perm,
          };
        });
        setMembersList(displayMembers);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    const fetchPermissions = async () => {
      if (isGuest(token)) {
        setIsSocietyAdmin(true);
        return;
      }
      try {
        const userDetails = await api.profile.view(token);
        // The user is an admin of a society if they are either an:
        // - site admin
        // - society admin for this specific society
        const isAdmin =
          userDetails.isSiteAdmin ||
          userDetails.adminSocieties.find((sid) => sid === numSocietyId);
        setIsSocietyAdmin(!isAdmin);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    fetchPermissions();
    fetchData();
  }, [token, numSocietyId]);

  const handleChangePermission = (
    event: SelectChangeEvent<SocietyPermission>,
    userId: number
  ) => {
    const updatedPermission = event.target.value as SocietyPermission;
    const updatedMembers: MemberToDisplay[] = membersList.map((user) => {
      if (user.userId === userId) {
        return { ...user, permissions: updatedPermission };
      }
      return user;
    });
    setMembersList(updatedMembers);
  };

  const handleResetPermission = (userId: number) => {
    const updatedMembers: MemberToDisplay[] = JSON.parse(
      JSON.stringify(membersList)
    );
    const userToUpdate = updatedMembers.find((u) => u.userId === userId);
    if (userToUpdate) {
      userToUpdate.permissions = userToUpdate.originalPermissions;
    }
    setMembersList(updatedMembers);
  };

  const handleSavePermission = (userId: number) => {
    if (isGuest(token)) {
      console.log('Guest users cannot change user permissions.');
      return;
    }
    const userToChange = membersList.find((u) => u.userId === userId);
    if (!userToChange) {
      console.log(`Can't find user with id: ${userId}`);
    } else {
      const permissionLevel: SocietyPermissionLevel =
        societyPermissionToPermissionLevel(userToChange.permissions);
      console.log(
        `Saving permission ${permissionLevel} (${userToChange.permissions}) for user ${userId}`
      );
      api.perm.society.allocate(token, userId, numSocietyId, permissionLevel);
      setShowPermissionSaveModal(true);
    }
  };

  const closePermissionSaveModal = () => {
    setShowPermissionSaveModal(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px' }}>
      {/* Popup Modal for permission save confirmation */}
      <Dialog open={showPermissionSaveModal} onClose={closePermissionSaveModal}>
        <DialogTitle>Permissions Saved</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully updated the society member permissions!
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
      {membersList.map((user) => (
        <MemberCard
          key={user.userId}
          user={user}
          isSocietyAdmin={isSocietyAdmin}
          onChangePermission={handleChangePermission}
          onResetPermission={handleResetPermission}
          onSavePermission={handleSavePermission}
        />
      ))}
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Box>
  );
};

export default MemberList;
