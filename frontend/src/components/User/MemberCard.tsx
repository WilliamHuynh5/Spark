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
import { SocietyPermission, MemberToDisplay } from '../../types/user';

interface UserCardProps {
  user: MemberToDisplay;
  isSocietyAdmin: boolean;
  onChangePermission: (
    event: SelectChangeEvent<SocietyPermission>,
    userId: number,
  ) => void;
  onResetPermission: (userId: number) => void;
  onSavePermission: (userId: number) => void;
}

const MemberCard: React.FC<UserCardProps> = ({
  user,
  isSocietyAdmin,
  onChangePermission,
  onResetPermission,
  onSavePermission,
}) => {
  return (
    <Card key={user.userId} style={{ marginBottom: '1rem' }}>
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
          </Box>
          <Box>
            {isSocietyAdmin ? (
              <Typography variant="h5" align="justify">
                {user.permissions}
              </Typography>
            ) : (
              <FormControl>
                <InputLabel id={`permission-label-${user.userId}`}>
                  Permission
                </InputLabel>
                <Select
                  labelId={`permission-label-${user.userId}`}
                  label="permission"
                  value={user.permissions}
                  onChange={(event) => onChangePermission(event, user.userId)}
                  sx={{
                    width: '190px',
                    marginBottom: '0.5rem',
                    height: '3rem',
                  }}
                >
                  <MenuItem value={SocietyPermission.ADMIN}>
                    Administrator
                  </MenuItem>
                  <MenuItem value={SocietyPermission.MODERATOR}>
                    Moderator
                  </MenuItem>
                  <MenuItem value={SocietyPermission.MEMBER}>Member</MenuItem>
                </Select>
              </FormControl>
            )}
            {!isSocietyAdmin && (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  onClick={() => onResetPermission(user.userId)}
                  startIcon={<ReplayIcon />}
                  style={{ color: 'red' }}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => onSavePermission(user.userId)}
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  style={{ color: 'blue' }}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
