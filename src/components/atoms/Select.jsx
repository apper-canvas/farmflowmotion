import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ className, children, value, onChange, disabled, ...props }, ref) => {
  const handleOptionClick = (optionValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
  };

  return (
    <div
      className={cn(
        "w-full max-h-32 overflow-y-auto rounded-md border-2 border-earth-200 bg-white text-sm text-gray-900 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1 transition-colors duration-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const isSelected = child.props.value === value;
          return (
            <div
              key={child.props.value}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors duration-150 border-b border-earth-100 last:border-b-0",
                isSelected 
                  ? "bg-primary-100 text-primary-700 font-medium" 
                  : "hover:bg-earth-50",
                disabled && "cursor-not-allowed"
              )}
              onClick={() => handleOptionClick(child.props.value)}
            >
              {child.props.children}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
});

Select.displayName = "Select";

export default Select;