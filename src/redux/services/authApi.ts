// services/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
  message?: string;
  user?: IUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  error?: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
  error?: string;
}

export interface LinkedInAuthPayload {
  code: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  linkedInUrl?: string;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (formData) => ({
        url: 'register',
        method: 'POST',
        body: formData,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (payload) => ({
        url: 'forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: 'reset-password',
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      }),
    }),
    linkedinAuth: builder.mutation<AuthResponse, LinkedInAuthPayload>({
      query: (payload) => ({
        url: 'linkedin/callback',
        method: 'POST',
        body: payload,
      }),
    }),
    updateUserRole: builder.mutation<
      { message: string },
      { token: string; role: string }
    >({
      query: ({ token, role }) => ({
        url: 'update-role',
        method: 'POST',
        body: { role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    requestVerificationLink: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: 'verify',
        method: 'POST',
        body: { email },
      }),
    }),
    getLinkedInAuthUrl: builder.query<{
      clientId: string;
      redirectUri: string;
      scope: string;
    }, void>({
      query: () => ({
        url: 'linkedin/auth-url',
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation<{ message: string, user: IUser }, UpdateUserPayload>({
      query: (payload) => ({
        url: 'users',
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLinkedinAuthMutation,
  useUpdateUserRoleMutation,
  useRequestVerificationLinkMutation,
  useGetLinkedInAuthUrlQuery,
  useUpdateUserMutation,
} = authApi;
