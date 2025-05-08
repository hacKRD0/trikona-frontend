export const ROLES = {
  STUDENT: 'student',
  PROFESSIONAL: 'professional',
  INSTRUCTOR: 'instructor',
  COMPANY_ADMIN: 'company-admin',
  COMPANY_MODERATOR: 'company-moderator',
  COLLEGE_ADMIN: 'college-admin',
  COLLEGE_MODERATOR: 'college-moderator',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
}

export const FIELDS_OF_STUDY = [
  "Civil Engineering", "Structural Engineering", "Geotechnical Engineering", "Traffic Engineering"
]

export const LEVELS_OF_STUDY = [
  "Bachelors", "Masters", "High School", "Diploma"
]

export const HEADCOUNT_RANGES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;

export const CORPORATE_FILTER_KEYS = {
  SEARCH: 'searchTerm',
  INDUSTRY: 'industries',
  SERVICE: 'services',
  SECTOR: 'sectors',
  STATE: 'states',
  HEADCOUNT: 'headCountRanges'
} as const;
