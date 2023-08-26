import { styled } from '@mui/material/styles';
import { Typography, Grid, Paper } from '@mui/material';

interface DetailsSectionProps {
  description: string;
}

const Details = styled(Paper)`
  margin-right: ${(props) => props.theme.spacing(2)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
  text-align: center;
`;

const DetailsSection = ({ description }: DetailsSectionProps) => {
  return (
    <Grid item xs={12} md={6}>
      <Details>
        <Typography align="center" variant="h5" component="h2" gutterBottom>
          Details
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      </Details>
    </Grid>
  );
};

export default DetailsSection;
