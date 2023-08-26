import { Avatar, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface UserIconProps {
  src: string;
}

const AvatarItem = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AvatarWrapper = styled(Avatar)({
  width: '100px',
  height: '100px',
  marginRight: '16px',
});

const UserIcon = ({ src }: UserIconProps) => {
  return (
    <AvatarItem item xs={12} md={3}>
      <AvatarWrapper alt="User Avatar" src={src} />
    </AvatarItem>
  );
};

export default UserIcon;
