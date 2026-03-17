"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        danger:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        primary:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
