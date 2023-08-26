import { Avatar, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProfileSocieties } from '../../api/utils/interfaces';
import { useNavigate } from 'react-router-dom';

interface SocietiesJoinedGridProps {
  profileSocieties: ProfileSocieties;
}

const SocietyJoinedHeader = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginBottom: '16px',
});

const SocietyGrid = styled(Grid)({
  overflow: 'auto',
  maxHeight: '300px',
});

const SocietyItem = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  textAlign: 'center',
});

const SocietyBanner = styled(Avatar)({
  width: '48px',
  height: '48px',
});

const NoSocietiesContainer = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
});

const SocietiesJoinedGrid = ({
  profileSocieties,
}: SocietiesJoinedGridProps) => {
  const { societies }: ProfileSocieties = profileSocieties;
  const navigate = useNavigate();
  return (
    <Grid item xs={12} md={6}>
      <SocietyJoinedHeader variant="h6">Societies Joined</SocietyJoinedHeader>
      {societies.length > 0 ? (
        <SocietyGrid container spacing={2}>
          {societies.map((society) => {
            return (
              <SocietyItem
                item
                xs={6}
                md={4}
                onClick={() => navigate(`/society/${society.societyId}`)}
                key={society.societyId}
              >
                <SocietyBanner alt="Society Banner" src={society.photoURL} />
                {society.societyName}
              </SocietyItem>
            );
          })}
        </SocietyGrid>
      ) : (
        <NoSocietiesContainer>No societies joined</NoSocietiesContainer>
      )}
    </Grid>
  );
};

export default SocietiesJoinedGrid;
