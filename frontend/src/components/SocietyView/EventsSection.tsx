import { styled } from '@mui/material/styles';
import { Typography, Grid, Paper, Button, List, ListItem } from '@mui/material';

const Events = styled(Paper)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
  text-align: center;

  ul {
    text-align: left;
    margin-left: ${(props) => props.theme.spacing(2)};
  }
`;

const CreateEventButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing(2)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const EventsSection = () => {
  return (
    <Grid item xs={12} md={6}>
      <Events>
        <Typography align="center" variant="h5" component="h2" gutterBottom>
          Events
        </Typography>
        <List>
          <ListItem>Event 1</ListItem>
          <ListItem>Event 2</ListItem>
          <ListItem>Event 3</ListItem>
        </List>
        <CreateEventButton variant="outlined" color="primary">
          Create Event
        </CreateEventButton>
      </Events>
    </Grid>
  );
};

export default EventsSection;
