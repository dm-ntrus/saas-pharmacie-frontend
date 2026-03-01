"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { path: "/features", name: "Solutions" },
  { path: "/pricing", name: "Tarifs" },
  { path: "/about", name: "À Propos" },
  { path: "/contact", name: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">
                Syntix<span className="text-slate-900">Pharma</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                    pathname === link.path
                      ? "text-emerald-600"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
              >
                Essai Gratuit
              </Link>
            </div>

            {/* Mobile: connexion + hamburger */}
            <div className="flex lg:hidden items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                Connexion
              </Link>
              <button
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
                className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-600 border-2 border-slate-100 bg-white hover:border-emerald-200 hover:text-emerald-600 transition-all"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[80px] left-4 right-4 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/10 z-40 lg:hidden overflow-hidden"
            >
              {/* Nav links */}
              <nav className="p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                  >
                    <Link
                      href={link.path}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all ${
                        pathname === link.path
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-4 border-t border-slate-100" />

              {/* CTA */}
              <div className="p-4">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                >
                  <Link
                    href="/auth/register"
                    className="block w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all text-center shadow-lg shadow-slate-900/10"
                  >
                    Essai Gratuit
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}