import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useGetAllCorporatesQuery } from '../../redux/services/directoryApi';
import FilterSidebar from '../../components/directory/corporate/FilterSideBar';
import ProfileCard from '../../components/directory/corporate/ProfileCard';

const CorporateDirectory: React.FC = () => {
  const selectedFilters = useSelector((s: RootState) => s.directory.filters);

  // Transform redux filters into API parameters
  const apiFilters = {
    searchTerm: selectedFilters['searchTerm']?.[0] ?? '',
    industries: selectedFilters['industry']?.[0] ?? '',
    services: selectedFilters['service']?.[0] ?? '',
    sectors: selectedFilters['sector']?.[0] ?? '',
    states: selectedFilters['state']?.[0] ?? '',
    headCountRanges: selectedFilters['headcountRanges'] ?? [],
    page: 1,
    pageSize: 20,
  };

  const { data: response, isLoading, isError } = useGetAllCorporatesQuery(apiFilters);
  const corporates = response?.data ?? [];

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto flex">
        <div className="w-72 pr-4">
          <FilterSidebar />
        </div>
        
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Corporate Directory</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Loading...' : `${corporates.length} companies found`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {corporates.map((corporate) => (
              <ProfileCard 
                key={corporate.id}
                logoUrl={corporate.logo || corporate.logoUrl}
                companyName={corporate.companyName}
                headCount={corporate.headCount}
                jobsPosted={corporate.jobsPosted || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDirectory;
