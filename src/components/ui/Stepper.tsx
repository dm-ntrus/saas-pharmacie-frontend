"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

export interface StepItem {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <nav className={cn("w-full", className)} aria-label="Progression">
      {/* Desktop: horizontal */}
      <ol className="hidden sm:flex items-center">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "current"
                : "upcoming";

          return (
            <li
              key={index}
              className={cn("flex items-center", index < steps.length - 1 && "flex-1")}
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={cn(
                  "flex items-center gap-3 group",
                  onStepClick && "cursor-pointer",
                  !onStepClick && "cursor-default",
                )}
              >
                <StepIndicator status={status} index={index} />
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium whitespace-nowrap",
                      status === "completed" && "text-emerald-700 dark:text-emerald-400",
                      status === "current" && "text-emerald-600 dark:text-emerald-400",
                      status === "upcoming" && "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 mx-3 h-0.5 rounded-full",
                    index < currentStep
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-700",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="flex flex-col gap-4 sm:hidden">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "current"
                : "upcoming";

          return (
            <li key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  disabled={!onStepClick}
                  className={cn(!onStepClick && "cursor-default")}
                >
                  <StepIndicator status={status} index={index} />
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 mt-2 rounded-full",
                      index < currentStep
                        ? "bg-emerald-500"
                        : "bg-slate-200 dark:bg-slate-700",
                    )}
                  />
                )}
              </div>
              <div className="pb-4 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    status === "completed" && "text-emerald-700 dark:text-emerald-400",
                    status === "current" && "text-emerald-600 dark:text-emerald-400",
                    status === "upcoming" && "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepIndicator({
  status,
  index,
}: {
  status: "completed" | "current" | "upcoming";
  index: number;
}) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
        status === "completed" &&
          "bg-emerald-600 text-white dark:bg-emerald-500",
        status === "current" &&
          "border-2 border-emerald-600 text-emerald-600 ring-4 ring-emerald-100 dark:border-emerald-400 dark:text-emerald-400 dark:ring-emerald-900/40",
        status === "upcoming" &&
          "border-2 border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400",
      )}
    >
      {status === "completed" ? (
        <Check className="h-4 w-4" />
      ) : (
        index + 1
      )}
    </span>
  );
}
