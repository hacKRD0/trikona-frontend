import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import UserDetails from '../components/profile/UserDetails';

const Profile: React.FC = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return null; // This will be handled by the router's protected route
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                This is your profile page. You can view and update your information here.
              </p>
            </div>
            
            <UserDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 