"use client"
import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";

const ContactPage: NextPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    pharmacyType: "",
    subject: "",
    message: "",
    preferredContact: "email",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      name: "Email",
      value: "Réponse sous 4h",
      icon: EnvelopeIcon,
      color: "text-blue-600 bg-blue-100",
      contact: "contact@nakicode.com",
    },
    {
      name: "Téléphone",
      value: "Support immédiat",
      icon: PhoneIcon,
      color: "text-green-600 bg-green-100",
      contact: "+243 99 123 4567",
    },
    {
      name: "Chat",
      value: "En ligne maintenant",
      icon: ChatBubbleLeftRightIcon,
      color: "text-cyan-600 bg-cyan-100",
      contact: "Chat disponible 24/7",
    },
    {
      name: "Démo",
      value: "Rendez-vous personnalisé",
      icon: CalendarIcon,
      color: "text-orange-600 bg-orange-100",
      contact: "Réservation en ligne",
    },
  ];

  const offices = [
    {
      city: "Kinshasa",
      country: "République Démocratique du Congo",
      address: "Avenue Colonel Ebeya, Q/Socimat, Commune de Gombe",
      phone: "+243 99 123 4567",
      email: "kinshasa@nakicode.com",
      hours: "Lun-Ven: 8h-18h WAT",
      timezone: "WAT (UTC+1)",
      flag: "🇨🇩",
    },
    {
      city: "Bujumbura",
      country: "République du Burundi",
      address: "Boulevard du 28 Novembre, Q/Rohero",
      phone: "+257 79 123 456",
      email: "bujumbura@nakicode.com",
      hours: "Lun-Ven: 8h-18h CAT",
      timezone: "CAT (UTC+2)",
      flag: "🇧🇮",
    },
  ];

  if (submitted) {
    return (
      <>
        <Head>
          <title>Message Envoyé - NakiCode PharmaSaaS</title>
        </Head>
        <div className="min-h-screen bg-white">
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="text-xl font-bold text-sky-600">
                  NakiCode PharmaSaaS
                </Link>
              </div>
            </div>
          </nav>

          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
              <div>
                <CheckCircleIcon className="mx-auto h-24 w-24 text-green-500" />
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Message Envoyé !
                </h2>
                <p className="mt-2 text-gray-600">
                  Merci pour votre message. Notre équipe vous répondra dans les
                  plus brefs délais.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Temps de réponse estimé :</strong> Moins de 4 heures
                  pendant les heures ouvrables
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
                >
                  Retour à l'accueil
                </Link>
                <Link
                  href="/support"
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Centre de support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >
      <div className="bg-white pt-10">
        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <EnvelopeIcon className="h-20 w-20 text-sky-300 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Parlons de Votre <span className="text-sky-300">Projet</span>
            </h1>
            <p className="text-xl text-sky-200 mb-8">
              Notre équipe d'experts est prête à vous accompagner dans la
              transformation digitale de votre pharmacie. Démo gratuite,
              conseils personnalisés et support dédié.
            </p>
          </div>
        </section>

        {/* Méthodes de contact */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choisissez Votre Mode de Contact
              </h2>
              <p className="text-xl text-gray-600">
                Plusieurs options pour répondre à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`${method.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{method.value}</p>
                  <p className="text-xs text-gray-500">{method.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Demandez une Démo Personnalisée
              </h2>
              <p className="text-xl text-gray-600">
                Remplissez ce formulaire et nous vous recontactons sous 24h
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Dr. Jean Mukasa"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email professionnel *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="jean@pharmacie-moderne.cd"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="+243 99 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom de la pharmacie *
                    </label>
                    <div className="relative">
                      <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Pharmacie Moderne"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Pays *
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      >
                        <option value="">Sélectionnez votre pays</option>
                        <option value="cd">
                          République Démocratique du Congo
                        </option>
                        <option value="bi">République du Burundi</option>
                        <option value="rw">Rwanda</option>
                        <option value="ug">Ouganda</option>
                        <option value="tz">Tanzanie</option>
                        <option value="ke">Kenya</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pharmacyType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Type de pharmacie *
                    </label>
                    <select
                      id="pharmacyType"
                      name="pharmacyType"
                      required
                      value={formData.pharmacyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      <option value="">Sélectionnez le type</option>
                      <option value="retail">Pharmacie de détail</option>
                      <option value="hospital">Pharmacie hospitalière</option>
                      <option value="wholesale">Grossiste/Distributeur</option>
                      <option value="chain">Chaîne de pharmacies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sujet de votre demande *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="demo">Demande de démonstration</option>
                    <option value="pricing">Questions sur les tarifs</option>
                    <option value="features">
                      Questions sur les fonctionnalités
                    </option>
                    <option value="integration">Besoins d'intégration</option>
                    <option value="migration">
                      Migration depuis un autre système
                    </option>
                    <option value="partnership">Partenariat/Revendeur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Décrivez vos besoins *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Parlez-nous de votre pharmacie, vos défis actuels et vos objectifs. Plus nous comprenons vos besoins, mieux nous pouvons vous aider."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode de contact préféré
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["email", "phone", "video"].map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleChange}
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {method === "email"
                            ? "Email"
                            : method === "phone"
                            ? "Téléphone"
                            : "Visioconférence"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-sky-600 text-white hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  }`}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  En soumettant ce formulaire, vous acceptez d'être contacté par
                  notre équipe commerciale. Nous respectons votre vie privée et
                  ne partageons jamais vos informations.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Bureaux */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos Bureaux en Afrique
              </h2>
              <p className="text-xl text-gray-600">
                Support local et expertise régionale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{office.flag}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {office.city}
                      </h3>
                      <p className="text-gray-600">{office.country}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Adresse</p>
                        <p className="text-gray-600">{office.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Téléphone</p>
                        <a
                          href={`tel:${office.phone}`}
                          className="text-sky-600 hover:text-sky-800"
                        >
                          {office.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a
                          href={`mailto:${office.email}`}
                          className="text-sky-600 hover:text-sky-800"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Horaires d'ouverture
                        </p>
                        <p className="text-gray-600">{office.hours}</p>
                        <p className="text-sm text-gray-500">
                          {office.timezone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors">
                      Contacter ce bureau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ContactPage;
