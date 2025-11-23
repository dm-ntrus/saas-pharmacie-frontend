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
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (
        formData.email === "admin@gmail.com" &&
        formData.password === "admin"
      ) {
        const user = {
          id: "1",
          email: "chriscedrick4@gmail.com",
          firstName: "Chris",
          lastName: "Cedrick",
          roles: ["pharmacist", "admin"],
          permissions: ["dispense_drugs", "manage_prescriptions"],
          tenantId: "",
          avatar: "hj",
          isActive: true,
          lastLogin: "",
          createdAt: "",
          updatedAt: "",
        };

        // Simulate login
        setTimeout(() => {
          alert("Connexion réussie!");
          setIsLoading(false);
        }, 1000);
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect");
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

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 gap-8 items-center">
          {/* Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
              {/* Logo */}
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {/* <BuildingStorefrontIcon className="h-8 w-8 text-sky-600" /> */}
                  <h2 className="text-2xl font-bold text-sky-600">NakiCode</h2>
                </div>
                <p className="text-sm text-gray-500">MEDPharma</p>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {/* Bon retour ! */}
                </h2>
                <p className="text-gray-600 mt-2">
                  Connectez-vous à votre espace de gestion
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                      className="pl-11 w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
                      placeholder="pharmacien@votrePharmacie.cd"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                      className="pl-11 pr-11 w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
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
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href={`/tenant/${tenant_slug}/auth/forgot-password`}
                      className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className={`w-full flex justify-center transition-colors ${
                    isLoading ? "bg-gray-300 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-900 mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
