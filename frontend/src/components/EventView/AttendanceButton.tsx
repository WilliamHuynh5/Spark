import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';

interface EventId {
  eventId: number;
}

const Button = styled('button')`
  background: #ffcc02;
  border-radius: 10px;
  border: solid 3px #ffcc02;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1em;
  color: #000000;
  padding: 6px 0;
  transition: all 0.1s;
  z-index: 1;
  letter-spacing: 0.8px;
  width: '10rem';
  padding: 10px 20px;
  &:hover {
    font-size: 1.2em;
    border: solid 2px #000000;
  }

  &:active {
    scale: 0.9;
  }
`;

const AttendanceButton = ({ eventId }: EventId) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const token = getAuthenticatedToken();

  const attendEvent = async () => {
    try {
      await api.event.attend(token, eventId);
      setAttending(!attending);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const unattendEvent = async () => {
    try {
      await api.event.unattend(token, eventId);
      setAttending(!attending);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const [attending, setAttending] = useState(false);

  useEffect(() => {
    const fetchAttendingStatus = async () => {
      if (isGuest(token)) {
        setAttending(false);
        return;
      }
      try {
        // Fetch the attending status from the server
        const response = await api.event.status(token, eventId);
        // Update the attending state based on the response
        setAttending(response.attending);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };
    fetchAttendingStatus();
  }, [token, eventId]);

  const handleClick = () => {
    if (attending) {
      unattendEvent();
    } else {
      attendEvent();
    }
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>
        {attending ? '✅ Attending' : '❌ Attending'}
      </Button>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default AttendanceButton;
