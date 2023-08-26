import React from 'react';
import { useParams } from 'react-router-dom';
import HomeHeader from '../components/Common/HomeHeader';
import CenteredBox from '../components/Common/CenteredBox';
import EventCreationForm from '../components/Forms/EventCreationForm';

/**
 * EventCreationPage component responsible for rendering the page to create a new event.
 * It displays the HomeHeader component and a centered EventCreationForm component.
 * The societyId is obtained from the URL parameters and passed as props to the EventCreationForm.
 *
 * @returns {JSX.Element} - The JSX element representing the EventCreationPage component.
 */
const EventCreationPage = () => {
  // Extract the 'societyId' from URL parameters using useParams hook from react-router-dom,
  // and convert it into a number using `parseInt`.
  const { societyId } = useParams();
  const societyIdNum = parseInt(societyId as string);

  // Render the components and the EventCreationForm with the societyId as props
  return (
    <React.Fragment>
      <HomeHeader />
      <CenteredBox>
        <EventCreationForm societyId={societyIdNum} />
      </CenteredBox>
    </React.Fragment>
  );
};

export default EventCreationPage;
