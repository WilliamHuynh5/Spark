import { styled } from '@mui/material';
import { Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ConfirmationNumber } from '@mui/icons-material';

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#ffcc02',
  width: '100%',
  fontSize: '1.1rem',
}));

const ViewEventListButton = () => {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate('/event/list')}>
      <ConfirmationNumber sx={{ marginRight: '0.3rem' }}></ConfirmationNumber>
      events
    </StyledButton>
  );
};

export default ViewEventListButton;
