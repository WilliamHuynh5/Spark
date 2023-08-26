import { styled } from '@mui/system';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventCardMenu from '../Home/EventCardMenu';

interface SocietyPostCardInterface {
  eventId: number;
  title: string;
  time: string;
  location: string;
  description: string;
  societyProfilePicture: string;
}

const StyledAvatar = styled(Avatar)(() => ({
  bgcolor: 'green',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

const SocietyPostCard = ({
  eventId,
  title,
  time,
  location,
  description,
  societyProfilePicture,
}: SocietyPostCardInterface) => {
  const navigate = useNavigate();

  const handleEventClick = () => {
    navigate(`/event/${eventId}`);
  };

  return (
    <Card
      sx={{
        width: '100%',
        marginTop: '1rem',
        '@media (max-width: 800px)': {
          minWidth: '100%',
          maxWidth: '100%',
        },
      }}
    >
      <CardHeader
        avatar={<StyledAvatar src={societyProfilePicture} />}
        action={
          <IconButton>
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
    </Card>
  );
};

export default SocietyPostCard;
