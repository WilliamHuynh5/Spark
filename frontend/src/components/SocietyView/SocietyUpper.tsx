import { Box, Container, styled } from '@mui/material';
import SocietyMenu from './SocietyMenu';

interface SocietyUpperProps {
  /**
   * The ID of the society to display the menu for.
   */
  societyId: number;
}

/**
 * SocietyUpper component displays the menu for a specific society.
 *
 * @param {SocietyUpperProps} props - The props for the component.
 * @param {number} props.societyId - The ID of the society to display the menu for.
 * @returns {JSX.Element} - The JSX element representing the SocietyUpper component.
 */
const SocietyUpper = ({ societyId }: SocietyUpperProps) => {
  return (
    <StyledContainer>
      <StyledBox>
        {/* Display the SocietyMenu for the specified society */}
        <SocietyMenu societyId={societyId} />
      </StyledBox>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const StyledBox = styled(Box)`
  margin-top: 3rem;
  margin-left: auto;

  @media (max-width: 800px) {
    margin-top: 10rem;
    margin-right: auto;
  }
`;

export default SocietyUpper;
