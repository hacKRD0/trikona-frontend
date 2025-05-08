import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { showToast } from '../../redux/slices/toastSlice';
import { useUpdateUserMutation } from '../../redux/services/authApi';
import { setCredentials } from '../../redux/slices/authSlice';

const UserDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    linkedInUrl: user?.linkedInUrl || '',
  });
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUser(formData).unwrap();
      if (response.user && token) {
        // Update Redux store with new user data
        dispatch(setCredentials({ token, user: response.user }));
        // Update form data with the new user data
        setFormData({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          linkedInUrl: response.user.linkedInUrl || '',
        });
      }
      dispatch(showToast({ 
        message: 'Profile updated successfully', 
        type: 'success' 
      }));
      setIsEditing(false);
    } catch (err: any) {
      dispatch(showToast({ 
        message: err?.data?.error || 'Failed to update profile', 
        type: 'error' 
      }));
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-900">Account Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedInUrl"
                id="linkedInUrl"
                value={formData.linkedInUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-profile"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
          <div className="sm:col-span-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">First Name</span>
              <span className="mt-1 text-sm text-gray-900">{user?.firstName || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Last Name</span>
              <span className="mt-1 text-sm text-gray-900">{user?.lastName || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</span>
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Role</span>
              <span className="mt-1 text-sm text-gray-900">{user?.role || 'Not provided'}</span>
            </div>
          </div>

          <div className="sm:col-span-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">LinkedIn URL</span>
              <span className="mt-1 text-sm text-gray-900">
                {user?.linkedInUrl ? (
                  <a 
                    href={user?.linkedInUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {user?.linkedInUrl}
                  </a>
                ) : 'Not provided'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails; 