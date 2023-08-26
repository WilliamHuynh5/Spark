import { Box, Container, styled } from '@mui/material';
import { Society } from '../../api/utils/interfaces';
import SocietyDetails from './SocietyDetails';
import SocietyPostsHeader from './SocietyPostsHeader';
import SocietyPostCard from './SocietyPostCard';
import { formatTimeToPrettyString } from '../../helper/helper';
import { profilePicture } from '../Common/Pictures';
import { Event } from '../../api/utils/interfaces';

/**
 * Props for the SocietyLower component.
 */
interface SocietyLowerProps {
  /**
   * The details of the current society.
   */
  curSoc: Society;
  /**
   * The list of society posts (events).
   */
  societyPosts: Event[];
}

/**
 * SocietyLower component displays the details of a society and its posts in a container.
 *
 * @param {SocietyLowerProps} props - The props for the component.
 * @param {Society} props.curSoc - The details of the current society.
 * @param {Event[]} props.societyPosts - The list of society posts (events).
 * @returns {JSX.Element} - The JSX element representing the SocietyLower component.
 */
const SocietyLower = ({ curSoc, societyPosts }: SocietyLowerProps) => {
  return (
    <StyledContainer>
      {/* Display the details of the society */}
      <SocietyDetails description={curSoc.description} />
      <StyledBox>
        <StyledPostsBox>
          {/* Display the header for society posts */}
          <SocietyPostsHeader />
          {/* Map through the society posts and render a SocietyPostCard for each post */}
          {societyPosts.map((post) => (
            <SocietyPostCard
              key={post.eventId}
              title={post.name}
              time={formatTimeToPrettyString(post.time)}
              location={post.location}
              description={post.description}
              eventId={post.eventId}
              societyProfilePicture={profilePicture}
            />
          ))}
        </StyledPostsBox>
      </StyledBox>
    </StyledContainer>
  );
};

// StyledContainer, StyledBox, and StyledPostsBox remain unchanged
const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8rem;

  @media (max-width: 800px) {
    flex-direction: column;
    margin-top: 3rem;
  }
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const StyledPostsBox = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;

  @media (max-width: 800px) {
    margin-left: 0rem;
  }
`;

export default SocietyLower;
