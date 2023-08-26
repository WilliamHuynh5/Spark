import React from 'react';
import { TextField } from '@mui/material';

/**
 * Props for the EventLocationField component.
 */
interface EventLocationFieldProps {
  /**
   * The current value of the event location field.
   */
  value: string;
  /**
   * Callback function that handles changes to the event location field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * EventLocationField component represents a text field for entering the location of an event.
 * It takes a value and onChange function as props to control the input state.
 *
 * @param {EventLocationFieldProps} props - The props for the component.
 * @param {string} props.value - The current value of the event location field.
 * @param {Function} props.onChange - Callback function that handles changes to the event location field.
 * @returns {JSX.Element} - The JSX element representing the EventLocationField component.
 */
const EventLocationField = ({ value, onChange }: EventLocationFieldProps) => {
  return (
    <TextField
      name="location"
      label="Location"
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
};

export default EventLocationField;
