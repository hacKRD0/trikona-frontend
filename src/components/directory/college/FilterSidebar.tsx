import React, { useCallback, useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import SearchableDropdown, { Option } from '../../common/SearchableDropdown';
import type { MultiValue } from 'react-select';

export type FilterType = 'state' | 'programs' | 'accreditation';

export interface FilterOption {
  id: FilterType;
  label: string;
  options: Option[];
  isLoading?: boolean;
}

export interface FilterSidebarProps {
  filters: FilterOption[];
  selected: Record<FilterType, string[]>;
  onChange: (filterId: FilterType, values: string[]) => void;
  onSearch: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ 
  filters, 
  selected, 
  onChange,
  onSearch,
  searchPlaceholder = 'Search colleges...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);
  const getSelectedOptions = useCallback((filterId: FilterType) => {
    const values = selected[filterId] || [];
    return values.map(value => ({
      value,
      label: value
    }));
  }, [selected]);

  const handleDropdownChange = useCallback(<T extends FilterType>(filterId: T) => 
    (selectedOptions: MultiValue<Option> | null) => {
      const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
      onChange(filterId, values);
    },
    [onChange]
  );

  return (
    <aside className="w-72 bg-white p-4 border rounded-lg overflow-hidden">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="h-[calc(100vh-18rem)] overflow-y-auto space-y-4">
        {filters.map(({ id, label, options, isLoading }) => (
          
            <SearchableDropdown
              label={label}
              options={options}
              selected={getSelectedOptions(id)}
              onChange={handleDropdownChange(id)}
              isLoading={isLoading}
              placeholder={`Select ${label.toLowerCase()}...`}
            />
          
        ))}
      </div>
    </aside>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
