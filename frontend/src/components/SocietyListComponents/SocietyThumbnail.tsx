import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Grid, Typography, styled } from '@mui/material';

export interface Society {
  societyId: number;
  societyName: string;
  description: string;
  photoURL: string;
}

const NoTextTransformButton = styled(Button)({
  textTransform: 'none',
  width: '100%',
});

const SocietyGridItem = styled(Grid)({
  paddingLeft: 0,
});

const SocBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const SocietyThumbnail = (society: Society) => {
  const navigate = useNavigate();
  return (
    <SocietyGridItem item xs={6} md={4} key={society.societyId}>
      <NoTextTransformButton
        type="button"
        color="primary"
        sx={{ paddingLeft: 0 }}
        onClick={() => {
          navigate(`/society/${society.societyId}`);
        }}
      >
        <SocBox>
          <Avatar
            alt={`${society.societyName} Thumbnail`}
            src={society.photoURL}
          />
          <Typography variant="subtitle1" color="text.primary">
            {society.societyName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {society.description}
          </Typography>
        </SocBox>
      </NoTextTransformButton>
    </SocietyGridItem>
  );
};

export default SocietyThumbnail;
