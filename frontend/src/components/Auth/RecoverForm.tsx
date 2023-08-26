import React, { useState } from 'react';
import { Box, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import api from '../../api';

/**
 * Recovery form for users to reset their password.
 *
 * @returns {JSX.Element} for the recover form
 */
const RecoverForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const getResetCode = async () => {
    await api.auth.getCode(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getResetCode();
    navigate('/auth/reset');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: '12rem' }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h2>Recover Account Password 🔒</h2>
          <TextField
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            color="primary"
            type="email"
            sx={{ mb: 3 }}
            fullWidth
            value={email}
          />
          <Button type="submit">SUBMIT</Button>
        </form>
      </Box>
    </Container>
  );
};

export default RecoverForm;
