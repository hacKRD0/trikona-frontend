import React, { useCallback, useMemo } from 'react';
import SearchableDropdown, { Option } from '../../common/SearchableDropdown';
import type { MultiValue } from 'react-select';

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
  // Merge static and API-based options
  const filterOptions = useMemo(() => {
    const options: Record<string, Option[]> = {};
    
    filters.forEach(({ id, options: filterOptions }) => {
      // For now, all options are static
      options[id] = filterOptions.map(option => ({
        value: option,
        label: option
      }));
    });
    
    return options;
  }, [filters]);
  
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
            key={id}
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
