import React, { useState } from 'react';
import { Box, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import api from '../../api';

/**
 * Reset form for users to reset their password.
 *
 * @returns {JSX.Element} for the reset form
 */
const ResetForm = () => {
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const postResetCode = async () => {
    await api.auth.postCode(resetCode, password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postResetCode();
    navigate('/auth/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: '12rem' }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h2>Recover Account Password 🔒</h2>
          <TextField
            label="Reset Code"
            onChange={(e) => setResetCode(e.target.value)}
            required
            variant="outlined"
            color="primary"
            sx={{ mb: 3 }}
            fullWidth
            value={resetCode}
          />
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            color="primary"
            sx={{ mb: 3 }}
            fullWidth
            type="password"
            value={password}
          />
          <Button type="submit">SUBMIT</Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetForm;
