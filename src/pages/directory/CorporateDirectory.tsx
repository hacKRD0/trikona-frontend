import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllCorporatesQuery } from '../../redux/services/directoryApi';
import FilterSidebar, { type FilterType } from '../../components/directory/corporate/FilterSideBar';
import ProfileCard from '../../components/directory/corporate/ProfileCard';

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

const CorporateDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Get filter values from URL or default to empty arrays
  const selectedFilters = useMemo(() => ({
    industry: parseArrayParam(searchParams.get('industry')),
    service: parseArrayParam(searchParams.get('service')),
    sector: parseArrayParam(searchParams.get('sector')),
    state: parseArrayParam(searchParams.get('state')),
    headcountRanges: parseArrayParam(searchParams.get('headcountRanges'))
  } as const), [searchParams]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Prepare API filters
  const apiFilters = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    industries: selectedFilters.industry,
    services: selectedFilters.service,
    sectors: selectedFilters.sector,
    states: selectedFilters.state,
    headCountRanges: selectedFilters.headcountRanges,
    page: 1,
    pageSize: 20,
  }), [searchTerm, selectedFilters]);

  // Fetch data
  const { 
    data: response, 
    isLoading: isLoadingCorporates, 
    isError 
  } = useGetAllCorporatesQuery(apiFilters);
  
  const corporates = response?.data ?? [];
  
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
            Failed to load corporates. Please try again.
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
          <h1 className="text-2xl font-semibold text-gray-900">Corporate Directory</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 relative">
            <div className="sticky top-6">
              <FilterSidebar 
                selected={{
                  industry: selectedFilters.industry,
                  service: selectedFilters.service,
                  sector: selectedFilters.sector,
                  state: selectedFilters.state,
                  headcountRanges: selectedFilters.headcountRanges
                }}
                onSearch={handleSearch}
                onChange={handleFilterChange}
                searchPlaceholder="Search companies..."
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Results summary */}
            <div className="mb-4">
              <p className="text-gray-600">
                {isLoadingCorporates ? 'Loading...' : `${corporates.length} companies found`}
              </p>
            </div>

            {/* Grid with consistent card sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingCorporates ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-lg shadow-sm h-[280px] w-full"
                  />
                ))
              ) : corporates.length > 0 ? (
                // Company cards
                corporates.map((corporate) => (
                  <div key={corporate.id} className="h-full w-full">
                    <ProfileCard
                      logoUrl={corporate.logo || corporate.logoUrl}
                      companyName={corporate.companyName}
                      headCount={corporate.headCount}
                      jobsPosted={corporate.jobsPosted || 0}
                    />
                  </div>
                ))
              ) : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500 mb-2">No companies found</p>
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

export default CorporateDirectory;
