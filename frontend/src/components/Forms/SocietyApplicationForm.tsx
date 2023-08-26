import React, { useState } from 'react';
import { Container, FormControl, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import api from '../../api';
import { getAuthenticatedToken, isGuest } from '../../helper/helper';
import ErrorPopup from '../Common/ErrorPopup';
import { ApiError } from '../../api/utils/apiTypes';

const descriptionHelperText = `Detail your club's aims and objectives, and a vision for future growth for
   members and activities.`;

const SocietyApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const token = getAuthenticatedToken();

  if (isGuest(token)) {
    navigate('/home');
  }

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const societyApply = async () => {
    try {
      await api.society.apply(token, name, description, []);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    societyApply();
  };

  return (
    <Container maxWidth="md" style={{ position: 'relative' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Apply for a New Society ♣
      </Typography>
      <Typography variant="body1" align="justify" gutterBottom>
        Interested in starting your own society? Fill out the form below!
      </Typography>
      <Typography variant="body2" align="justify" gutterBottom>
        If your application is accepted, you'll be made the administrator of
        your new society page.
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Society Name"
            onChange={(e) => setName(e.target.value)}
            required
            variant="outlined"
            color="primary"
            type="text"
            name="name"
            value={name}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            multiline
            minRows={10}
            label="Description"
            helperText={descriptionHelperText}
            onChange={(e) => setDescription(e.target.value)}
            required
            color="primary"
            type="text"
            name="description"
            value={description}
          />
        </FormControl>
        <Button
          type="submit"
          color="primary"
          style={{ maxWidth: '20%', float: 'right' }}
        >
          Submit
        </Button>
      </form>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </Container>
  );
};

export default SocietyApplicationForm;
