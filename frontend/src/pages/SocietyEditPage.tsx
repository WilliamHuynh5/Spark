import React, { useEffect, useState } from 'react';
import { Typography, Container, TextField, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import HomeHeader from '../components/Common/HomeHeader';
import api from '../api';
import Button from '../components/Common/Button';
import { getAuthenticatedToken, getUrlParamsId } from '../helper/helper';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';

const SocietyEditPage = () => {
  const navigate = useNavigate();
  const token = getAuthenticatedToken();

  const params = useParams<{ societyId?: string }>();
  const societyId = getUrlParamsId(params.societyId, navigate);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const soc = await api.society.view(societyId);
        setName(soc.societyName);
        setDescription(soc.description);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    fetchSociety();
  }, [societyId]);

  const handleFormSubmit = async () => {
    try {
      await api.society.edit(token, societyId, name, description);
      navigate(`/society/${societyId}`);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  return (
    <React.Fragment>
      <HomeHeader />
      <Box
        sx={{
          display: 'flex',
          placeItems: 'center',
          minHeight: '90vh',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Edit Society Details 🤠
          </Typography>
          <form>
            <TextField
              label="Society Name"
              value={name}
              fullWidth
              margin="normal"
              onChange={(society) => setName(society.target.value)}
            />
            <TextField
              label="Details"
              value={description}
              multiline
              rows={7.5}
              margin="normal"
              fullWidth
              onChange={(society) => setDescription(society.target.value)}
            />
            <Button
              type="button"
              onClick={handleFormSubmit}
              sx={{ mt: '1rem' }}
            >
              Edit Society
            </Button>
          </form>
        </Container>
      </Box>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default SocietyEditPage;
