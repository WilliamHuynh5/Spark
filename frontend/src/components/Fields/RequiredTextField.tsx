import { FormControl, TextField } from '@mui/material';
import React from 'react';

/**
 * Interface representing the props for the RequiredTextField component.
 */
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * RequiredTextField is a custom text field component that requires user input.
 * @param label - The label for the text field.
 * @param value - The current value of the text field.
 * @param onChange - Event handler for changes to the text field value.
 * @returns The RequiredTextField component.
 */
const RequiredTextField = ({ label, value, onChange }: TextFieldProps) => {
  return (
    <FormControl>
      <TextField
        label={label}
        onChange={onChange}
        required
        variant="outlined"
        color="primary"
        type="text"
        name="name"
        value={value}
      />
    </FormControl>
  );
};

export default RequiredTextField;
