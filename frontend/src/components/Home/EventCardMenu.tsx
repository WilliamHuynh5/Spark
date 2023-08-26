import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';

/**
 * Props for the EventCardMenu component.
 */
interface EventCardMenuProps {
  /**
   * The unique identifier of the event associated with the menu.
   */
  eventId: number;
}

/**
 * StyledMenu component extending the MUI Menu component and customizing its appearance.
 */
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

/**
 * A component that displays a menu for an event card with options like Edit Post.
 */
export default function EventCardMenu({ eventId }: EventCardMenuProps) {
  const token = getAuthenticatedToken();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const getPerms = async () => {
      if (isGuest(token)) {
        return;
      }
      const numSocietyId = (await api.event.get(eventId)).societyId;
      const isSiteAdmin = (await api.profile.view(token)).isSiteAdmin;
      const userDetails = await api.profile.view(token);
      const isModerator = userDetails.modSocieties.find(
        (sid) => sid === numSocietyId,
      );
      const isSocAdmin = userDetails.adminSocieties.find(
        (sid) => sid === numSocietyId,
      );
      if (isSiteAdmin || isModerator || isSocAdmin) {
        setCanEdit(true);
      }
    };
    getPerms();
  }, [eventId, token]);

  /**
   * Handles the click event of the menu button.
   * @param {React.MouseEvent<HTMLElement>} event - The click event.
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles the click event for the "Edit Post" menu item and navigates to the edit post page.
   */
  const handleEditPost = () => {
    handleClose();
    navigate(`/event/${eventId}/edit`);
  };

  return (
    <Box>
      {canEdit && (
        <IconButton
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          component="span"
        >
          <MoreVert />
        </IconButton>
      )}
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEditPost} disableRipple>
          <EditIcon />
          Edit Post
        </MenuItem>
      </StyledMenu>
    </Box>
  );
}
