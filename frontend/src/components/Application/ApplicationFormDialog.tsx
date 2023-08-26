import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Application } from '../../api/utils/interfaces';
import ApplicationDialog from './ApplicationDialog';

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#ffcc02',
  color: theme.palette.common.black,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
}

const NoApplicationDialog: React.FC<{ onClose: () => void }> = () => {
  const errorMessage = 'No application found.';
  return <Typography variant="body1">{errorMessage}</Typography>;
};

const ApplicationFormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  application,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitleStyled>
        Application
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitleStyled>
      <DialogContent
        sx={{
          backgroundColor: 'white',
          padding: '1.5rem',
        }}
      >
        {application ? (
          <ApplicationDialog application={application} onClose={onClose} />
        ) : (
          <NoApplicationDialog onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationFormDialog;
