import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Try Redux state first, then localStorage as fallback during transition period
    const token = (getState() as RootState)?.auth?.token || localStorage.getItem('token') || '';

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export default baseQuery;
