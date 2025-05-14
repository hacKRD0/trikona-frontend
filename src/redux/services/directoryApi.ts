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
  industry?: string[];
  service?: string[];
  sector?: string[];
  state?: string[];
  headcountRanges?: string[];
  page?: number;
  pageSize?: number;
}

/** Professional filters */
export interface ProfessionalFilters {
  searchTerm?: string;
  title?: string[];
  company?: string[];
  skills?: string[];
  experienceYears?: string[];
  state?: string;
  page?: number;
  pageSize?: number;
}

/** College filters */
export interface CollegeFilters {
  searchTerm?: string;
  state?: string;
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

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company?: string;
  skills?: string[];
  experienceYears: number;
  state?: string;
  avatarUrl?: string;
  linkedInUrl?: string;
  [key: string]: any;
}

interface College {
  id: string;
  name: string;
  location?: string;
  state?: string;
  studentCount: number;
  programs?: number;
  logoUrl?: string;
  [key: string]: any;
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

interface CompanyMaster {
  id: string;
  name: string;
}

interface CollegeMaster {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
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

    /** Get all country options */
    getCountries: builder.query<PaginatedResponse<Country>, void>({
      query: () => ({ url: 'directory/masters/countries' }),
    }),

    /** Get all skill options */
    getSkillMasters: builder.query<PaginatedResponse<Skill>, void>({
      query: () => ({ url: 'directory/masters/skills' }),
    }),

    /** Get all company masters options */
    getCompanyMasters: builder.query<PaginatedResponse<CompanyMaster>, void>({
      query: () => ({ url: 'directory/masters/companies' }),
    }),

    /** Get all college masters options */
    getCollegeMasters: builder.query<PaginatedResponse<CollegeMaster>, void>({
      query: () => ({ url: 'directory/masters/colleges' }),
    }),

    /** Fetches *only* professionals, with optional professional-specific filters */
    getAllProfessionals: builder.query<
      PaginatedResponse<Professional>,
      ProfessionalFilters
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
          url: 'directory/professionals',
          ...(hasParams ? { params } : {})
        };
      },
    }),

    /** Fetches *only* colleges, with optional college-specific filters */
    getAllColleges: builder.query<
      PaginatedResponse<College>,
      CollegeFilters
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
          url: 'directory/colleges',
          ...(hasParams ? { params } : {})
        };
      },
    }),
  }),
});

export const { 
  useGetAllStudentsQuery,
  useGetAllCorporatesQuery,
  useGetAllProfessionalsQuery,
  useGetAllCollegesQuery,
  useGetIndustriesQuery,
  useGetServicesQuery,
  useGetSectorsQuery,
  useGetStatesQuery,
  useGetCountriesQuery,
  useGetSkillMastersQuery,
  useGetCompanyMastersQuery,
  useGetCollegeMastersQuery,
} = directoryApi;
