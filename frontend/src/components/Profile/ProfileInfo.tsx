import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ProfileInfoProps {
  nameFirst: string;
  nameLast: string;
  email: string;
  zId: string;
}

const ProfileInfoItem = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProfileInfo = ({ nameFirst, nameLast, email, zId }: ProfileInfoProps) => {
  return (
    <Grid container spacing={2}>
      <ProfileInfoItem item xs={12}>
        {`${nameFirst} ${nameLast}`}
      </ProfileInfoItem>
      <ProfileInfoItem item xs={12}>
        {email}
      </ProfileInfoItem>
      <ProfileInfoItem item xs={12}>
        {zId}
      </ProfileInfoItem>
    </Grid>
  );
};

export default ProfileInfo;
