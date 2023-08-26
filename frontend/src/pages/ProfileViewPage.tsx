import React, { useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeHeader from '../components/Common/HomeHeader';
import ProfileInfo from '../components/Profile/ProfileInfo';
import EditButton from '../components/Profile/EditButton';
import SocietiesJoinedGrid from '../components/Profile/SocietiesJoinedGrid';
import EventAttendingList from '../components/Profile/EventsAttendingList';
import {
  Profile,
  ProfileEvents,
  ProfileSocieties,
} from '../api/utils/interfaces';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getAuthenticatedToken, isGuest } from '../helper/helper';
import CopyWebcalButton from '../components/Profile/CopyWebcalButton';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';

const ContentContainer = styled(Container)({
  margin: '0 auto',
  backgroundColor: 'background.paper',
  padding: '24px',
});

const ProfileViewPage = () => {
  const [user, setUser] = React.useState<Profile | undefined>(undefined);
  const [societies, setSocieties] = React.useState<
    ProfileSocieties | undefined
  >(undefined);
  const [events, setEvents] = React.useState<ProfileEvents | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [showError, setShowError] = React.useState<boolean>(false);

  const token = getAuthenticatedToken();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isGuest(token)) {
        navigate('/home');
      }
      try {
        const data = await api.profile.view(token);
        setUser(data);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    const fetchSocieties = async () => {
      if (isGuest(token)) {
        return;
      }
      try {
        const data = await api.profile.societies(token);
        setSocieties(data);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    const fetchEvents = async () => {
      if (isGuest(token)) {
        return;
      }
      try {
        const data = await api.profile.events(token);
        setEvents(data);
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
    fetchSocieties();
    fetchEvents();
  }, [navigate, token]);

  return (
    <React.Fragment>
      <HomeHeader />
      <ContentContainer style={{ maxWidth: '800px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}></Grid>
          {user ? (
            <React.Fragment>
              <ProfileInfo
                nameFirst={user.nameFirst}
                nameLast={user.nameLast}
                email={user.email}
                zId={user.zId}
              />
            </React.Fragment>
          ) : (
            <Typography>Loading user info...</Typography>
          )}
          <EditButton />
          {user ? (
            <CopyWebcalButton webcal={user.webcal} />
          ) : (
            <Typography>Loading user info...</Typography>
          )}
          {societies ? (
            <SocietiesJoinedGrid profileSocieties={societies} />
          ) : (
            <Typography>Loading society info...</Typography>
          )}
          {events ? (
            <EventAttendingList profileEvents={events} />
          ) : (
            <Typography>Loading event info...</Typography>
          )}
        </Grid>
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

export default ProfileViewPage;
