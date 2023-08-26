import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface EditPageButtonProps {
  societyID: number;
}

const EditButton = styled(Button)`
  display: block;
  margin: 0 auto;
  margin-top: ${(props) => props.theme.spacing(2)};
`;

const EditPageButton = ({ societyID }: EditPageButtonProps) => {
  return (
    <Link to={`/society/${societyID}/edit`} style={{ textDecoration: 'none' }}>
      <EditButton variant="contained" color="secondary">
        Edit Page
      </EditButton>
    </Link>
  );
};

export default EditPageButton;
