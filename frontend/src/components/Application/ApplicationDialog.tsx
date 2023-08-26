import React from 'react';
import { TextField, Button, styled, FormControl } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import { Application } from '../../api/utils/interfaces';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';

const FormFieldContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const NameField = styled(TextField)(({ theme }) => ({
  width: '80%',
  marginRight: theme.spacing(2),
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

const ApplicationDialog: React.FC<{
  application: Application;
  onClose: () => void;
}> = ({ application, onClose }) => {
  const navigate = useNavigate();
  const authUserToken = getAuthenticatedToken();
  if (isGuest(authUserToken)) {
    navigate('/auth/login');
  }
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  const handleDeny = async () => {
    try {
      await api.admin.application.deny(
        authUserToken,
        application.applicationId
      );
      window.location.reload();
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
    onClose();
  };

  const handleApprove = async () => {
    try {
      (
        await api.admin.application.approve(
          authUserToken,
          application.applicationId
        )
      ).societyId;
      window.location.reload();
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
    onClose();
  };

  return (
    <React.Fragment>
      <FormControl sx={{ width: '100%' }}>
        <FormFieldContainer>
          <NameField label="Name" fullWidth value={application.name} disabled />
          <TextField
            sx={{ width: '20%' }}
            label="Status"
            fullWidth
            value={application.status}
            disabled
          />
        </FormFieldContainer>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={10}
          value={application.description}
          disabled
          margin="normal"
        />
        <ButtonContainer>
          <Button
            sx={{ color: 'white' }}
            type="button"
            color="error"
            variant="contained"
            startIcon={<CancelIcon />}
            onClick={handleDeny}
          >
            Deny
          </Button>
          <Button
            sx={{ color: 'white' }}
            type="button"
            color="success"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleApprove}
          >
            Approve
          </Button>
        </ButtonContainer>
      </FormControl>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ApplicationDialog;
