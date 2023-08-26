import { styled } from '@mui/system';

/**
 * Styled button for Guest Access
 */
const GuestButton = styled('button')`
  border: #ffcc02;
  background: #eff2f5;
  border-radius: 50px;
  border: solid 3px #ffcc02;
  width: 100%;
  cursor: pointer;
  font-weight: 540;
  font-size: 1.1em;
  color: #000000;
  padding: 6px 0;
  transition: all 0.1s;
  z-index: 1;
  letter-spacing: 0.8px;

  &:hover {
    font-size: 1.15em;
    border: solid #ffcc02;
    font-weight: 600;
  }

  &:active {
    scale: 0.9;
  }
`;

export default GuestButton;
