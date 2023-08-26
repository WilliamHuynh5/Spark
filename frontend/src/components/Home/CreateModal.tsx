import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { AddBox } from '@mui/icons-material';
import { Card, CardContent, CardCover } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

const cardSX = {
  cursor: 'pointer',
  mb: 2,
  transition: '0.1s',
  '&:hover': {
    border: '5px solid #ffcc02',
  },
};

const CreateModal = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreateSociety = () => {
    setOpen(false);
    navigate('/apply');
  };

  return (
    <React.Fragment>
      <Button
        sx={{ backgroundColor: '#ffcc02', fontSize: '1rem', width: '100%' }}
        onClick={() => setOpen(true)}
      >
        <AddBox sx={{ marginRight: '0.3rem' }}></AddBox>
        create
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          transitionDuration: '2s',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ModalDialog sx={{ width: 500 }}>
          <Card component="li" sx={cardSX}>
            <CardCover>
              <img
                src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
              />
            </CardCover>
            <CardContent onClick={handleCreateSociety}>
              <Typography
                level="h6"
                fontWeight="lg"
                textColor="#fff"
                mt={{ xs: 12, sm: 18 }}
              >
                create a new society
              </Typography>
            </CardContent>
          </Card>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default CreateModal;
