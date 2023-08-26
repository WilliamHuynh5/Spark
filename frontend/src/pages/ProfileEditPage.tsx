import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import HomeHeader from '../components/Common/HomeHeader';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';
import { getAuthenticatedToken, isGuest } from '../helper/helper';

const ContentContainer = styled(Container)({
  margin: '12rem auto 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
});

const FormBox = styled(Box)({
  marginBottom: '10px',
});

const PageHeader = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginBottom: '30px',
});

const InputField = styled(TextField)({
  marginBottom: '15px',
  variant: 'outlined',
  width: '100%',
  color: 'primary',
});

const ButtonsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

const BackButton = styled(Button)({
  display: 'inline-block',
  marginRight: '15px',
});

const SaveButton = styled(Button)({
  display: 'inline-block',
});

const ProfileEditPage = () => {
  const [nameFirst, setNameFirst] = React.useState<string>('');
  const [nameLast, setNameLast] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [showError, setShowError] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const userToken = getAuthenticatedToken();
  if (isGuest(userToken)) {
    navigate('/home');
  }

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await api.profile.view(userToken);
        setNameFirst(data.nameFirst);
        setNameLast(data.nameLast);
        setEmail(data.email);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    fetchUserInfo();
  }, [userToken]);

  const editProfile = async () => {
    try {
      await api.profile.edit(userToken, email, nameFirst, nameLast);
      navigate('/profile/view');
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
    editProfile();
  };

  return (
    <React.Fragment>
      <HomeHeader />
      <ContentContainer maxWidth="xs">
        <FormBox>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <PageHeader variant="h3">Edit Profile</PageHeader>
            <InputField
              label="First Name"
              required
              onChange={(e) => setNameFirst(e.target.value)}
              value={nameFirst}
            />
            <InputField
              label="Last Name"
              required
              onChange={(e) => setNameLast(e.target.value)}
              value={nameLast}
            />
            <InputField
              label="Email"
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <ButtonsBox>
              <BackButton
                onClick={() => navigate('/profile/view')}
                variant="contained"
              >
                ⬅ Back
              </BackButton>
              <SaveButton type="submit" variant="contained">
                💾 Save
              </SaveButton>
            </ButtonsBox>
          </form>
        </FormBox>
      </ContentContainer>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ProfileEditPage;
