import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:from-primary-700 hover:to-primary-600 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-primary-500",
    secondary: "bg-gradient-to-r from-earth-200 to-earth-100 text-earth-800 border border-earth-300 hover:from-earth-300 hover:to-earth-200 hover:shadow-md hover:scale-[1.02] focus-visible:ring-earth-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-400 text-white shadow-md hover:from-accent-600 hover:to-accent-500 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-accent-500",
    outline: "border-2 border-primary-500 text-primary-700 bg-white hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-[1.02] focus-visible:ring-primary-500",
    ghost: "text-primary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-[1.02] focus-visible:ring-primary-500"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-6 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;