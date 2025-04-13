import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PasswordResetState {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PasswordResetState = {
  password: '',
  confirmPassword: '',
  isLoading: false,
  error: null,
};

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      state.error = null;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      state.password = '';
      state.confirmPassword = '';
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setPassword,
  setConfirmPassword,
  setLoading,
  setError,
  resetState,
} = passwordResetSlice.actions;

export default passwordResetSlice.reducer; 