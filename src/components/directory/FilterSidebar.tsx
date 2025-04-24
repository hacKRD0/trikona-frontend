import React from 'react';

export interface FilterOption {
  id: string;
  label: string;
  options: string[];
}

export interface FilterSidebarProps {
  filters: FilterOption[];
  selected: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selected,
  onChange,
}) => {
  console.log('filters:', filters);
  console.log('selected:', selected);
  return (
    <aside className="w-64 p-4 bg-white border rounded-lg space-y-6">
      {filters.map(({ id, label, options }) => (
        <div key={id}>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">{label}</h4>
          <div className="space-y-1">
            {options.map((opt) => {
              const checked = selected[id]?.includes(opt) ?? false;
              return (
                <label key={opt} className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={checked}
                    onChange={() => {
                      const curr = selected[id] || [];
                      const next = curr.includes(opt)
                        ? curr.filter((v) => v !== opt)
                        : [...curr, opt];
                      console.log('id:', id, 'next:', next);
                      onChange(id, next);
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default FilterSidebar;
