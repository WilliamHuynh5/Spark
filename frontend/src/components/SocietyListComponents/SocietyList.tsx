import React from 'react';
import { Grid, styled } from '@mui/material';
import SocietyThumbnail, { Society } from './SocietyThumbnail';

interface SocietyListProps {
  societies: Society[];
}

const SocietyGrid = styled(Grid)({
  margin: 0,
});

const CreateGrid = ({ societies }: SocietyListProps) => {
  return (
    <SocietyGrid container spacing={2}>
      {societies.map((society) => {
        return <SocietyThumbnail {...society} key={society.societyId} />;
      })}
    </SocietyGrid>
  );
};

const SocietyList = ({ societies }: SocietyListProps) => {
  return (
    <React.Fragment>
      {societies.length === 0 && 'No Societies'}
      {societies.length !== 0 && <CreateGrid societies={societies} />}
    </React.Fragment>
  );
};

export default SocietyList;
