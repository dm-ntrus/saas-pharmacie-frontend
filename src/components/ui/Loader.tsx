import React from "react";
import { cn } from "@/utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const Loader: React.FC<LoaderProps> = ({ size = "md", className }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Chargement"
    />
  );
};

export { Loader };
