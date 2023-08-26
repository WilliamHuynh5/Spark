import { Button, Grid, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from 'react';
import { BACKEND_HOST, BACKEND_PORT } from '../../config.json';

interface CopyWebcalButtonProps {
  webcal: string;
}

const CopyWebcalButtonContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '12px',
  marginBottom: '24px',
});

const CopyWebcalButton = ({ webcal }: CopyWebcalButtonProps) => {
  const [open, setOpen] = React.useState<boolean | undefined>(false);
  const vertical = 'bottom';
  const horizontal = 'left';
  const copyLink =
    `${
      BACKEND_HOST === 'localhost' ? 'http' : 'https'
    }://${BACKEND_HOST}:${BACKEND_PORT}` + webcal;

  const handleCopyWebcal = () => {
    setOpen(true);
    navigator.clipboard.writeText(copyLink);
  };

  return (
    <React.Fragment>
      <CopyWebcalButtonContainer item xs={6}>
        <Button onClick={() => handleCopyWebcal()} variant="contained">
          <ContentCopyIcon />
          Copy Ical Link
        </Button>
      </CopyWebcalButtonContainer>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={1000}
        anchorOrigin={{ vertical, horizontal }}
        message="Copied to clipboard"
      />
    </React.Fragment>
  );
};

export default CopyWebcalButton;
