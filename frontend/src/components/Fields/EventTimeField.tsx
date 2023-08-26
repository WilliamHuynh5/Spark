import React from 'react';
import { TextField } from '@mui/material';

/**
 * Props for the EventTimeField component.
 */
interface EventTimeFieldProps {
  /**
   * The current value of the event time field.
   */
  value: string;
  /**
   * Callback function that handles changes to the event time field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * EventTimeField component represents a text field for entering the time of an event.
 * It takes a value and onChange function as props to control the input state.
 * The input type is set to "datetime-local" to allow selecting a date and time.
 *
 * @param {EventTimeFieldProps} props - The props for the component.
 * @param {string} props.value - The current value of the event time field.
 * @param {Function} props.onChange - Callback function that handles changes to the event time field.
 * @returns {JSX.Element} - The JSX element representing the EventTimeField component.
 */
const EventTimeField = ({ value, onChange }: EventTimeFieldProps) => {
  return (
    <TextField
      name="time"
      label="Time"
      type="datetime-local"
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
};

export default EventTimeField;
