import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

const SelectInput = forwardRef(
  (
    {
      label,
      options = [],
      placeholder = 'Select an option',
      className = '',
      value = '',
      onChange,
      onBlur,
      disabled = false,
      name,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const openDropdown = () => {
      if (disabled) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
      setOpen(true);
    };

    const closeDropdown = () => setOpen(false);

    useEffect(() => {
      if (!open) return;
      const onMouseDown = (e) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target) &&
          !buttonRef.current.contains(e.target)
        ) {
          closeDropdown();
        }
      };
      const onKey = (e) => { if (e.key === 'Escape') closeDropdown(); };
      const onScroll = () => closeDropdown();

      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('keydown', onKey);
      window.addEventListener('scroll', onScroll, true);
      return () => {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('scroll', onScroll, true);
      };
    }, [open]);

    const selectedOption = options.find((o) => String(o.value) === String(value));

    const dropdown = open
      ? createPortal(
          <div
            ref={containerRef}
            style={dropdownStyle}
            className="max-h-56 overflow-y-auto rounded-glass-sm border border-white/50 bg-white/95 shadow-glass-md backdrop-blur-sm"
          >
            <div className="py-1">
              {options.length === 0 ? (
                <div className="px-4 py-2.5 text-sm text-on-surface-variant/60">No options</div>
              ) : (
                options.map((option) => {
                  const isSelected = String(option.value) === String(value);
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onChange?.(option.value);
                        closeDropdown();
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-primary/10 ${isSelected ? 'font-medium text-primary' : 'text-on-surface'}`}
                    >
                      <span>{option.label}</span>
                      {isSelected ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )
      : null;

    const trigger = (
      <div className={`relative ${className}`.trim()}>
        <button
          ref={(node) => {
            buttonRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="button"
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          onClick={() => (open ? closeDropdown() : openDropdown())}
          className={`input-field flex w-full items-center justify-between gap-2 text-left ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <span className={selectedOption ? 'text-on-surface' : 'text-on-surface-variant/70'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-on-surface-variant transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {dropdown}
      </div>
    );

    if (!label) return trigger;

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </label>
        {trigger}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
