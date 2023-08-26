import { styled } from '@mui/material';
import { Button } from '@mui/joy';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#ffcc02',
  width: '100%',
  fontSize: '1.1rem',
}));

const ViewUsersButton = () => {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate('/users')}>
      <GroupsIcon sx={{ marginRight: '0.3rem' }}></GroupsIcon>
      users
    </StyledButton>
  );
};

export default ViewUsersButton;
