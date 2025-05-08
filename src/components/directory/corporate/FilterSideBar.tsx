import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { setFilter } from '../../../redux/slices/directorySlice';
import { 
  useGetIndustriesQuery,
  useGetServicesQuery,
  useGetSectorsQuery,
  useGetStatesQuery 
} from '../../../redux/services/directoryApi';
import SearchableDropdown from '../../common/SearchableDropdown';
import { HEADCOUNT_RANGES } from '../../../constants';
import { FiSearch, FiX } from 'react-icons/fi';

const FilterSideBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.directory.filters);
  const [searchTerm, setsearchTerm] = useState('');

    // Fetch filter options and extract just the name fields
    const { data: industries } = useGetIndustriesQuery();
    const industryNames = industries?.data?.map(industry => industry.name);

    const { data: services } = useGetServicesQuery();
    const serviceNames = services?.data?.map(service => service.name);

    const { data: sectors } = useGetSectorsQuery();
    const sectorNames = sectors?.data?.map(sector => sector.name);

    const { data: states } = useGetStatesQuery();
    const stateNames = states?.data?.map(state => String(state?.name));

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilter({ filterId: 'searchTerm', values: searchTerm ? [searchTerm] : [] }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const getSingleValue = (key: string) => filters[key]?.[0] || '';
  const headcountValues = filters['headcountRanges'] || [];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(e.target.value);
  };

  const handleDropdownChange = useCallback(
    (filterId: string) => (value: string) => {
      dispatch(setFilter({ filterId, values: value ? [value] : [] }));
    },
    [dispatch]
  );

  const handleHeadcountChange = (range: typeof HEADCOUNT_RANGES[number]) => {
    const curr = headcountValues;
    const next = curr.includes(range)
      ? curr.filter(r => r !== range)
      : [...curr, range];
    dispatch(setFilter({ filterId: 'headcountRanges', values: next }));
  };

  return (
    <aside className="w-72 bg-white p-4 border-r border-gray-200 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Companies
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 sm:text-sm h-12"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setsearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <SearchableDropdown
          label="Industry"
          options={industryNames || []}
          selected={getSingleValue('industry')}
          onChange={handleDropdownChange('industry')}
        />

        <SearchableDropdown
          label="Service"
          options={serviceNames || []}
          selected={getSingleValue('service')}
          onChange={handleDropdownChange('service')}
        />

        <SearchableDropdown
          label="Sector"
          options={sectorNames || []}
          selected={getSingleValue('sector')}
          onChange={handleDropdownChange('sector')}
        />

        <SearchableDropdown
          label="State"
          options={stateNames || []}
          selected={getSingleValue('state')}
          onChange={handleDropdownChange('state')}
        />

        {/* Headcount Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headcount
          </label>
          <div className="space-y-2">
            {HEADCOUNT_RANGES.map(range => (
              <label key={range} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={headcountValues.includes(range)}
                  onChange={() => handleHeadcountChange(range)}
                />
                <span className="ml-3 text-sm text-gray-600">
                  {range} employees
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSideBar;