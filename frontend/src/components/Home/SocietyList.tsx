import * as React from 'react';
import Button from '@mui/joy/Button';
import { ListAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SocietyList = () => {
  const navigate = useNavigate();

  const goList = () => {
    navigate('/society/list');
  };

  return (
    <React.Fragment>
      <Button
        sx={{ backgroundColor: '#ffcc02', fontSize: '1rem', width: '100%' }}
        onClick={goList}
      >
        <ListAlt sx={{ marginRight: '0.3rem' }}></ListAlt>
        societies
      </Button>
    </React.Fragment>
  );
};

export default SocietyList;
