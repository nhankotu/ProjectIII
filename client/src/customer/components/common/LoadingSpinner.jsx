import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  size = "default",
  className = "",
  text = "Đang tải...",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4", className)}
    >
      <Loader2
        className={cn("animate-spin text-blue-600", sizeClasses[size])}
      />
      {text && <p className="text-sm text-gray-500 mt-2">{text}</p>}
    </div>
  );
};

// Variants for different use cases
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="xl" text="Đang tải dữ liệu..." />
  </div>
);

export const ButtonLoader = ({ size = "sm" }) => (
  <LoadingSpinner size={size} text="" className="p-0" />
);

export const InlineLoader = () => (
  <LoadingSpinner text="" className="flex-row gap-2 p-2" />
);

export default LoadingSpinner;
