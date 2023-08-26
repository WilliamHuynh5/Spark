import React from 'react';
import { Typography } from '@mui/material';

/**
 * Props for the EventTitle component.
 */
interface EventTitleProps {
  children: React.ReactNode;
}

/**
 * EventTitle component displays the title of an event with typography settings.
 *
 * @param {EventTitleProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed as the event title.
 * @returns {JSX.Element} - The JSX element representing the EventTitle component.
 */
const EventTitle = ({ children }: EventTitleProps) => {
  return (
    <Typography variant="h4" component="h1" align="center" gutterBottom>
      {children}
    </Typography>
  );
};

export default EventTitle;
