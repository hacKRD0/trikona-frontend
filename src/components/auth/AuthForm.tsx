// components/AuthForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRequestVerificationLinkMutation, useGetLinkedInAuthUrlQuery } from '../../redux/services/authApi';
import { AppDispatch, RootState } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/toastSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';
import PasswordInput from '../common/PasswordInput';
import LoadingButton from '../common/LoadingButton';

interface FormData {
  email: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isInitialRegistration, setIsInitialRegistration] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isLinkedInLoading, setIsLinkedInLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [requestVerificationLink] = useRequestVerificationLinkMutation();
  const { data: linkedInAuthData, isLoading: isLinkedInAuthLoading } = useGetLinkedInAuthUrlQuery();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInitialRegistration) {
      setEmail(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleInitialRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      dispatch(showToast({ message: 'Please enter your email address', type: 'error' }));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await requestVerificationLink({ email }).unwrap();
      setIsEmailSent(true);
      dispatch(showToast({ 
        message: 'Verification link sent! Please check your email.', 
        type: 'success' 
      }));
    } catch (err: any) {
      dispatch(showToast({ 
        message: err?.data?.error || 'Failed to send verification link', 
        type: 'error' 
      }));
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      if (result.token && result.user) {
        dispatch(setCredentials({ token: result.token, user: result.user }));
        dispatch(showToast({ message: 'Login successful!', type: 'success' }));
        navigate('/');
      } else {
        dispatch(showToast({ message: 'Login failed: Invalid response from server', type: 'error' }));
      }
    } catch (err: any) {
      dispatch(showToast({ message: err?.data?.error || 'Login failed', type: 'error' }));
    }
  };

  const toggleMode = () => {
    if (isLogin) {
      setIsInitialRegistration(true);
      setIsLogin(false);
    } else {
      setIsInitialRegistration(false);
      setIsLogin(true);
      setIsEmailSent(false);
      setEmail('');
    }
  };

  const handleLinkedInLogin = async () => {
    if (!linkedInAuthData) return;
    
    setIsLinkedInLoading(true);
    try {
      const { clientId, redirectUri, scope } = linkedInAuthData;
      const state = crypto.randomUUID();
      localStorage.setItem('linkedin_state', state);
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.location.href = authUrl;
    } catch (error) {
      dispatch(showToast({ 
        message: 'Failed to initiate LinkedIn login', 
        type: 'error' 
      }));
      setIsLinkedInLoading(false);
    }
  };

  // Render initial registration form
  if (isInitialRegistration) {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Start Your Registration
        </h2>
        
        {!isEmailSent ? (
          <>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address to begin the registration process. We'll send you a verification link to continue.
            </p>
            
            <form onSubmit={handleInitialRegistrationSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Verification Link'}
              </LoadingButton>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <span className="font-medium">{email}</span>. 
              Please click the link to continue with your registration.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false)
                setIsSubmitting(false)
              }}
              className="text-indigo-600 hover:underline focus:outline-none"
            >
              Try a different email
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => {
                setIsInitialRegistration(false);
                setIsLogin(true);
                setIsEmailSent(false);
                setEmail('');
              }} 
              className="text-indigo-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Render login form
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            label="Password"
          />
        </div>
        <LoadingButton
          type="submit"
          isLoading={isLoggingIn}
          className="w-full"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </LoadingButton>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={isLinkedInLoading || isLinkedInAuthLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaLinkedin className="h-5 w-5 text-[#0077B5] mr-2" />
            <span>{isLinkedInLoading ? 'Connecting...' : 'Sign in with LinkedIn'}</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="mb-2">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button onClick={toggleMode} className="text-indigo-600 hover:underline focus:outline-none">
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
