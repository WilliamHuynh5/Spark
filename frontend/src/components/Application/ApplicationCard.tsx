import { Card, CardContent, Typography, styled } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Application } from '../../api/utils/interfaces';

// Possible application status values
const ApplicationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
};

export interface ApplicationCardProps {
  application: Application;
  onClick: (application: Application) => void;
}

/**
 * Get the appropriate status icon based on the application status.
 * @param {string} status - The application status value.
 * @returns {JSX.Element | null} - The corresponding status icon component or null if status is unknown.
 */
const getApplicationStatusIcon = (status: string) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return <PendingIcon sx={{ color: 'warning.main', fontSize: '32px' }} />;
    case ApplicationStatus.APPROVED:
      return (
        <CheckCircleIcon sx={{ color: 'success.main', fontSize: '32px' }} />
      );
    case ApplicationStatus.DENIED:
      return <CancelIcon sx={{ color: 'error.main', fontSize: '32px' }} />;
    default:
      return null;
  }
};

// Styled components
const StyledCard = styled(Card)({
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexGrow: 1,
});

const StatusCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flexShrink: 0,
  marginLeft: 'auto',
});

function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  return (
    <StyledCard variant="outlined" onClick={() => onClick(application)}>
      <StyledCardContent>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          {application.name}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          {application.description}
        </Typography>
      </StyledCardContent>
      <StatusCardContent>
        {getApplicationStatusIcon(application.status)}
      </StatusCardContent>
    </StyledCard>
  );
}

export default ApplicationCard;
