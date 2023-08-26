import React, { useState } from 'react';
import { Box, Container, Grid, TextField, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import api from '../../api';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import { setAuthenticatedToken } from '../../helper/helper';

const SmallText = styled('small')`
  font-weight: 500;
  text-decoration: inherit;
`;

/**
 * Register form for users to create an account.
 *
 * @returns {JSX.Element} for the register form
 */
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [zId, setZid] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    try {
      // const res = await register(email, password, nameFirst, nameLast, zId);
      const token = (
        await api.auth.register(email, password, nameFirst, nameLast, zId)
      ).token;
      setAuthenticatedToken(token);
      navigate('/home');
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mb: '10px' }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h2>Register for Spark ✨</h2>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => setNameFirst(e.target.value)}
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => setNameLast(e.target.value)}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setZid(e.target.value)}
                  required
                  fullWidth
                  id="zId"
                  label="Student Number"
                  type="string"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
            </Grid>

            <Grid container justifyContent="flex-end">
              <Grid item></Grid>
            </Grid>
          </Box>
          <Button type="submit">REGISTER</Button>
        </form>
      </Box>
      <SmallText>
        Already have an account? <Link to="/auth/login">Login here</Link>
      </SmallText>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Container>
  );
};

export default RegisterForm;
