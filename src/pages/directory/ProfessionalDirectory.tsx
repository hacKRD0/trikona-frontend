// src/pages/directory/ProfessionalDirectory.tsx
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setFilter } from '../../redux/slices/directorySlice';
import { useGetAllProfessionalsQuery } from '../../redux/services/directoryApi';
import FilterSidebar, { FilterOption } from '../../components/directory/professional/FilterSidebar';
import ProfileCard from '../../components/directory/professional/ProfileCard';

// Define the filter configuration for professionals
const professionalFiltersConfig: FilterOption[] = [
  { id: 'title', label: 'Job Title', options: ['Software Engineer', 'Project Manager', 'Civil Engineer', 'Architect', 'Consultant'] },
  { id: 'company', label: 'Company', options: ['Tech Corp', 'Engineering Solutions', 'Construction Co', 'Design Studio', 'Consultancy Group'] },
  { id: 'experienceYears', label: 'Experience', options: ['0-2', '3-5', '6-10', '10-15', '15-20', '20+'] },
  { id: 'skills', label: 'Skills', options: ['AutoCAD', 'Revit', 'Project Management', 'Structural Design', 'BIM', 'Construction Planning'] },
];

const ProfessionalDirectory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFilters = useSelector((s: RootState) => s.directory.filters);

  // Transform redux filters into API parameters
  const apiFilters = {
    searchTerm: selectedFilters['searchTerm']?.[0] ?? '',
    title: selectedFilters['title'] ?? [],
    company: selectedFilters['company'] ?? [],
    experienceYears: selectedFilters['experienceYears'] ?? [],
    skills: selectedFilters['skills'] ?? [],
    state: selectedFilters['state']?.[0] ?? '',
    page: 1,
    pageSize: 20,
  };

  // Fetch professionals using RTK Query
  const { data: response, isLoading, isError } = useGetAllProfessionalsQuery(apiFilters);
  const professionals = response?.data ?? [];

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
            Failed to load professionals. Please try again.
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
          <h1 className="text-2xl font-semibold text-gray-900">Professional Directory</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                filters={professionalFiltersConfig}
                selected={selectedFilters}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Results summary */}
            <div className="mb-4">
              <p className="text-gray-600">
                {isLoading ? 'Loading...' : `${professionals.length} professionals found`}
              </p>
            </div>

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
              ) : professionals.length > 0 ? (
                // Professional cards
                professionals.map((professional) => {
                  const name = `${professional.firstName} ${professional.lastName}`;
                  
                  return (
                    <div key={professional.id} className="h-[280px] w-full">
                      <ProfileCard
                        avatarUrl={professional.avatarUrl}
                        name={name}
                        title={professional.title}
                        company={professional.company}
                        experienceYears={professional.experienceYears}
                        skills={professional.skills}
                        linkedInUrl={professional.linkedInUrl}
                        location={professional.location || professional.state}
                      />
                    </div>
                  );
                })
              ) : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500 mb-2">No professionals found</p>
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

export default ProfessionalDirectory;
