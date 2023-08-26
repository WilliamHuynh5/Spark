import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import api from '../api';
import HomeHeader from '../components/Common/HomeHeader';
import EventCard from '../components/Home/EventCard';
import { profilePicture, eventBanner } from '../components/Common/Pictures';
import { Event } from '../api/utils/interfaces';
import { formatTimeToPrettyString } from '../helper/helper';
import EventSearchBar from '../components/Home/EventSearchBar';
import { ApiError } from '../api/utils/apiTypes';
import ErrorPopup from '../components/Common/ErrorPopup';

/**
 * Component that displays a list of events with pagination.
 * @returns A React Functional Component that displays a list of events with pagination.
 */
const EventListPage: React.FC = () => {
  const [eventPosts, setEventPosts] = useState<Event[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [paginationStart, setPaginationStart] = useState<number>(0);
  const [paginationEnd, setPaginationEnd] = useState<number>(9);
  const [searchString, setSearchString] = useState<string | undefined>();
  const [timeStart, setTimeStart] = useState<string | undefined>();
  const [timeEnd, setTimeEnd] = useState<string | undefined>();

  // Attach the scroll event listener when the component mounts
  useEffect(() => {
    /**
     * Function to detect if the user has scrolled to the bottom of the page and initiates loading more posts.
     */
    const handleScroll = () => {
      const windowHeight =
        'innerHeight' in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
      const windowBottom = windowHeight + window.scrollY + 400;

      if (windowBottom >= docHeight) {
        // When the user reaches the bottom of the page, load more event posts
        setPaginationEnd(paginationEnd + 9); // Update the pagination end index
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      // Remove the scroll event listener when the component unmounts
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // Fetch more event posts whenever the pagination indexes change
  // eslint-disble-next-line
  useEffect(() => {
    /**
     * Function to load more event posts from the server.
     * It updates the eventPosts state with new events and handles loading state.
     */
    const loadMorePosts = async () => {
      try {
        const eventsResponse: Iterable<Event> = (
          await api.event.list(
            searchString,
            timeStart,
            timeEnd,
            paginationStart,
            paginationEnd,
          )
        ).events;
        const events: Event[] = Array.from(eventsResponse);
        const newEvents = events.filter(
          (e) => !eventPosts.some((ev) => ev.eventId === e.eventId),
        );
        const newEventPosts: Event[] = [...eventPosts, ...newEvents];
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

    loadMorePosts();
  }, [paginationEnd]); // eslint-disable-line

  // Fetch event posts from the server when the component mounts
  const searchEvents = (ss?: string, ts?: string, te?: string) => {
    // setEventPosts([]);
    setSearchString(ss);
    setTimeStart(ts);
    setTimeEnd(te);
    setPaginationStart(0);
    setPaginationEnd(9);
  };

  useEffect(() => {
    const doSearch = async () => {
      try {
        const events = (
          await api.event.list(searchString, timeStart, timeEnd, 0, 9)
        ).events;
        setEventPosts(events);
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };
    doSearch();
  }, [searchString, timeStart, timeEnd]);

  return (
    <React.Fragment>
      <HomeHeader searchBar={<EventSearchBar handleSearch={searchEvents} />} />
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
          Browse Events 📅
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
          align="justify"
          sx={{ marginBottom: '2rem' }}
        >
          View, search and filter events.
        </Typography>

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

export default EventListPage;
