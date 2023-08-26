import { ReactNode } from 'react';
import { Box } from '@mui/material';

/**
 * Props for the CenteredBox component.
 */
interface CenteredBoxProps {
  children: ReactNode;
}

/**
 * CenteredBox component centers its child elements both horizontally and vertically inside a flex container.
 *
 * @param {CenteredBoxProps} props - The props for the component.
 * @param {ReactNode} props.children - The child elements to be centered inside the box.
 * @returns {JSX.Element} - The JSX element representing the CenteredBox component.
 */
const CenteredBox = ({ children }: CenteredBoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        placeItems: 'center',
        height: '90vh',
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
