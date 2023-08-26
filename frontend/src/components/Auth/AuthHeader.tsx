import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material';

const StyledToolBar = styled(Toolbar)`
  background-color: #ffcc02;
`;

/**
 * Header for the auth pages; login, register, forget.
 *
 * @returns {JSX.Element} of header
 */
const AuthHeader = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <StyledToolBar></StyledToolBar>
      </AppBar>
    </Box>
  );
};

export default AuthHeader;
