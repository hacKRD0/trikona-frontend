// src/redux/services/directoryApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'student' | 'professional' | 'company' | 'college';
  [key: string]: any;
}

/** Filters for student directory */
export interface StudentFilters {
  collegeName?: string[];
  level?: string[];
  cgpaRanges?: string[];
  yearOfStudy?: string[];
  company?: string[];
  title?: string[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  skills?: string[];
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
}

export const directoryApi = createApi({
  reducerPath: 'directoryApi',
  baseQuery,
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    /** Fetches *only* students, with optional student-specific filters */
    getAllStudents: builder.query<
      PaginatedResponse<User>,
      StudentFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        // params.append('role', 'student');

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value) && value.length > 0) {
              params.append(key, value.join(','));
            } else if (typeof value === 'string' || typeof value === 'number') {
              params.append(key, value.toString());
            }
          }
        });
        if (params.toString() === '') {
          return 'directory/students';
        }
        return `directory/students?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetAllStudentsQuery } = directoryApi;
