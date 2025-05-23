import React, { useCallback, useMemo } from 'react';
import SearchableDropdown, { Option } from '../../common/SearchableDropdown';
import type { MultiValue } from 'react-select';
import { useGetCollegeMastersQuery, useGetSkillMastersQuery } from '../../../redux/services/directoryApi';

// Types are now imported from the API

export interface FilterOption {
  id: string;
  label: string;
  options: string[];
  isApiBased?: boolean;
}

export interface FilterSidebarProps {
  filters: FilterOption[];
  selected: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ filters, selected, onChange }) => {
  // Fetch college and skill options from API
  const { data: collegesData } = useGetCollegeMastersQuery();
  const { data: skillsData } = useGetSkillMastersQuery();

  // Transform API data to options format
  const apiOptions = useMemo(() => ({
    collegeName: (collegesData?.data || []).map((college) => ({
      value: college.name,
      label: college.name
    })),
    skills: (skillsData?.data || []).map((skill) => ({
      value: skill.name,
      label: skill.name
    }))
  }), [collegesData, skillsData]);

  // Merge static and API-based options
  const filterOptions = useMemo(() => {
    const options: Record<string, Option[]> = {};
    
    filters.forEach(({ id, options: filterOptions, isApiBased }) => {
      if (isApiBased && apiOptions[id as keyof typeof apiOptions]) {
        options[id] = apiOptions[id as keyof typeof apiOptions];
      } else {
        options[id] = filterOptions.map(option => ({
          value: option,
          label: option
        }));
      }
    });
    
    return options;
  }, [filters, apiOptions]);
  
  // Get selected options in the format expected by SearchableDropdown
  const getSelectedOptions = useCallback((filterId: string) => {
    const values = selected[filterId] || [];
    return values.map(value => ({
      value,
      label: value
    }));
  }, [selected]);

  // Handle dropdown changes
  const handleDropdownChange = useCallback((filterId: string) => 
    (selectedOptions: MultiValue<Option> | null) => {
      const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
      onChange(filterId, values);
    },
    [onChange]
  );

  return (
    <aside className="w-72 bg-white p-4 border rounded-lg overflow-hidden">
      <div className="h-[calc(100vh-12rem)] overflow-y-auto space-y-4">
        {filters.map(({ id, label }) => (
            <SearchableDropdown
              label={label}
              options={filterOptions[id] || []}
              selected={getSelectedOptions(id)}
              onChange={handleDropdownChange(id)}
            />
        ))}
      </div>
    </aside>
  );
});

export default FilterSidebar;
