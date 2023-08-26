import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const EditButtonContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '12px',
  marginBottom: '24px',
});

const EditButton = () => {
  const navigate = useNavigate();

  return (
    <EditButtonContainer item xs={6}>
      <Button onClick={() => navigate('/profile/edit')} variant="contained">
        <EditIcon />
        Edit Profile
      </Button>
    </EditButtonContainer>
  );
};

export default EditButton;
