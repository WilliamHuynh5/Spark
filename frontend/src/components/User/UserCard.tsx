import {
  SelectChangeEvent,
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Permission, PermissionLevel, UserToDisplay } from '../../types/user';

interface UserCardProps {
  user: UserToDisplay;
  onChangePermission: (
    event: SelectChangeEvent<Permission>,
    userId: number
  ) => void;
  onResetPermission: (userId: number) => void;
  onSavePermission: (userId: number, permissionLevel: PermissionLevel) => void;
  onRemoveUser: (userId: number) => void;
}

const UserCard = ({
  user,
  onChangePermission,
  onResetPermission,
  onSavePermission,
  onRemoveUser,
}: UserCardProps) => {
  const savePermission = () => {
    onSavePermission(user.id, 1);
  };

  return (
    <Card key={user.id} style={{ marginBottom: '1rem' }}>
      <CardContent>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" align="left">
              {user.name}
            </Typography>
            <Typography variant="body1" align="left">
              {user.zId}
            </Typography>
            <Typography variant="body1" align="left">
              {user.email}
            </Typography>
          </Box>
          <Box>
            <FormControl>
              <InputLabel id={`permission-label-${user.id}`}>
                Permission
              </InputLabel>
              <Select
                labelId={`permission-label-${user.id}`}
                value={user.permissions}
                label="permission"
                onChange={(event) => onChangePermission(event, user.id)}
                sx={{ width: '335px', marginBottom: '0.5rem', height: '3rem' }}
              >
                <MenuItem value={Permission.SITE_ADMIN}>Site Admin</MenuItem>
                <MenuItem value={Permission.MEMBER}>Member</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '-0.5rem' }}>
              <Button
                onClick={() => onResetPermission(user.id)}
                startIcon={<ReplayIcon />}
                style={{ color: 'red' }}
              >
                Reset
              </Button>
              <Button
                onClick={savePermission}
                startIcon={<SaveIcon />}
                variant="outlined"
                style={{ color: 'blue' }}
              >
                Save
              </Button>
              <Button
                onClick={() => onRemoveUser(user.id)}
                startIcon={<DeleteForeverIcon />}
                variant="outlined"
                color="error"
                style={{ color: 'red' }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
