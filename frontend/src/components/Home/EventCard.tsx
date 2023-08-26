import { styled } from '@mui/system';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import EventCardMenu from './EventCardMenu';

/**
 * Interface for the EventCard component props.
 */
interface EventCardInterface {
  /**
   * The unique identifier of the event.
   */
  eventId: number;
  /**
   * The unique identifier of the society associated with the event.
   */
  societyId: number;
  /**
   * The title of the event.
   */
  title: string;
  /**
   * The time of the event.
   */
  time: string;
  /**
   * The location of the event.
   */
  location: string;
  /**
   * The description of the event.
   */
  description: string;
  /**
   * The URL of the event banner image.
   */
  eventBanner: string;
  /**
   * The URL of the society's profile picture.
   */
  societyProfilePicture: string;
}

/**
 * Custom styled Avatar component with additional styles.
 */
const StyledAvatar = styled(Avatar)(() => ({
  bgcolor: 'green',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

/**
 * A component that displays an event card with its details.
 * @param eventId - The unique identifier of the event.
 * @param societyId - The unique identifier of the society associated with the event.
 * @param title - The title of the event.
 * @param time - The time of the event.
 * @param location - The location of the event.
 * @param description - The description of the event.
 * @param eventBanner - The URL of the event banner image.
 * @param societyProfilePicture - The URL of the society's profile picture.
 * @returns A component displaying an event card with its details.
 */
const EventCard = ({
  eventId,
  societyId,
  title,
  time,
  location,
  description,
  societyProfilePicture,
}: EventCardInterface) => {
  const navigate = useNavigate();

  /**
   * Handles the click event of the society's profile picture.
   * Navigates to the society's page.
   */
  const handleSocietyClick = () => {
    navigate(`/society/${societyId}`);
  };

  /**
   * Handles the click event of the event card.
   * Navigates to the event's page.
   */
  const handleEventClick = () => {
    navigate(`/event/${eventId}`);
  };

  return (
    <Card
      sx={{
        minWidth: '600px',
        maxWidth: '30vw',
        ml: 'auto',
        mr: 'auto',
        mb: '3rem',
        '@media (max-width: 600px)': {
          minWidth: '100%',
          maxWidth: '100%',
        },
      }}
    >
      <CardHeader
        avatar={
          <StyledAvatar
            src={societyProfilePicture}
            onClick={handleSocietyClick}
          />
        }
        action={
          <IconButton component="span">
            <EventCardMenu eventId={eventId} />
          </IconButton>
        }
        titleTypographyProps={{
          variant: 'h5',
          sx: { fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' },
          onClick: handleEventClick,
        }}
        title={title}
        subheader={`${time} @ ${location}`}
      />
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography>{description}</Typography>
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
};

export default EventCard;
