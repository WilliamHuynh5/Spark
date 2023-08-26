import React from 'react';
import { Box, Link, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface EventDetails {
  societyId: number;
  societyName: string;
  description: string;
}

const DetailsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '10px',
  width: '60%',
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

const EventDetails = ({
  societyId,
  societyName,
  description,
}: EventDetails) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <DetailsContainer>
        <DetailsBox>
          <h2>Details</h2>
          <Typography sx={{ mb: '1rem' }}>
            Event by: &nbsp;
            <Link
              sx={{
                fontWeight: 'bold',
                color: 'black',
                mb: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate(`/society/${societyId}`);
              }}
            >
              {societyName}
            </Link>
          </Typography>
          <Typography>{description}</Typography>
        </DetailsBox>
      </DetailsContainer>
    </React.Fragment>
  );
};

export default EventDetails;
