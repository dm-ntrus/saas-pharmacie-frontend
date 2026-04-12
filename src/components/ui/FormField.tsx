"use client";

import React from "react";
import { useFormContext, Controller, type FieldValues, type Path } from "react-hook-form";
import { Input } from "./Input";
import { Select, type SelectOption } from "./Select";
import { cn } from "@/utils/cn";

interface FormFieldBaseProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

interface FormInputProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  type?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  className,
  type = "text",
  placeholder,
  leftIcon,
  disabled,
  min,
  max,
  step,
}: FormInputProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        leftIcon={leftIcon}
        disabled={disabled}
        error={error?.message as string}
        {...register(name, { valueAsNumber: type === "number" })}
        min={min}
        max={max}
        step={step}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

interface FormSelectProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  className,
  options,
  placeholder,
  disabled,
}: FormSelectProps<T>) {
  const { control, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            options={options}
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            error={error?.message as string}
          />
        )}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

interface FormTextareaProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  className,
  placeholder,
  rows = 3,
  disabled,
  maxLength,
}: FormTextareaProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
          "placeholder:text-slate-400 dark:bg-slate-800 dark:text-slate-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-slate-300 dark:border-slate-600",
        )}
        {...register(name)}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message as string}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

interface FormCheckboxProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  description?: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
}: FormCheckboxProps<T>) {
  const { register } = useFormContext<T>();

  return (
    <label className={cn("flex items-start gap-3 cursor-pointer", className)}>
      <input
        type="checkbox"
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        {...register(name)}
      />
      <div>
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        )}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
    </label>
  );
}
