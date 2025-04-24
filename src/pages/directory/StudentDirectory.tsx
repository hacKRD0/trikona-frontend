// src/pages/StudentDirectory.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setFilter } from '../../redux/slices/directorySlice';
import { useGetAllStudentsQuery } from '../../redux/services/directoryApi';
import FilterSidebar, { FilterOption } from '../../components/directory/FilterSidebar';
import ProfileCard from '../../components/directory/ProfileCard';

const studentFiltersConfig: FilterOption[] = [
  { id: 'collegeName',         label: 'College',           options: ['Liberal Arts College', 'Example University', 'Tech Institute'] },
  { id: 'yearOfStudy',     label: 'Year of Study',     options: ['1','2','3','4'] },
  { id: 'fieldOfStudy',           label: 'Field of Study',     options: ['Tech Institute','Liberal Arts College','State College'] },
  { id: 'mincgpa',             label: 'Minimum CGPA',               options: ['0','2.0','4.0','6.0'] },
  { id: 'coursesCompleted',label: 'Courses Completed', options: ['React','Node','SQL'] },
  { id: 'skills',          label: 'Skills',            options: ['AutoCAD','Concrete Design','Surveying','Estimating'] },
  { id: 'certifications',  label: 'Certifications',    options: ['AWS','GCP','Azure'] },
];

type Skill = { name: string; ID: number }

const StudentDirectory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFilters = useSelector((s: RootState) => s.directory.filters);

  // response: { data: Student[], page, pageSize, totalItems }
  const { data: response, isLoading, isError } = useGetAllStudentsQuery(selectedFilters);

  // fall back to empty array
  const students = response?.data ?? [];

  if (isError) {
    return <div className="p-4 text-red-600">Failed to load students. Please try again.</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <FilterSidebar
        filters={studentFiltersConfig}
        selected={selectedFilters}
        onChange={(filterId, values) =>
          dispatch(setFilter({ filterId, values }))
        }
      />

      {/* Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-56 rounded-lg"
              />
            ))
          : students.map((stu) => {
              const { user, educations } = stu;
              const name = `${user.firstName} ${user.lastName}`;
              const major = educations[0]?.fieldOfStudy ?? '';
              const degree = educations[0]?.degree ?? '';

              return (
                <ProfileCard
                  key={user.ID}
                  avatarUrl={user.avatarUrl}
                  name={name}
                  degree={degree}
                  major={major}
                  linkedInUrl={user.linkedInUrl || 'https://www.linkedin.com'}
                />
              );
            })}
      </div>
    </div>
  );
};

export default StudentDirectory;
