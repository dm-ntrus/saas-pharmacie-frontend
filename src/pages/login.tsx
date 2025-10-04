import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/design-system";
import { UserRole } from "@/types";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuthStore();

  const { login: log } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulation de connexion - en production, connecter à l'API
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

        log(user);

        login(user, "yutdrsdfghjkiyutrdtfghj");
        // Redirection vers le tableau de bord
        setTimeout(() => {
          router.push("/dashboard/");
        }, 1500);
        setIsLoading(false);
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const demoCredentials = [
    {
      role: "Pharmacien Titulaire",
      email: "pharmacien@demo.cd",
      password: "demo123",
      description: "Accès complet à tous les modules",
    },
    {
      role: "Caissier",
      email: "caissier@demo.cd",
      password: "demo123",
      description: "Point de vente et gestion clients",
    },
    {
      role: "Technicien",
      email: "technicien@demo.cd",
      password: "demo123",
      description: "Inventaire et approvisionnement",
    },
  ];

  return (
    <>
      <Head>
        <title>Connexion - NakiCode PharmaSaaS</title>
        <meta
          name="description"
          content="Connectez-vous à votre tableau de bord NakiCode PharmaSaaS ou essayez notre démo gratuite."
        />
        <meta
          name="keywords"
          content="connexion, login, démo, tableau de bord, pharmacie"
        />
      </Head>

      <div className="min-h-screen flex justify-center items-center  bg-gradient-to-br from-sky-50 via-blue-50 to-white relative overflow-hidden px-2 sm:px-0">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-white shadow-2xl z-50">
          {/* Panel gauche - Formulaire */}
          <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <Link
                  href="/"
                  className="text-3xl font-bold text-sky-600 mb-2 block"
                >
                  NakiCode PharmaSaaS
                </Link>
                <p className="text-gray-500 mb-6">
                  Connectez-vous à votre espace de gestion pharmaceutique
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email professionnel
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700 z-10" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/90 backdrop-blur text-gray-900"
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
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700 z-10" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/90 backdrop-blur text-gray-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      className="ml-2 block text-sm text-gray-500"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <div>
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
                </div>

                <div className="text-center">
                  <span className="text-gray-500">Pas encore de compte ? </span>
                  <Link
                    href="/register"
                    className="text-sky-600 font-medium hover:text-sky-700"
                  >
                    Créer un compte
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Panel droit - Démo */}
          <div className="hidden lg:block relative flex-1 rounded-r-2xl bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 backdrop-blur">
            <div className="absolute inset-0 flex flex-col justify-center p-12">
              <div className="text-center mb-6">
                <BuildingStorefrontIcon className="h-16 w-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Essai Gratuit Immédiat
                </h2>
                <p className="text-xl text-sky-200 mb-8">
                  Testez toutes les fonctionnalités sans engagement avec nos
                  comptes de démonstration
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Fonctionnalités Démo Incluses:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-sky-200">
                  <div>✓ Point de vente complet</div>
                  <div>✓ Gestion inventaire</div>
                  <div>✓ Prescriptions & DCI</div>
                  <div>✓ Analytics avancées</div>
                  <div>✓ Mobile Money simulé</div>
                  <div>✓ Support technique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
