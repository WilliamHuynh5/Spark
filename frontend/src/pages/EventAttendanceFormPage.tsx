import React, { useEffect, useState } from 'react';
import HomeHeader from '../components/Common/HomeHeader';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { getAuthenticatedToken, getUrlParamsId } from '../helper/helper';
import EventFormHeader from '../components/EventForm/EventFormHeader';
import RequiredTextField from '../components/Fields/RequiredTextField';
import BigButton from '../components/Common/Button';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';

const FormBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '16px',
  margin: 'auto',
  maxWidth: '30%',
  '@media (max-width: 800px)': {
    maxWidth: '100%',
  },
});

/**
 * EventAttendanceFormPage is a page component that allows users to submit attendance for a specific event.
 * It displays a form with required text fields for the user's first name, last name, zId, and email.
 * @returns The EventAttendanceFormPage component.
 */
const EventAttendanceFormPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const eventIdNum = parseInt(eventId as string);
  const [eventTitle, setEventTitle] = useState('');

  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [zId, setZId] = useState('');
  const [email, setEmail] = useState('');

  const [showSuccessModal, setSuccessModal] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Load the event data and set the event title.
     */
    const loadEvent = async () => {
      try {
        const eId = getUrlParamsId(eventId, navigate);
        const event = await api.event.get(eId);
        setEventTitle(event.name);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        console.error(message);
        navigate('/home');
      }
    };

    /**
     * Get the user's profile data and set the form fields.
     */
    const getProfile = async () => {
      try {
        const userToken = getAuthenticatedToken();
        const profile = await api.profile.view(userToken);
        setNameFirst(profile.nameFirst);
        setNameLast(profile.nameLast);
        setZId(profile.zId);
        setEmail(profile.email);
      } catch (err: unknown) {
        // let message = `An unknown error has occured. Contact your system admin\n${err}`;
        // if (err instanceof ApiError) {
        //   message = err.message;
        // }
        setErrorMsg('Could not grab user profile info to prefill the form');
        setShowError(true);
      }
    };

    loadEvent();
    getProfile();
  }, [eventId, navigate]);

  /**
   * Submit the attendance form.
   */
  const submitForm = async () => {
    try {
      await api.event.form(eventIdNum, nameFirst, nameLast, zId, email);
      setSuccessModal(true);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const closeModal = () => {
    setSuccessModal(false);
    navigate(`/event/${eventId}`);
  };

  return (
    <React.Fragment>
      <HomeHeader />
      <EventFormHeader title={eventTitle} />
      {/* Popup Modal for Submission Confirmation */}
      <Dialog open={showSuccessModal} onClose={closeModal}>
        <DialogTitle>Event Attendance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The form has been successfully submitted!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <FormBox>
        <RequiredTextField
          label={'First Name'}
          value={nameFirst}
          onChange={(e) => setNameFirst(e.target.value)}
        />
        <RequiredTextField
          label={'Last Name'}
          value={nameLast}
          onChange={(e) => setNameLast(e.target.value)}
        />
        <RequiredTextField
          label={'zId'}
          value={zId}
          onChange={(e) => setZId(e.target.value)}
        />
        <RequiredTextField
          label={'Email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <BigButton
          type="submit"
          sx={{ width: '20rem', alignSelf: 'center' }}
          onClick={submitForm}
        >
          Submit
        </BigButton>
      </FormBox>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default EventAttendanceFormPage;
