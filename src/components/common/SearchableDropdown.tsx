import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Select, { MultiValue } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

export interface SearchableDropdownProps {
  options: Option[];
  selected: MultiValue<Option>;
  onChange: (value: MultiValue<Option>) => void;
  placeholder?: string;
  label?: string;
  isLoading?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = React.memo(({
  options,
  selected,
  onChange,
  placeholder = 'Search...',
  label,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filtered options based on debounced query
  const filteredOptions = useMemo(() => {
    if (!debouncedQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [options, debouncedQuery]);

  // Memoized change handler
  const handleInputChange = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleChange = useCallback(
    (selectedOptions: MultiValue<Option>): void => {
      onChange(selectedOptions);
    },
    [onChange]
  );

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Select
        isMulti
        options={filteredOptions}
        value={selected}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        className="basic-multi-select"
        classNamePrefix="select"
        isLoading={isLoading}
        loadingMessage={() => 'Loading...'}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? 'No options found' : 'No options available'
        }
      />
    </div>
  );
});

export default SearchableDropdown;
