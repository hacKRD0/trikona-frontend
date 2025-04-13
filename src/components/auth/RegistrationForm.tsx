import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { showToast } from '../../redux/slices/toastSlice';
import { useRegisterMutation } from '../../redux/services/authApi';
import PasswordInput from '../common/PasswordInput';
import LoadingButton from '../common/LoadingButton';
import { isStrongPassword } from '../../utils/passwordUtils';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  linkedinUrl: string;
}

const RegistrationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedinUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const token = searchParams.get('token');
  const [register] = useRegisterMutation();

  useEffect(() => {
    if (!token) {
      dispatch(showToast({ 
        message: 'Invalid or expired verification link', 
        type: 'error' 
      }));
      navigate('/auth/register');
    }
  }, [token, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isStrongPassword(formData.password)) {
      dispatch(
        showToast({
          message:
            'Password must be at least 8 characters and include uppercase, lowercase, a digit, and a special character.',
          type: 'error',
        })
      );
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      dispatch(showToast({ message: 'Passwords do not match.', type: 'error' }));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register({ ...formData, token: token || '' }).unwrap();
      dispatch(showToast({ 
        message: 'Registration successful! Please check your email for role selection.', 
        type: 'success' 
      }));
      navigate('/auth');
    } catch (err: any) {
      dispatch(showToast({ 
        message: err?.data?.error || 'Registration failed', 
        type: 'error' 
      }));
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Complete Your Registration
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="linkedinUrl" className="block text-gray-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedinUrl"
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              required
              placeholder="https://www.linkedin.com/in/your-profile"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be used to verify your identity
            </p>
          </div>
          
          <div className="mb-4">
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              label="Password"
              showLabel
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, a digit, and a special character.
            </p>
          </div>
          
          <div className="mb-6">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              label="Confirm Password"
              showLabel
            />
          </div>
          
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 