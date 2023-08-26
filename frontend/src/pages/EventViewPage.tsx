import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeHeader from '../components/Common/HomeHeader';
import Banner from '../components/Common/Banner';
import { formatTimeToPrettyString, getUrlParamsId } from '../helper/helper';
import { eventBanner } from '../components/Common/Pictures';
import EventUpper from '../components/EventView/EventUpper';
import EventLower from '../components/EventView/EventLower';
import api from '../api';

/**
 * EventViewPage displays the details of a specific event.
 * It fetches event data from the server and renders the upper and lower sections of the event view page.
 * If the event does not exist, it redirects to the home page.
 *
 * @returns {JSX.Element} - The JSX element representing the EventViewPage component.
 */
const EventViewPage = () => {
  const [societyId, setSocietyId] = useState(-1);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const navigate = useNavigate();
  const { eventId } = useParams();
  const eventIdNum = getUrlParamsId(eventId, navigate);

  useEffect(() => {
    /**
     * Fetches the event data from the server and sets the component state accordingly.
     * If the event does not exist, it redirects to the home page.
     */
    const loadEvent = async () => {
      try {
        const tempEvent = await api.event.get(eventIdNum);
        const societyName = (await api.society.view(tempEvent.societyId))
          .societyName;
        setSocietyId(tempEvent.societyId);
        setEventTitle(tempEvent.name);
        setEventDate(formatTimeToPrettyString(tempEvent.time));
        setEventLocation(tempEvent.location);
        setEventDescription(tempEvent.description);
        setSocietyName(societyName);
        setBannerImage(eventBanner);
      } catch (err: unknown) {
        console.error(err);
        navigate('/home');
      }
    };
    loadEvent();
  }, [navigate, eventIdNum]);

  return (
    <React.Fragment>
      <HomeHeader />
      <Banner backgroundImageSrc={bannerImage} />
      <EventUpper
        eventId={eventIdNum}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventLocation={eventLocation}
      />
      <EventLower
        societyId={societyId}
        societyName={societyName}
        eventDescription={eventDescription}
      />
    </React.Fragment>
  );
};

export default EventViewPage;
