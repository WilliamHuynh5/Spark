import React from 'react';
import HomeHeader from '../components/Common/HomeHeader';
import { Box } from '@mui/material';
import EventEditForm from '../components/Forms/EventEditForm';
import { useParams } from 'react-router-dom';

/**
 * The EventEditPage component displays the page for editing an event.
 * @returns JSX.Element
 */
const EventEditPage = () => {
  // Extract the eventId from the URL using the useParams hook.
  const { eventId } = useParams();
  const eventIdNum = parseInt(eventId as string);

  return (
    <React.Fragment>
      {/* Renders the common header for the home page. */}
      <HomeHeader />
      <Box
        sx={{
          display: 'flex',
          placeItems: 'center',
          minHeight: '90vh',
        }}
      >
        {/* Renders the EventEditForm component passing the eventIdNum as a prop. */}
        <EventEditForm eventIdNum={eventIdNum} />
      </Box>
    </React.Fragment>
  );
};

export default EventEditPage;
