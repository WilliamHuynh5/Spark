import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const CreateCard = (props: { title: string | null | undefined }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 'auto',
        mb: '3rem',
        backgroundColor: '#ffcc02',
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="100"
          image="src/assets/HomeAssets/SocietyImage.jpg"
        />
        <Typography gutterBottom variant="h5" sx={{ textAlign: 'center' }}>
          {props.title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default CreateCard;
