// components/ResetPasswordForm.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../redux/services/authApi';
import { isStrongPassword, getPasswordRequirementsMessage } from '../../utils/passwordUtils';
import PasswordInput from '../common/PasswordInput';
import LoadingButton from '../common/LoadingButton';
import {
  setPassword,
  setConfirmPassword,
  setLoading,
  setError,
  resetState,
} from '../../redux/slices/passwordResetSlice';
import { RootState } from '../../redux/store';

const ResetPasswordForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { password, confirmPassword, isLoading, error } = useSelector(
    (state: RootState) => state.passwordReset
  );

  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    // Clean up state when component unmounts
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      dispatch(setError('Invalid or expired reset link. Please request a new one.'));
      navigate('/auth/forgot-password');
      return;
    }

    if (!isStrongPassword(password)) {
      dispatch(setError(getPasswordRequirementsMessage()));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match.'));
      return;
    }

    try {
      dispatch(setLoading(true));
      await resetPassword({ token, password }).unwrap();
      toast.success('Password reset successful. Please login with your new password.');
      navigate('/auth/login');
    } catch (error) {
      dispatch(setError('Failed to reset password. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              placeholder="New Password"
              required
              className="rounded-t-md"
              showLabel={false}
            />
            <PasswordInput
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
              placeholder="Confirm Password"
              required
              className="rounded-b-md"
              showLabel={false}
            />
          </div>

          <LoadingButton type="submit" isLoading={isLoading}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
