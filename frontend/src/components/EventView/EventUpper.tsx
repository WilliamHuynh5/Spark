import React from 'react';
import { Box, Container, styled } from '@mui/material';
import AttendanceButton from './AttendanceButton';
import EventHeader from './EventHeader';
import AdminMenu from './AdminMenu';

/**
 * Props for the EventUpper component.
 */
interface EventUpperProps {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

/**
 * Styled container for the EventUpper component.
 * Uses MUI's Container component with custom styles.
 */
const CustomContainer = styled(Container)({
  display: 'flex',
  '@media (max-width: 800px)': {
    flexDirection: 'column',
  },
});

/**
 * Styled box for the left side of the EventUpper component.
 * Uses MUI's Box component with custom styles.
 */
const LeftBox = styled(Box)({
  textAlign: 'left',
  '@media (max-width: 800px)': {
    textAlign: 'center',
  },
});

/**
 * Styled box for the right side of the EventUpper component.
 * Uses MUI's Box component with custom styles.
 */
const RightBox = styled(Box)({
  marginTop: '3rem',
  marginLeft: 'auto',
  '@media (max-width: 800px)': {
    marginTop: '1rem',
    marginRight: 'auto',
  },
});

/**
 * EventUpper component displays the header, attendance button, and admin menu in a custom layout.
 * The layout changes to a column when the screen width is 800px or less.
 *
 * @param {EventUpperProps} props - The props for the component.
 * @param {number} props.eventId - The ID of the event.
 * @param {string} props.eventTitle - The title of the event.
 * @param {string} props.eventDate - The date of the event.
 * @param {string} props.eventLocation - The location of the event.
 * @returns {JSX.Element} - The JSX element representing the EventUpper component.
 */
const EventUpper = ({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
}: EventUpperProps) => {
  return (
    <React.Fragment>
      <CustomContainer>
        <LeftBox>
          <EventHeader
            title={eventTitle}
            date={eventDate}
            location={eventLocation}
          />
          <AttendanceButton eventId={eventId} />
        </LeftBox>
        <RightBox>
          <AdminMenu eventId={eventId} />
        </RightBox>
      </CustomContainer>
    </React.Fragment>
  );
};

export default EventUpper;
