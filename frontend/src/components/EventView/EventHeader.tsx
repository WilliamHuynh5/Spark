import { Typography } from '@mui/joy';
import { Box, styled } from '@mui/material';

interface EventHeadings {
  title: string;
  date: string;
  location: string;
}

const DateTypography = styled(Typography)`
  font-weight: bold;
  color: red;
  margin-bottom: 1rem;
`;

const LocationTypography = styled(Typography)`
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const EventHeader = ({ title, date, location }: EventHeadings) => {
  return (
    <Box>
      <Box>
        <h1>{title}</h1>
      </Box>
      <Box>
        <DateTypography>⏰ {date}</DateTypography>
        <LocationTypography>📍 {location}</LocationTypography>
      </Box>
    </Box>
  );
};

export default EventHeader;
