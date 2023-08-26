import React from 'react';
import Snackbar from '@mui/material/Snackbar';

interface ErrorPopupProps {
  errorMessage: string;
  closeError: () => unknown;
}

const ErrorPopup = ({ errorMessage, closeError }: ErrorPopupProps) => {
  const [open, setOpen] = React.useState(true);
  const vertical = 'top';
  const horizontal = 'center';

  const handleClose = () => {
    setOpen(false);
    closeError();
  };

  return (
    <Snackbar
      open={open}
      onClose={() => handleClose()}
      autoHideDuration={3000}
      anchorOrigin={{ vertical, horizontal }}
      message={errorMessage}
    />
  );
};

export default ErrorPopup;
