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
  page?: number;
  pageSize?: number;
  totalItems?: number;
}

/** Corporate filters */
interface CorporateFilters {
  searchTerm?: string;
  industry?: string;
  service?: string;
  sector?: string;
  state?: string;
  headcountRanges?: string[];
  page?: number;
  pageSize?: number;
}

interface Corporate {
  id: string;
  name: string;
  industry: string;
  service: string;
  sector: string;
  state: string;
  headcount: number;
  [key: string]: any;
}

// Add interface for corporate filter options
interface CorporateFilterOptions {
  industries: string[];
  services: string[];
  sectors: string[];
  states: string[];
}

interface Industry {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Sector {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  country: Country;
}

interface Country {
  id: string;
  name: string;
  iso_code: string;
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
        let hasParams = false;

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value) && value.length > 0) {
              params.append(key, value.join(','));
              hasParams = true;
            } else if (typeof value === 'string' || typeof value === 'number') {
              params.append(key, value.toString());
              hasParams = true;
            }
          }
        });

        return {
          url: 'directory/students',
          ...(hasParams ? { params } : {})
        };
      },
    }),
    
    /** Fetches *only* corporates, with optional corporate-specific filters */
    getAllCorporates: builder.query<
      PaginatedResponse<Corporate>,
      CorporateFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        let hasParams = false;

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value) && value.length > 0) {
              params.append(key, value.join(','));
              hasParams = true;
            } else if (typeof value === 'string' || typeof value === 'number') {
              params.append(key, value.toString());
              hasParams = true;
            }
          }
        });

        return {
          url: 'directory/corporates',
          ...(hasParams ? { params } : {})
        };
      },
    }),

    /** Get all industry options */
    getIndustries: builder.query<PaginatedResponse<Industry>, void>({
      query: () => ({ url: 'directory/masters/industries' }),
    }),

    /** Get all service options */
    getServices: builder.query<PaginatedResponse<Service>, void>({
      query: () => ({ url: 'directory/masters/services' }),
    }),

    /** Get all sector options */
    getSectors: builder.query<PaginatedResponse<Sector>, void>({
      query: () => ({ url: 'directory/masters/sectors' }),
    }),

    /** Get all state options */
    getStates: builder.query<PaginatedResponse<State>, void>({
      query: () => ({ url: 'directory/masters/states' }),
    }),
  }),
});

export const { 
  useGetAllStudentsQuery,
  useGetAllCorporatesQuery,
  useGetIndustriesQuery,
  useGetServicesQuery,
  useGetSectorsQuery,
  useGetStatesQuery
} = directoryApi;
