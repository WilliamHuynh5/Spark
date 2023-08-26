import { styled } from '@mui/material';
import { Button } from '@mui/joy';
import TopicIcon from '@mui/icons-material/Topic';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#ffcc02',
  width: '100%',
  fontSize: '1.1rem',
}));

const ViewSocApplicationsButton = () => {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate('/applications/review')}>
      <TopicIcon sx={{ marginRight: '0.3rem' }}></TopicIcon>
      applications
    </StyledButton>
  );
};

export default ViewSocApplicationsButton;
