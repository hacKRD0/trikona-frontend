// src/pages/StudentDirectory.tsx
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setFilter } from '../../redux/slices/directorySlice';
import { useGetAllStudentsQuery } from '../../redux/services/directoryApi';
import FilterSidebar, { FilterOption } from '../../components/directory/student/FilterSidebar';
import ProfileCard from '../../components/directory/student/ProfileCard';
import { LEVELS_OF_STUDY, FIELDS_OF_STUDY } from '../../constants';

const studentFiltersConfig: FilterOption[] = [
  { id: 'collegeName',          label: 'College',               options: ['Liberal Arts College', 'Example University', 'Tech Institute'] },
  { id: 'level',                label: 'Level of Study',        options: LEVELS_OF_STUDY },
  { id: 'fieldOfStudy',         label: 'Field of Study',        options: FIELDS_OF_STUDY },
  { id: 'cgpaRanges',           label: 'CGPA Range',            options: ['0.0-2.0', '2.0-4.0', '4.0-6.0', '6.0-8.0', '8.0-10.0'] },
  { id: 'yearOfStudy',          label: 'Year of Study',         options: ['1', '2', '3', '4'] },
  // { id: 'company',              label: 'Company',               options: ['Tech Corp', 'Engineering Solutions', 'Construction Co'] },
  // { id: 'title',                label: 'Job Title',             options: ['Software Engineer', 'Civil Engineer', 'Project Manager'] },
  // { id: 'minExperienceYears',   label: 'Min Experience',        options: ['0', '1', '2', '3', '5'] },
  // { id: 'maxExperienceYears',   label: 'Max Experience',        options: ['2', '3', '5', '10', '15'] },
  { id: 'skills',               label: 'Skills',                options: ['AutoCAD', 'Concrete Design', 'Surveying', 'Estimating', 'Project Management'] },
];



const StudentDirectory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFilters = useSelector((s: RootState) => s.directory.filters);

  // response: { data: Student[], page, pageSize, totalItems }
  const { data: response, isLoading, isError } = useGetAllStudentsQuery(selectedFilters);

  // fall back to empty array
  const students = response?.data ?? [];

  const handleFilterChange = useCallback(
    (filterId: string, values: string[]) => {
      dispatch(setFilter({ filterId, values }));
    },
    [dispatch]
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-4 text-red-600 shadow-sm">
            Failed to load students. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Student Directory</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                filters={studentFiltersConfig}
                selected={selectedFilters}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Grid with consistent card sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-lg shadow-sm h-[280px] w-full"
                  />
                ))
              ) : students.length > 0 ? (
                // Student cards
                students.map((stu) => {
                  const { user, educations } = stu;
                  const name = `${user.firstName} ${user.lastName}`;
                  const major = educations[0]?.fieldOfStudy ?? '';
                  const degree = educations[0]?.degree ?? '';
                  const collegeName = educations[0]?.collegeName ?? '';

                  return (
                    <div key={user.ID} className="h-[280px] w-full">
                      <ProfileCard
                        avatarUrl={user.avatarUrl}
                        name={name}
                        degree={degree}
                        major={major}
                        collegeName={collegeName}
                        linkedInUrl={user.linkedInUrl || 'https://www.linkedin.com'}
                      />
                    </div>
                  );
                })
              ) : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500 mb-2">No students found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters to see more results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDirectory;
