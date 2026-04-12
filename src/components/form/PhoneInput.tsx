"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Phone } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input";
import { getCountryName } from "@/lib/countries";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: Country;
  className?: string;
  placeholder?: string;
}

interface PhoneCountry {
  code: Country;
  name: string;
  dialCode: string;
}

const PRIORITY_CODES: Country[] = [
  "CD", "CG", "FR", "BE", "CH", "CA", "CI", "CM", "SN",
];

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = "CD",
  className = "",
  placeholder = "Numéro de téléphone",
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const phoneCountries = useMemo<PhoneCountry[]>(() => {
    const codes = getCountries();
    const all = codes
      .map((code) => {
        try {
          return {
            code,
            name: getCountryName(code) || code,
            dialCode: `+${getCountryCallingCode(code)}`,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as PhoneCountry[];

    all.sort((a, b) => a.name.localeCompare(b.name, "fr"));

    const prioritySet = new Set(PRIORITY_CODES);
    const priority = PRIORITY_CODES
      .map((c) => all.find((x) => x.code === c))
      .filter(Boolean) as PhoneCountry[];
    const rest = all.filter((c) => !prioritySet.has(c.code));

    return [...priority, ...rest];
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return phoneCountries;
    const q = search.toLowerCase();
    return phoneCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q),
    );
  }, [phoneCountries, search]);

  const current = phoneCountries.find((c) => c.code === selectedCountry);

  useEffect(() => {
    if (dropdownOpen) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCountrySelect = (country: PhoneCountry) => {
    setSelectedCountry(country.code);
    setDropdownOpen(false);

    const digits = value.replace(/[^\d]/g, "");
    if (digits) {
      onChange(`${country.dialCode} ${digits}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (current && !raw.startsWith("+")) {
      onChange(`${current.dialCode} ${raw}`);
    } else {
      onChange(raw);
    }
  };

  const displayValue = useMemo(() => {
    if (!current) return value;
    if (value.startsWith(current.dialCode)) {
      return value.slice(current.dialCode.length).trimStart();
    }
    return value.replace(/^\+\d+\s*/, "");
  }, [value, current]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex rounded-2xl border border-slate-100 bg-slate-50/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white transition-all overflow-hidden">
        {/* Country code selector */}
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-1 px-3 border-r border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
        >
          <span className="text-lg leading-none">
            {countryCodeToFlag(selectedCountry)}
          </span>
          <span className="text-xs font-bold text-slate-600 tabular-nums">
            {current?.dialCode}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Phone number input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
          <input
            type="tel"
            value={displayValue}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-3.5 bg-transparent text-slate-900 outline-none font-medium text-sm"
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 rounded-xl border-0 outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto overscroll-contain">
              {filtered.length === 0 && (
                <p className="p-4 text-sm text-slate-400 text-center">
                  Aucun résultat
                </p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                    c.code === selectedCountry
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-lg leading-none shrink-0">
                    {countryCodeToFlag(c.code)}
                  </span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {c.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}
