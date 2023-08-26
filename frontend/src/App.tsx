import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SocietyListPage from './pages/SocietyListPage';
import ApplySocietyPage from './pages/ApplySocietyPage';
import ReviewApplicationsPage from './pages/ReviewApplicationsPage';
import UsersPage from './pages/UsersPage';
import SocietyEditPage from './pages/SocietyEditPage';
import SocietyViewPage from './pages/SocietyViewPage';
import EventViewPage from './pages/EventViewPage';
import SocietyMembersPage from './pages/SocietyMembersPage';
import ProfileViewPage from './pages/ProfileViewPage';
import PasswordRecoverPage from './pages/PasswordRecoverPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ProfileEditPage from './pages/ProfileEditPage';
import EventCreationPage from './pages/EventCreatePage';
import EventEditPage from './pages/EventEditPage';
import EventQrCodePage from './pages/EventQrCodePage';
import EventListPage from './pages/EventListPage';
import EventAttendanceFormPage from './pages/EventAttendanceFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* For any path not list, we redirect users to the login page. */}
        <Route
          path="*"
          element={<Navigate to={'/auth/login'} replace />}
        ></Route>

        {/* For handling auth pages. */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/recover" element={<PasswordRecoverPage />} />
        <Route path="/auth/reset" element={<PasswordResetPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* Routes relating to profile actions.  */}
        <Route path="/profile/view" element={<ProfileViewPage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />

        {/* Routes relating to create a new society application.  */}
        <Route path="/apply" element={<ApplySocietyPage />} />
        <Route
          path="/applications/review"
          element={<ReviewApplicationsPage />}
        />

        {/* Routes for handling society actions. */}
        <Route path="/society/list" element={<SocietyListPage />} />
        <Route path="/society/:societyId" element={<SocietyViewPage />} />
        <Route path="/society/:societyId/edit" element={<SocietyEditPage />} />
        <Route
          path="/society/:societyId/members"
          element={<SocietyMembersPage />}
        />

        {/* Routes for handling event actions. */}
        <Route path="/event/list" element={<EventListPage />} />
        <Route path="/event/:eventId" element={<EventViewPage />} />
        <Route path="/event/:eventId/edit" element={<EventEditPage />} />
        <Route path="/event/:eventId/qrcode" element={<EventQrCodePage />} />
        <Route
          path="/event/:eventId/form"
          element={<EventAttendanceFormPage />}
        />
        <Route
          path="/event/:societyId/create"
          element={<EventCreationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
