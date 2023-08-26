import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

interface SocietyBannerProps {
  photourl: string;
}

const SocietyBannerContainer = styled(Paper)`
  background-image: url(${(props: SocietyBannerProps) => props.photourl});
  background-size: contain;
  background-position: center;
  padding: ${(props) => props.theme.spacing(2)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
  margin-top: ${(props) => props.theme.spacing(10)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75px;
`;

const SocietyBanner = ({ photourl }: SocietyBannerProps) => {
  return <SocietyBannerContainer photourl={photourl} />;
};

export default SocietyBanner;
