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

/** Only the filters relevant to students */
export interface StudentFilters {
  collegeName?: string[];
  yearOfStudy?: string[];
  level?: string[];
  cgpa?: string[];
  coursesCompleted?: string[];
  skills?: string[];
  certifications?: string[];
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
      PaginatedResponse<User>,   // <-- updated response type
      StudentFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        params.append('role', 'student');

        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length) {
            // join values by comma rather than multiple params
            params.append(key, value.join(','));
          }
        });

        return `directory/students?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetAllStudentsQuery } = directoryApi;
