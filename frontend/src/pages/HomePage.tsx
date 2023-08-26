import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import HomeHeader from '../components/Common/HomeHeader';
import EventCard from '../components/Home/EventCard';
import { profilePicture, eventBanner } from '../components/Common/Pictures';
import { Event, Society } from '../api/utils/interfaces';
import {
  formatTimeToPrettyString,
  getAuthenticatedToken,
  isGuest,
} from '../helper/helper';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';

/**
 * Home page component, renders the home header and the event posts fetched from the backend.
 * The events are associated with the societies the authenticated user is a member of.
 *
 * @returns {JSX.Element} - The JSX element representing the HomePage component.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [eventPosts, setEventPosts] = useState<Event[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const token = getAuthenticatedToken();

  useEffect(() => {
    // Function to load the feed (event posts for each society)
    const loadFeed = async () => {
      if (isGuest(token)) {
        // Case of user being a guest
        return;
      }
      try {
        const societies: Iterable<Society> = (
          await api.profile.societies(token)
        ).societies;

        const newEventPosts: Event[] = [];
        for (const society of societies) {
          const events: Iterable<Event> = (
            await api.society.events(society.societyId)
          ).events;
          newEventPosts.push(...events);
        }

        setEventPosts(newEventPosts);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };

    loadFeed();
  }, [token, navigate]);

  return (
    <React.Fragment>
      <HomeHeader />
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '8rem',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h2" color="inherit" sx={{ marginBottom: '1rem' }}>
          Home 🏡
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
          align="justify"
          sx={{ marginBottom: '2rem' }}
        >
          Your personal feed of events from the societies you've joined.
        </Typography>
        {eventPosts.length != 0 ? (
          <Box sx={{ placeItems: 'center' }}>
            {/* Map through the event posts and render an EventCard for each post */}
            {eventPosts.map((post) => (
              <EventCard
                societyId={post.societyId}
                key={post.eventId}
                title={post.name}
                time={formatTimeToPrettyString(post.time)}
                location={post.location}
                description={post.description}
                eventId={post.eventId}
                eventBanner={profilePicture}
                societyProfilePicture={eventBanner}
              />
            ))}
          </Box>
        ) : (
          <Typography
            display="flex"
            justifyContent="center"
            marginTop="10%"
            fontSize={40}
          >
            Your feed is currently empty, try joining a society.
          </Typography>
        )}
        {showError && (
          <ErrorPopup
            errorMessage={errorMsg}
            closeError={() => setShowError(false)}
          />
        )}
      </Container>
    </React.Fragment>
  );
};

export default HomePage;
