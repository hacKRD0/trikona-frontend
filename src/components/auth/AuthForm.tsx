// components/AuthForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation, useRequestVerificationLinkMutation, useGetLinkedInAuthUrlQuery } from '../../redux/services/authApi';
import { AppDispatch, RootState } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/toastSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';
import PasswordInput from '../common/PasswordInput';
import LoadingButton from '../common/LoadingButton';
import { isStrongPassword } from '../../utils/passwordUtils';

interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  linkedinUrl?: string;
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedinUrl: '',
  });
  const [isLinkedInLoading, setIsLinkedInLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
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

    if (!isLogin) {
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
      try {
        await register(formData as any).unwrap();
        dispatch(showToast({ 
          message: 'Registration successful! Please check your email for verification link.', 
          type: 'success' 
        }));
        setIsLogin(true);
      } catch (err: any) {
        dispatch(showToast({ message: err?.data?.error || 'Registration failed', type: 'error' }));
      }
    } else {
      try {
        const result = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        
        // Only set credentials if we have both token and user
        if (result.token && result.user) {
          console.log('Result : ', result);
          dispatch(setCredentials({ token: result.token, user: result.user }));
          dispatch(showToast({ message: 'Login successful!', type: 'success' }));
          // Redirect to the landing page (dashboard)
          navigate('/');
        } else {
          dispatch(showToast({ message: 'Login failed: Invalid response from server', type: 'error' }));
        }
      } catch (err: any) {
        dispatch(showToast({ message: err?.data?.error || 'Login failed', type: 'error' }));
      }
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
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Verification Link'}
              </button>
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

  // Render login/registration form
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
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
          </>
        )}
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
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            label="Password"
          />
        </div>
        {!isLogin && (
          <div className="mb-6">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              required
              label="Confirm Password"
            />
          </div>
        )}
        <LoadingButton
          type="submit"
          isLoading={isLogin ? isLoggingIn : isRegistering}
        >
          {isLogin ? 'Login' : 'Register'}
        </LoadingButton>
      </form>
      
      {isLogin && (
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
      )}
      
      <div className="mt-4 text-center">
        {isLogin && (
          <div className="mb-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        )}
        <button onClick={toggleMode} className="text-indigo-600 hover:underline focus:outline-none">
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
      
      {!isLogin && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-indigo-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      )}
      
      {!isLogin && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Note: Email registration requires manual verification by an administrator. 
            For faster access, consider using LinkedIn authentication.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
