"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

export interface Column<T> {
  key: string;
  title: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyTitle = "Aucune donnée",
  emptyDescription,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 20,
  onPageChange,
  onSort,
  onRowClick,
  rowKey,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-slate-50 dark:border-slate-800"
          >
            {columns.map((col) => (
              <Skeleton
                key={col.key}
                className="h-4"
                style={{ width: col.width || "100px" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.sortable && "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200",
                    )}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.title}
                      {col.sortable && (
                        <>
                          {sortKey === col.key ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {data.map((row, idx) => (
                <tr
                  key={rowKey ? rowKey(row) : idx}
                  className={cn(
                    "transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-sm text-slate-700 dark:text-slate-300",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, idx)
                        : (row[col.key] as React.ReactNode) ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div
            key={rowKey ? rowKey(row) : idx}
            className={cn(
              "rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-4 space-y-2",
              onRowClick && "cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/50",
            )}
            onClick={() => onRowClick?.(row)}
          >
            {columns
              .filter((c) => !c.hideOnMobile)
              .map((col) => (
                <div key={col.key} className="flex justify-between items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {col.title}
                  </span>
                  <span className="text-sm text-slate-900 dark:text-slate-100 text-right">
                    {col.render
                      ? col.render(row[col.key], row, idx)
                      : (row[col.key] as React.ReactNode) ?? "—"}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
