import React, { useCallback } from 'react';

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

const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ filters, selected, onChange }) => {
  console.log('print');
  
  const handleOptionChange = useCallback((id: string, opt: string) => {
    const curr = selected[id] || [];
    const next = curr.includes(opt)
      ? curr.filter((v) => v !== opt)
      : [...curr, opt];
    onChange(id, next.length > 0 ? next : []);
  }, [selected, onChange]);

  return (
    <aside className="w-64 bg-white border rounded-lg overflow-hidden">
      <div className="h-[calc(100vh-8rem)] overflow-y-auto p-4 space-y-6">
        {filters.map(({ id, label, options }) => (
          <div key={id}>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">{label}</h4>
            <div className={`${id === 'yearOfStudy' ? 'flex gap-3 flex-wrap' : 'space-y-1'}`}>
              {options.map((opt) => {
                const checked = selected[id]?.includes(opt) ?? false;
                return (
                  <label 
                    key={opt} 
                    className={`flex items-center text-gray-700 ${id === 'yearOfStudy' ? 'min-w-[60px]' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={() => handleOptionChange(id, opt)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
});

export default FilterSidebar;
