import React, { useCallback, useMemo } from 'react';
import { useGetIndustriesQuery, useGetServicesQuery, useGetSectorsQuery, useGetStatesQuery } from '../../../redux/services/directoryApi';
import SearchableDropdown, { Option } from '../../common/SearchableDropdown';
import { FiSearch } from 'react-icons/fi';
import { HEADCOUNT_RANGES } from '../../../constants';

type FilterType = 'industry' | 'service' | 'sector' | 'state' | 'headcountRanges';

interface FilterSidebarProps {
  selected: {
    [key in FilterType]?: string[];
  };
  onChange: (filterId: FilterType, values: string[]) => void;
  onSearch: (term: string) => void;
  searchPlaceholder?: string;
}

interface FilterOption {
  id: string;
  name: string;
  [key: string]: any;
}

const mapToOptions = (items?: FilterOption[]): Option[] => 
  items?.map(({ name }) => ({
    value: String(name),
    label: String(name)
  })) || [];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selected,
  onChange,
  onSearch,
  searchPlaceholder = 'Search...'
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Fetch filter options
  const { data: industries, isLoading: isLoadingIndustries } = useGetIndustriesQuery();
  const { data: services, isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: sectors, isLoading: isLoadingSectors } = useGetSectorsQuery();
  const { data: states, isLoading: isLoadingStates } = useGetStatesQuery();

  // Handle search with debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: FilterType, selected: string[]) => {
    onChange(filterId, selected);
  }, [onChange]);

  // Define filters with their options
  const filters = useMemo(() => [
    {
      id: 'industry' as const,
      label: 'Industry',
      options: mapToOptions(industries?.data),
      isLoading: isLoadingIndustries
    },
    {
      id: 'service' as const,
      label: 'Service',
      options: mapToOptions(services?.data),
      isLoading: isLoadingServices
    },
    {
      id: 'sector' as const,
      label: 'Sector',
      options: mapToOptions(sectors?.data),
      isLoading: isLoadingSectors
    },
    {
      id: 'state' as const,
      label: 'State',
      options: mapToOptions(states?.data),
      isLoading: isLoadingStates
    },
    {
      id: 'headcountRanges' as const,
      label: 'Headcount',
      options: HEADCOUNT_RANGES.map(range => ({
        value: range,
        label: range
      }))
    }
  ], [industries, services, sectors, states, isLoadingIndustries, isLoadingServices, isLoadingSectors, isLoadingStates]);

  // Get selected options for a filter
  const getSelectedOptions = (filterId: FilterType): Option[] => {
    const values = selected[filterId] || [];
    return values.map(value => ({
      value,
      label: value
    }));
  };

  return (
    <aside className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="space-y-4">
          {filters.map(({ id, label, options, isLoading }) => (
            <SearchableDropdown
              key={id}
              label={label}
              options={options}
              selected={getSelectedOptions(id)}
              onChange={(selected) => handleFilterChange(id, selected.map(opt => opt.value))}
              isLoading={isLoading}
              placeholder={`Select ${label.toLowerCase()}...`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

FilterSidebar.displayName = 'FilterSidebar';

export type { FilterType };
export default FilterSidebar;