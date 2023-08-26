import React from 'react';
import { TextField } from '@mui/material';

/**
 * Props for the EventNameField component.
 */
interface EventNameFieldProps {
  /**
   * The current value of the event name field.
   */
  value: string;
  /**
   * Callback function that handles changes to the event name field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * EventNameField component represents a text field for entering the name of an event.
 * It takes a value and onChange function as props to control the input state.
 *
 * @param {EventNameFieldProps} props - The props for the component.
 * @param {string} props.value - The current value of the event name field.
 * @param {Function} props.onChange - Callback function that handles changes to the event name field.
 * @returns {JSX.Element} - The JSX element representing the EventNameField component.
 */
const EventNameField = ({ value, onChange }: EventNameFieldProps) => {
  return (
    <TextField
      name="name"
      label="Name"
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
};

export default EventNameField;
