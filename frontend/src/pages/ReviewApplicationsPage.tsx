import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/Application/ApplicationCard';
import HomeHeader from '../components/Common/HomeHeader';
import api from '../api';
import { Application } from '../api/utils/interfaces';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';
import ApplicationModal from '../components/Application/ApplicationFormDialog';
import { getAuthenticatedToken, isGuest } from '../helper/helper';

const ReviewApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const authUserToken = getAuthenticatedToken();
  if (isGuest(authUserToken)) {
    navigate('/auth/login');
  }

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[] | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchApplcations = async () => {
      try {
        const data = await api.admin.application.list(authUserToken);
        setApplications(data.applications.reverse());
      } catch (err: unknown) {
        let message = `An unknown error has occured. Contact your system admin\n${err}`;
        if (err instanceof ApiError) {
          message = err.message;
        }
        setErrorMsg(message);
        setShowError(true);
      }
    };
    fetchApplcations();
  }, [authUserToken]);

  return (
    <React.Fragment>
      <HomeHeader />
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '8rem',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h2" color="inherit" sx={{ marginBottom: '1rem' }}>
          Review Society Applications 🔎
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
          align="justify"
          sx={{ marginBottom: '2rem' }}
        >
          See the most recent applications below and their statuses. You can
          click on each one to view more details and make decisions on society
          approval or denial.
        </Typography>
        <Box>
          {applications ? (
            applications.map((application: Application) => (
              <ApplicationCard
                key={application.applicationId}
                application={application}
                onClick={handleApplicationClick}
              />
            ))
          ) : (
            <Typography>Loading data...</Typography>
          )}
        </Box>

        <ApplicationModal
          open={modalOpen}
          application={selectedApplication}
          onClose={handleCloseModal}
        />
      </Container>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ReviewApplicationsPage;
