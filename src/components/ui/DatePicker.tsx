"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Calendar } from "lucide-react";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  label?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, min, max, label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            min={min}
            max={max}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-slate-800 dark:text-slate-100",
              "dark:[color-scheme:dark]",
              error
                ? "border-red-300 focus:ring-red-500 dark:border-red-600"
                : "border-slate-300 focus:ring-emerald-500 dark:border-slate-600",
              className,
            )}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);
DatePicker.displayName = "DatePicker";

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  min?: string;
  max?: string;
  startLabel?: string;
  endLabel?: string;
  error?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  min,
  max,
  startLabel = "Date début",
  endLabel = "Date fin",
  error,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <DatePicker
        value={startDate}
        onChange={onStartChange}
        min={min}
        max={endDate || max}
        label={startLabel}
        error={error}
      />
      <DatePicker
        value={endDate}
        onChange={onEndChange}
        min={startDate || min}
        max={max}
        label={endLabel}
      />
    </div>
  );
}
