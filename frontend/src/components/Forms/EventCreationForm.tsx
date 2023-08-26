import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Button from '../Common/Button';
import api from '../../api';
import EventNameField from '../Fields/EventNameField';
import EventTimeField from '../Fields/EventTimeField';
import EventDescriptionField from '../Fields/EventDescriptionField';
import EventLocationField from '../Fields/EventLocationField';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import EventTitle from '../Common/EventTitle';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';

interface EventProps {
  societyId: number;
}

/**
 * EventCreationForm component allows users to create an event for a specific society.
 * It renders a form with fields for event name, time, description, location, and a submit button.
 * The form data is sent to the server using the 'api.event.create' method upon submission.
 *
 * @param {EventProps} props - Props containing the 'societyId' to which the event belongs.
 * @returns {JSX.Element} - The JSX element representing the EventCreationForm component.
 */
const EventCreationForm = ({ societyId }: EventProps) => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const token = getAuthenticatedToken();
  if (isGuest(token)) navigate('/home');

  /**
   * Handles the form submission.
   * Sends the form data to the server to create the event using the 'api.event.create' method.
   * If successful, navigates to the home page.
   * If an error occurs, creates an error popup.
   */
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.event.create(
        token,
        societyId,
        eventName,
        eventDescription,
        eventTime.toString(),
        eventLocation,
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
      <EventTitle>Create an Event 🎉</EventTitle>
      <form onSubmit={handleFormSubmit}>
        <EventNameField
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <EventTimeField
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
        <EventDescriptionField
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        <EventLocationField
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />
        <Button type="submit" sx={{ mt: '1rem' }}>
          Create Event
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

export default EventCreationForm;
