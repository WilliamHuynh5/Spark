import React, { useState } from 'react';
import { Box, Container, TextField, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import api from '../../api';
import GuestButton from './GuestButton';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';
import {
  removeAuthenticatedToken,
  setAuthenticatedToken,
} from '../../helper/helper';

const SmallText = styled('small')`
  font-weight: 500;
  text-decoration: inherit;
  display: flex;
`;

/**
 * Login form for the auth page /auth/login.
 *
 * @returns {JSX.Element} for the login form
 */
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const token = (await api.auth.login(email, password)).token;
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
    setEmailErr(false);
    setPasswordError(false);
    login();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginBottom: '10px' }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h2>Welcome to Spark ✨</h2>
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
            error={emailErr}
          />
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            color="primary"
            type="password"
            value={password}
            error={passwordError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button type="submit">LOGIN</Button>
          <SmallText
            sx={{ justifyContent: 'center', mt: '0.3rem', mb: '0.3rem' }}
          >
            OR
          </SmallText>
          <GuestButton
            onClick={() => {
              removeAuthenticatedToken();
              navigate('/home');
            }}
          >
            GUEST ACCESS
          </GuestButton>
        </form>
        <Box sx={{ mt: '1rem' }}>
          <SmallText>
            Need an account?&nbsp;<Link to="/auth/register">Register here</Link>
          </SmallText>
          <SmallText>
            Forgot your password?&nbsp;
            <Link to="/auth/recover">Reset here</Link>
          </SmallText>
        </Box>
      </Box>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Container>
  );
};

export default LoginForm;
