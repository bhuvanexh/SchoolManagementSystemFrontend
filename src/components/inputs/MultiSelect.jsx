import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const normalize = (value) => String(value ?? '');

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedValues = useMemo(() => value.map((item) => normalize(item)), [value]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(normalize(option.value))),
    [options, selectedValues]
  );

  const updateValue = (nextValues) => {
    onChange?.(nextValues);
  };

  const toggleValue = (optionValue) => {
    const normalizedValue = normalize(optionValue);
    const nextValues = selectedValues.includes(normalizedValue)
      ? selectedValues.filter((item) => item !== normalizedValue)
      : [...selectedValues, normalizedValue];

    updateValue(nextValues);
  };

  const removeValue = (optionValue) => {
    const normalizedValue = normalize(optionValue);
    updateValue(selectedValues.filter((item) => item !== normalizedValue));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="input-field relative flex min-h-12 flex-wrap items-center gap-2 text-left"
        onClick={() => setIsOpen((current) => !current)}
      >
        {selectedOptions.length ? (
          selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary"
            >
              {option.label}
              <span
                role="button"
                tabIndex={0}
                className="cursor-pointer hover:text-error"
                onClick={(event) => {
                  event.stopPropagation();
                  removeValue(option.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    removeValue(option.value);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </button>

      {isOpen ? (
        <div className="glass-panel-sm custom-scrollbar absolute z-50 mt-1 max-h-60 w-full overflow-y-auto p-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="input-field mb-2"
          />

          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const checked = selectedValues.includes(normalize(option.value));

              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-surface-container"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue(option.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm text-on-surface">{option.label}</span>
                </label>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-on-surface-variant">No matching subjects found.</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
