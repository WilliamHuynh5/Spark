import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';
import QRCode from 'qrcode.react';
import HomeHeader from '../components/Common/HomeHeader';
import api from '../api';

// Styled component for the outer container box
const Container = styled('div')(() => ({
  textAlign: 'center',
  marginTop: '5rem',
}));

// Styled component for the inner box containing the QRCode
const QRCodeBox = styled('div')(() => ({
  width: '80vw',
  margin: '0 auto',
  marginTop: '5rem',
}));

/**
 * EventQrCodePage displays a QR code representing the event attendance form.
 * It fetches the event information from the server using the provided event ID.
 * @returns {JSX.Element} JSX element representing the Event QR code page.
 */
const EventQrCodePage = () => {
  // Get the event ID from the URL parameters
  const { eventId } = useParams();
  const eventIdNum = parseInt(eventId as string);

  // Initialize the state to store the event name
  const [eventName, setEventName] = useState('');

  // React Router navigate function for redirection
  const navigate = useNavigate();

  /**
   * Fetches the event details from the server when the component mounts.
   * @returns {void}
   */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        /** @type {Event} */
        const { name } = await api.event.get(eventIdNum);
        setEventName(name);
      } catch (error: unknown) {
        console.error(error);
        navigate('/home');
      }
    };
    loadEvent();
  }, [eventIdNum, navigate]);

  return (
    <React.Fragment>
      <HomeHeader />
      <Container>
        <h1>{eventName && eventName + ' Attendance Form'}</h1>
        <QRCodeBox>
          <QRCode
            value={`http://localhost:5173/event/${eventId}/form`}
            size={700}
          />
        </QRCodeBox>
      </Container>
    </React.Fragment>
  );
};

export default EventQrCodePage;
