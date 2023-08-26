import React from 'react';
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ProfileEvents } from '../../api/utils/interfaces';
import { formatTimeToPrettyString } from '../../helper/helper';

interface EventAttendingListProps {
  profileEvents: ProfileEvents;
}

const EventsAttendingHeader = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginBottom: '16px',
});

const EventList = styled(List)({
  overflow: 'auto',
  maxHeight: '300px',
});

const NoEventsAttending = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
});

const EventAttendingList = ({ profileEvents }: EventAttendingListProps) => {
  const { attending }: ProfileEvents = profileEvents;
  const navigate = useNavigate();
  return (
    <Grid item xs={12} md={6}>
      <EventsAttendingHeader variant="h6">
        Events Attending
      </EventsAttendingHeader>
      {attending.length > 0 ? (
        <EventList sx={{ padding: 0 }}>
          {attending.map((event) => {
            return (
              <React.Fragment key={event.eventId}>
                <ListItem
                  key={event.eventId}
                  onClick={() => navigate(`/event/${event.eventId}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText
                    primary={event.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component={'span'}
                          sx={{ display: 'block' }}
                        >
                          {formatTimeToPrettyString(event.time)}
                        </Typography>
                        {event.location}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </EventList>
      ) : (
        <NoEventsAttending>No events attending</NoEventsAttending>
      )}
    </Grid>
  );
};

export default EventAttendingList;
