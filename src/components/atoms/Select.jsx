import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ className, children, value, onChange, disabled, placeholder, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOptionClick = (optionValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Find selected option text
  const selectedOption = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.props.value === value
  );
  
  const displayText = selectedOption ? selectedOption.props.children : (placeholder || 'Select an option');

  return (
    <div className="relative" ref={ref}>
      <div
        className={cn(
          "w-full px-3 py-2 rounded-md border-2 border-earth-200 bg-white text-sm text-gray-900 cursor-pointer focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-200",
          disabled && "cursor-not-allowed opacity-50 bg-gray-50",
          !value && !selectedOption && "text-gray-500",
          className
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">{displayText}</span>
          <div className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-md border border-earth-200 bg-white shadow-lg">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type === 'option') {
              const isSelected = child.props.value === value;
              return (
                <div
                  key={child.props.value || index}
                  className={cn(
                    "px-3 py-2 cursor-pointer transition-colors duration-150 border-b border-earth-100 last:border-b-0",
                    isSelected 
                      ? "bg-primary-100 text-primary-700 font-medium" 
                      : "hover:bg-earth-50",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => handleOptionClick(child.props.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {child.props.children}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;