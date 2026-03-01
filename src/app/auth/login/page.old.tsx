"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";

const LoginPage = () => {
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

        login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcyNDU2NDE4LCJpYXQiOjE3NzIzNzAwMTgsImp0aSI6IjdmYzI1ZjBmMWIyYzQ4MDViOTAxYTVkYzc5NTZjOTBmIiwiYWRtaW5faWQiOiIxIiwibm9tIjoiU1VQRVIiLCJjb2xvciI6bnVsbCwicHJlbm9tIjoiQURNSU4iLCJsb2dfaW4iOiJzdXBlcmFkbWluQGJhc2UuY2QiLCJ0ZWxlcGhvbmUiOiI2ODQ1NjM0NCIsImNvZGVfc29jaWV0ZSI6bnVsbCwicGhvdG8iOiIvbWVkaWEvYWRtaW5fdXNlci9QSE9UT1MvYm91Z2llcy10b3Vzc2FpbnRfZ3NSV0ZGQS5qcGciLCJwcm9maWxfaWQiOjEsImZvbmN0aW9uX2lkIjoxLCJwcm9maWxfZGVzY3IiOiJBZG1pbmlzdHJhdGV1ciIsImZvbmN0aW9uX25vbSI6Ik1hbmFnZXIgUHJpbmNpcGFsIiwiY2xpZW50X2lkIjoiTi9BIn0.ecL354rRDtzGzbg9c6yrafr86mJ6gauryeorMYfh7xE", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3MjU0MjgxOCwiaWF0IjoxNzcyMzcwMDE4LCJqdGkiOiIwYmRkZDgzNjA3MDI0MmQzYjM0YmJiMmY0Mzc3OTRjMyIsImFkbWluX2lkIjoiMSIsIm5vbSI6IlNVUEVSIiwiY29sb3IiOm51bGwsInByZW5vbSI6IkFETUlOIiwibG9nX2luIjoic3VwZXJhZG1pbkBiYXNlLmNkIiwidGVsZXBob25lIjoiNjg0NTYzNDQiLCJjb2RlX3NvY2lldGUiOm51bGwsInBob3RvIjoiL21lZGlhL2FkbWluX3VzZXIvUEhPVE9TL2JvdWdpZXMtdG91c3NhaW50X2dzUldGRkEuanBnIiwicHJvZmlsX2lkIjoxLCJmb25jdGlvbl9pZCI6MSwicHJvZmlsX2Rlc2NyIjoiQWRtaW5pc3RyYXRldXIiLCJmb25jdGlvbl9ub20iOiJNYW5hZ2VyIFByaW5jaXBhbCIsImNsaWVudF9pZCI6Ik4vQSJ9.y6C3BfgR-5GUq9O52IZ602jG7CF_mpOmlt2lLII6OFA", 8998);
        setIsLoading(false);
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Email ou mot de passe incorrect"
      );
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
    <>
      <div className="flex justify-center items-center relative overflow-hidden p-0 w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl z-50 w-full h-full">
          {/* Panel gauche - Formulaire */}
          <div className="w-full h-full  flex-1 flex flex-col justify-center py-12 px-6 lg:flex-none lg:px-20 xl:px-24 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="flex flex-col items-center text-center w-full">
                <Link
                  href="/"
                >
                  <Image src="/images/medpharma.png" width="300" height="100" alt="MEDPharma"/>
                </Link>
                <p className="text-gray-500 mb-6">
                  Connectez-vous
                </p>
              </div>

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
                      href="/auth/forgot-password"
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
                <div className="text-center">
                  <span className="text-gray-500">Pas encore de compte ? </span>
                  <Link
                    href="/auth/register"
                    className="text-sky-600 font-medium hover:text-sky-700"
                  >
                    Créer un compte
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Panel droit - Démo */}
          <div className="hidden lg:flex relative flex-1 w-full h-full flex-col justify-center py-12 px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image src="/images/medpharma.png" width="300" height="100" alt="MEDPharma"/>
              </div>
              <p className="text-xl text-sky-200 leading-relaxed">
                La solution complète pour la gestion moderne de votre pharmacie
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <h3 className="text-2xl font-semibold text-white">
                Pourquoi nous choisir ?
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Point de vente intelligent",
                    desc: "Interface rapide et intuitive pour vos transactions",
                  },
                  {
                    title: "Gestion d'inventaire",
                    desc: "Suivi en temps réel de vos stocks et alertes automatiques",
                  },
                  {
                    title: "Prescriptions & DCI",
                    desc: "Base de données complète des médicaments",
                  },
                  {
                    title: "Analytics avancées",
                    desc: "Tableaux de bord et rapports détaillés",
                  },
                  {
                    title: "Mobile Money intégré",
                    desc: "Paiements mobiles simplifiés",
                  },
                  {
                    title: "Support technique 24/7",
                    desc: "Assistance disponible à tout moment",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <CheckCircleIcon className="h-6 w-6 text-sky-400 flex-shrink-0 mt-0.5 group-hover:text-sky-300 transition-colors" />
                    <div>
                      <p className="font-medium text-white">{feature.title}</p>
                      <p className="text-sm text-sky-200">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
