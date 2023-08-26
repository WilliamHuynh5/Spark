import { Container, styled } from '@mui/material';
import EventDetails from './EventDetails';

/**
 * Props for the EventLower component.
 */
interface EventLowerProps {
  societyId: number;
  societyName: string;
  eventDescription: string;
}

/**
 * Styled container for the EventLower component.
 * Uses MUI's Container component with custom styles.
 */
const LowerContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: '3rem',
  '@media (max-width: 800px)': {
    flexDirection: 'column',
  },
});

/**
 * EventLower component displays EventDetails and EventMembers side by side in a container.
 * The layout changes to a column when the screen width is 800px or less.
 *
 * @param {EventLowerProps} props - The props for the component.
 * @param {number} props.societyId - The ID of the society.
 * @param {string} props.societyName - The name of the society.
 * @param {string} props.eventDescription - The description of the event.
 * @returns {JSX.Element} - The JSX element representing the EventLower component.
 */
const EventLower = ({
  societyId,
  societyName,
  eventDescription,
}: EventLowerProps) => {
  return (
    <LowerContainer>
      <EventDetails
        societyId={societyId}
        societyName={societyName}
        description={eventDescription}
      />
    </LowerContainer>
  );
};

export default EventLower;
