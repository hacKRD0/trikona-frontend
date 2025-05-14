import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllCollegesQuery, useGetStatesQuery } from '../../redux/services/directoryApi';
import FilterSidebar, { FilterType } from '../../components/directory/college/FilterSidebar';
import ProfileCard from '../../components/directory/college/ProfileCard';
import { Option } from '../../components/common/SearchableDropdown';

// Helper to parse array from URL search params
const parseArrayParam = (param: string | null): string[] => {
  if (!param) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(param));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Helper to stringify array for URL
const stringifyArrayParam = (arr: string[]): string => {
  return encodeURIComponent(JSON.stringify(arr));
};

const CollegeDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Get filter values from URL or default to empty arrays
  const selectedFilters = useMemo(() => ({
    state: parseArrayParam(searchParams.get('state')),
    programs: parseArrayParam(searchParams.get('programs')),
    accreditation: parseArrayParam(searchParams.get('accreditation')),
  }), [searchParams]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Prepare API filters
  const apiFilters = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    states: selectedFilters.state[0] || undefined,
    programs: selectedFilters.programs,
    accreditation: selectedFilters.accreditation,
    page: 1,
    pageSize: 20,
  }), [searchTerm, selectedFilters]);

  // Fetch data
  const { 
    data: response, 
    isLoading: isLoadingColleges, 
    isError 
  } = useGetAllCollegesQuery(apiFilters);
  
  const colleges = response?.data ?? [];
  
  // Fetch filter options
  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery();
  
  // Transform states to options
  const stateOptions = useMemo<Option[]>(() => 
    (statesData?.data || []).map(state => ({
      value: state.name,
      label: state.name
    })), 
    [statesData]
  );
  
  // Define available filters with their options
  const filters = useMemo(() => [
    {
      id: 'state' as const,
      label: 'State',
      options: stateOptions,
      isLoading: isLoadingStates
    },
    {
      id: 'programs' as const,
      label: 'Programs',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Business', label: 'Business' },
        { value: 'Arts', label: 'Arts' },
      ]
    },
    {
      id: 'accreditation' as const,
      label: 'Accreditation',
      options: [
        { value: 'NAAC', label: 'NAAC' },
        { value: 'AICTE', label: 'AICTE' },
        { value: 'UGC', label: 'UGC' },
      ]
    }
  ], [stateOptions, isLoadingStates]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filterId: FilterType, values: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (values.length > 0) {
      newSearchParams.set(filterId, stringifyArrayParam(values));
    } else {
      newSearchParams.delete(filterId);
    }
    
    // Reset to first page when filters change
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);
  


  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-4 text-red-600 shadow-sm">
            Failed to load colleges. Please try again.
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
          <h1 className="text-2xl font-semibold text-gray-900">College Directory</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 relative">
            <div className="sticky top-6">
              <FilterSidebar 
                filters={filters}
                selected={selectedFilters}
                onChange={handleFilterChange}
                onSearch={handleSearch}
                searchPlaceholder="Search by college name..."
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Results summary */}
            <div className="mb-4">
              <p className="text-gray-600">
                {isLoadingColleges ? 'Loading...' : `${colleges.length} colleges found`}
              </p>
            </div>

            {/* Grid with consistent card sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingColleges ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-lg shadow-sm h-[280px] w-full"
                  />
                ))
              ) : colleges.length > 0 ? (
                // College cards
                colleges.map((college) => (
                  <div key={college.ID} className="h-[280px] w-full">
                    <ProfileCard
                      logoUrl={college.logoUrl}
                      collegeName={college.collegeName}
                      studentCount={college.studentCount}
                      location={college.location || college.state}
                      programs={college.programs}
                    />
                  </div>
                ))
              ) : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500 mb-2">No colleges found</p>
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

export default CollegeDirectory;
