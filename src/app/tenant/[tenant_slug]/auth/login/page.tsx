"use client";

import React, { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getMockAdminTokens,
  getMockTenantTokens,
  isMockAdmin,
  isMockTenant,
} from "@/services/mock-auth.service";

const LoginPage = () => {
  const params = useParams();
  const tenant_slug = params?.tenant_slug;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = formData.email
    const password = formData.password
    try {
      if (isMockAdmin(email, password)) {
        const { access, refresh } = getMockAdminTokens();
        await login(access, refresh, 86400);
        toast.success("Connexion admin réussie");
        return;
      }
      if (isMockTenant(email, password)) {
        const { access, refresh } = getMockTenantTokens();
        await login(access, refresh, 86400);
        toast.success("Connexion pharmacie réussie");
        return;
      }
      toast.error("Email ou mot de passe incorrect");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Email ou mot de passe incorrect"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const inputClass = "w-full pl-10 pr-5 py-3 rounded-2xl text-slate-900 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none focus:bg-white shadow-sm transition-all font-medium";
  const labelClass = "text-sm font-bold text-slate-700";

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 gap-8 items-center">
          {/* Login Form */}
          <div className="w-full max-w-md mx-auto">
            <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }} className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
              {/* Logo */}
              <div className="flex flex-col items-center text-center pb-2 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  {/* <BuildingStorefrontIcon className="h-8 w-8 text-sky-600" /> */}
                  <h2 className="text-4xl font-bold text-emerald-600 uppercase">{tenant_slug}</h2>
                </div>
                <span className="font-display font-bold text-md text-emerald-600 tracking-tight">Syntix<span className="text-slate-900">Pharma</span></span>
              </div>

              <div className="text-center">
                {/* <h2 className="text-3xl font-bold text-gray-900">
                  Bon retour !
                </h2> */}
                <p className="text-slate-500 mb-2 leading-relaxed">
                  Connectez-vous à votre espace de gestion
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Email professionnel
              </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="pharmacien@votrePharmacie.cd"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Mot de passe
                </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-sm font-bold text-slate-600 cursor-pointer"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href={`/tenant/${tenant_slug}/auth/forgot-password`}
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Se connecter"
                  )}
                  </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
