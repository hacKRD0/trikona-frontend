// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import LinkedInCallback from './pages/LinkedInCallback';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RoleSelection from './pages/RoleSelection';
import ResetPassword from './pages/ResetPassword';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPassword from './pages/ForgotPassword';
import StudentDirectoryPage from './pages/directory/StudentDirectory';
import CorporateDirectoryPage from './pages/directory/CorporateDirectory';
import ProfessionalDirectoryPage from './pages/directory/ProfessionalDirectory';
import CollegeDirectoryPage from './pages/directory/CollegeDirectory';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/linkedin-callback" element={<LinkedInCallback />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="directory/students" element={
          <ProtectedRoute>
            <StudentDirectoryPage />
          </ProtectedRoute>
        } />
        <Route path="directory/corporates" element={
          <ProtectedRoute>
            <CorporateDirectoryPage />
          </ProtectedRoute>
        } />
        <Route path="directory/professionals" element={
          <ProtectedRoute>
            <ProfessionalDirectoryPage />
          </ProtectedRoute>
        } />
        <Route path="directory/colleges" element={
          <ProtectedRoute>
            <CollegeDirectoryPage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default App;
