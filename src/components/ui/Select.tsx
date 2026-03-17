"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const selectVariants = cva(
  "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 appearance-none cursor-pointer",
  {
    variants: {
      state: {
        default:
          "border-slate-300 focus:ring-emerald-500 dark:border-slate-600",
        error: "border-red-300 focus:ring-red-500 dark:border-red-600",
      },
    },
    defaultVariants: { state: "default" },
  },
);

export interface SelectProps extends VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  searchable?: boolean;
  className?: string;
  id?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Sélectionner...",
      disabled = false,
      error,
      label,
      searchable = false,
      className,
      id,
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    if (!searchable) {
      return (
        <div className="w-full" ref={ref}>
          {label && (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <select
              id={inputId}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                selectVariants({ state: error ? "error" : "default" }),
                "pr-10",
                className,
              )}
              aria-invalid={!!error}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <SearchableSelect
        ref={ref}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        label={label}
        className={className}
        id={inputId}
      />
    );
  },
);
Select.displayName = "Select";

interface SearchableSelectInnerProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  id?: string;
}

const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectInnerProps>(
  ({ options, value, onChange, placeholder, disabled, error, label, className, id }, ref) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(
      () =>
        options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        ),
      [options, query],
    );

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          setQuery("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div ref={containerRef} className="relative">
          <button
            type="button"
            id={id}
            disabled={disabled}
            onClick={() => !disabled && setOpen(!open)}
            className={cn(
              selectVariants({ state: error ? "error" : "default" }),
              "pr-10 text-left",
              !selected && "text-slate-400 dark:text-slate-500",
              className,
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            {selected ? selected.label : placeholder}
          </button>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            {value && (
              <button
                type="button"
                className="pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.("");
                  setOpen(false);
                }}
              >
                <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform",
                open && "rotate-180",
              )}
            />
          </div>

          {open && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-auto p-1" role="listbox">
                {filtered.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                    Aucun résultat
                  </li>
                ) : (
                  filtered.map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === value}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors",
                        opt.value === value
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
                        opt.disabled && "opacity-50 pointer-events-none",
                      )}
                      onClick={() => {
                        if (!opt.disabled) {
                          onChange?.(opt.value);
                          setOpen(false);
                          setQuery("");
                        }
                      }}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {opt.value === value && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);
SearchableSelect.displayName = "SearchableSelect";
