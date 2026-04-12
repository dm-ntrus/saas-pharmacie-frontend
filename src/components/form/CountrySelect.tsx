"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";
import { getAllCountries, getCountryName } from "@/lib/countries";
import type { CountryOption } from "@/lib/countries";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export default function CountrySelect({
  value,
  onChange,
  className = "",
  placeholder = "Sélectionnez un pays",
  required,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(() => getAllCountries(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries, search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedName = value ? getCountryName(value) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all text-left font-medium ${
          open
            ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white"
            : "border-slate-100 bg-slate-50/80 hover:border-slate-200"
        } ${!selectedName ? "text-slate-400" : "text-slate-900"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {value && (
            <CountryFlag code={value} />
          )}
          {selectedName ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {required && !value && (
        <input
          tabIndex={-1}
          className="absolute inset-0 opacity-0 pointer-events-none"
          required
          value={value}
          onChange={() => {}}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un pays…"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 rounded-xl border-0 outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-56 overflow-y-auto overscroll-contain">
              {filtered.length === 0 && (
                <p className="p-4 text-sm text-slate-400 text-center">
                  Aucun pays trouvé
                </p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                    c.code === value
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CountryFlag code={c.code} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {c.code}
                  </span>
                  {c.code === value && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountryFlag({ code }: { code: string }) {
  const flag = countryCodeToFlag(code);
  return (
    <span className="text-lg leading-none shrink-0" aria-hidden>
      {flag}
    </span>
  );
}

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}
