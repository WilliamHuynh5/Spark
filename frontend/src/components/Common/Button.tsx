import { styled } from '@mui/system';

const Button = styled('button')`
  background: #ffcc02;
  border-radius: 50px;
  border: solid 3px #ffcc02;
  width: 100%;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1em;
  color: #000000;
  padding: 6px 0;
  transition: all 0.1s;
  z-index: 1;
  letter-spacing: 0.8px;

  &:hover {
    font-size: 1.2em;
    border: solid 2px #000000;
  }

  &:active {
    scale: 0.9;
  }
`;

export default Button;
