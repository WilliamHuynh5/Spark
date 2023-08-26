import React from 'react';
import { TextField } from '@mui/material';

/**
 * Props for the EventDescriptionField component.
 */
interface EventDescriptionFieldProps {
  /**
   * The current value of the event description field.
   */
  value: string;
  /**
   * Callback function that handles changes to the event description field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * EventDescriptionField component represents a text field for entering the description of an event.
 * It takes a value and onChange function as props to control the input state.
 *
 * @param {EventDescriptionFieldProps} props - The props for the component.
 * @param {string} props.value - The current value of the event description field.
 * @param {Function} props.onChange - Callback function that handles changes to the event description field.
 * @returns {JSX.Element} - The JSX element representing the EventDescriptionField component.
 */
const EventDescriptionField = ({
  value,
  onChange,
}: EventDescriptionFieldProps) => {
  return (
    <TextField
      name="description"
      label="Description"
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
    />
  );
};

export default EventDescriptionField;
