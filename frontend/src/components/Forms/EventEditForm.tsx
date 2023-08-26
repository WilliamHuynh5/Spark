import { useEffect, useState } from 'react';
import { TextField, Typography, Container } from '@mui/material';
import Button from '../Common/Button';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import { getAuthenticatedToken } from '../../helper/helper';

interface EventProps {
  eventIdNum: number;
}

const EventEditForm = ({ eventIdNum }: EventProps) => {
  const navigate = useNavigate();
  const token = getAuthenticatedToken();

  const [eventId, setEventId] = useState(eventIdNum);
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Retrieving event information
    const loadEvent = async () => {
      try {
        const { description, eventId, location, name, time } =
          await api.event.get(eventIdNum);
        setEventId(eventId);
        setEventName(name);
        setEventTime(time.slice(0, -1));
        setEventDescription(description);
        setEventLocation(location);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };
    loadEvent();
  }, [eventIdNum, navigate]);

  const handleFormSubmit = async () => {
    try {
      await api.event.edit(
        token,
        eventId,
        eventName,
        eventDescription,
        eventTime,
        eventLocation
      );
      navigate(`/home`);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Edit Event Details 🤠
      </Typography>
      <form>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={eventName}
          onChange={(event) => setEventName(event.target.value)}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          name="time"
          label="Time"
          type="datetime-local"
          variant="outlined"
          fullWidth
          margin="normal"
          value={eventTime}
          onChange={(event) => setEventTime(event.target.value)}
        />
        <TextField
          name="description"
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={eventDescription}
          onChange={(event) => setEventDescription(event.target.value)}
        />
        <TextField
          name="location"
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          value={eventLocation}
          onChange={(event) => setEventLocation(event.target.value)}
        />
        <Button type="button" onClick={handleFormSubmit} sx={{ mt: '1rem' }}>
          Edit Event
        </Button>
      </form>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Container>
  );
};

export default EventEditForm;
