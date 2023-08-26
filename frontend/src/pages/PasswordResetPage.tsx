import React from 'react';
import FunniWave from '../components/FunniWave/FunniWave';
import ResetForm from '../components/Auth/ResetForm';

const PasswordResetPage = () => {
  return (
    <React.Fragment>
      <ResetForm></ResetForm>
      <FunniWave />
    </React.Fragment>
  );
};

export default PasswordResetPage;
