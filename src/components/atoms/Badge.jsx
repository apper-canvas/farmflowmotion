import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-primary-300"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;