import React, { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';

type SearchableDropdownProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Search...',
  label,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Reset debouncedQuery when query is cleared
  useEffect(() => {
    if (query === '') {
      setDebouncedQuery('');
    }
  }, [query]);

  const filteredOptions = useMemo(() => {
    return debouncedQuery === ''
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
  }, [options, debouncedQuery]);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          value={query || selected}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-3 pr-3 bg-white">
          {(query || selected) && (
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500 -ml-10"
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
                onChange('');
              }}
              aria-label="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
          <button 
            className="flex items-center px-2 focus:outline-none -ml-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div 
              key={option}
              className={`relative cursor-default select-none py-2 pl-8 pr-4 hover:bg-indigo-600 hover:text-white text-gray-900`}
              onClick={() => {
                onChange(option);
                setQuery('');
                setIsOpen(false);
              }}
            >
              <span className={`block truncate ${selected === option ? 'font-semibold' : 'font-normal'}`}>
                {option}
              </span>
              {selected === option && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600">
                  <FaCheck className="h-5 w-5" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
