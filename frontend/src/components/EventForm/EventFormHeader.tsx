import { Box } from '@mui/material';
import React from 'react';
import Banner from '../Common/Banner';
import { eventBanner } from '../Common/Pictures';

/**
 * Interface representing the props for the EventFormHeader component.
 */
interface EventTitle {
  title: string;
}

/**
 * EventFormHeader is a custom header component for event forms.
 * It displays a banner and the event title along with "Attendance Form" heading.
 * @param title - The title of the event.
 * @returns The EventFormHeader component.
 */
const EventFormHeader = ({ title }: EventTitle) => {
  return (
    <React.Fragment>
      <Banner
        backgroundImageSrc={eventBanner}
        height={150}
        width={'30%'}
      ></Banner>
      <Box
        sx={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
      >
        <h1>{title}</h1>
        <h2>Attendance Form</h2>
      </Box>
    </React.Fragment>
  );
};

export default EventFormHeader;
