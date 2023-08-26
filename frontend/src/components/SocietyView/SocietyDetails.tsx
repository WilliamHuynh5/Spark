import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface SocietyDetails {
  description: string;
}

const DetailsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '10px',
  width: '55%',
  height: 'fit-content',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '2rem',
  },
}));

const DetailsBox = styled(Box)({
  marginLeft: '2rem',
  marginRight: '2rem',
  marginBottom: '2rem',
});

const EventDetails = ({ description }: SocietyDetails) => {
  return (
    <React.Fragment>
      <DetailsContainer>
        <DetailsBox>
          <h2>Intro</h2>
          <Typography>{description}</Typography>
        </DetailsBox>
      </DetailsContainer>
    </React.Fragment>
  );
};

export default EventDetails;
