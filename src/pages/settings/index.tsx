import React, { useState } from 'react';
import { 
  Cog6ToothIcon,
  UserIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  BellIcon,
  EyeIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { 
    fontSize, 
    highContrast, 
    reducedMotion, 
    setFontSize, 
    toggleHighContrast, 
    toggleReducedMotion 
  } = useAccessibilityStore();

  const tabs = [
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'preferences', label: 'Préférences', icon: Cog6ToothIcon },
    { id: 'accessibility', label: 'Accessibilité', icon: EyeIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Confidentialité', icon: ShieldCheckIcon }
  ];

  return (
    <Layout title="Paramètres Utilisateur">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos préférences et paramètres de compte
            </p>
          </header>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            {/* Navigation latérale */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1" role="tablist" aria-label="Paramètres utilisateur">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 hover:text-indigo-700 hover:bg-indigo-50'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon
                      className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                        activeTab === tab.id
                          ? 'text-indigo-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Contenu principal */}
            <main className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9" id="main-content">
              {activeTab === 'profile' && (
                <div role="tabpanel" id="profile-panel" aria-labelledby="profile-tab">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Informations du profil
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            Prénom
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="first-name"
                              id="first-name"
                              defaultValue="Jean"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="last-name"
                              id="last-name"
                              defaultValue="Mukasa"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adresse email
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              defaultValue="jean.mukasa@pharmacie.cd"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <div className="mt-1">
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              defaultValue="+243 99 123 4567"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="primary">
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div role="tabpanel" id="accessibility-panel" aria-labelledby="accessibility-tab">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Options d'accessibilité
                    </h2>
                    <div className="space-y-6">
                      {/* Taille de police */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Taille de police
                        </label>
                        <div className="flex gap-4" role="radiogroup" aria-labelledby="font-size-label">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              role="radio"
                              aria-checked={fontSize === size}
                              onClick={() => setFontSize(size)}
                              className={`px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                fontSize === size
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {size === 'small' ? 'Petit' : 
                               size === 'medium' ? 'Moyen' : 'Grand'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Contraste élevé */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Mode contraste élevé
                          </h3>
                          <p className="text-sm text-gray-500">
                            Améliore la lisibilité avec des couleurs plus contrastées
                          </p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={highContrast}
                          onClick={toggleHighContrast}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            highContrast ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              highContrast ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                          <span className="sr-only">
                            {highContrast ? 'Désactiver' : 'Activer'} le mode contraste élevé
                          </span>
                        </button>
                      </div>

                      {/* Réduction des animations */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Réduire les animations
                          </h3>
                          <p className="text-sm text-gray-500">
                            Minimise les animations pour réduire les distractions
                          </p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={reducedMotion}
                          onClick={toggleReducedMotion}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            reducedMotion ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              reducedMotion ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                          <span className="sr-only">
                            {reducedMotion ? 'Désactiver' : 'Activer'} la réduction des animations
                          </span>
                        </button>
                      </div>

                      {/* Raccourcis clavier */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Raccourcis clavier
                        </h3>
                        <div className="bg-gray-50 rounded-md p-4">
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Ouvrir le panneau d'accessibilité</dt>
                              <dd className="font-mono bg-white px-2 py-1 rounded border">Alt + A</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Navigation principale</dt>
                              <dd className="font-mono bg-white px-2 py-1 rounded border">Alt + N</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Contenu principal</dt>
                              <dd className="font-mono bg-white px-2 py-1 rounded border">Alt + M</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div role="tabpanel" id="preferences-panel" aria-labelledby="preferences-tab">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Préférences générales
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                          Langue
                        </label>
                        <select
                          id="language"
                          name="language"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue="fr"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="ln">Lingala</option>
                          <option value="sw">Swahili</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                          Fuseau horaire
                        </label>
                        <select
                          id="timezone"
                          name="timezone"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue="Africa/Kinshasa"
                        >
                          <option value="Africa/Kinshasa">Kinshasa (GMT+1)</option>
                          <option value="Africa/Lubumbashi">Lubumbashi (GMT+2)</option>
                          <option value="Africa/Bujumbura">Bujumbura (GMT+2)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Thème d'affichage
                        </label>
                        <div className="flex gap-4">
                          {[
                            { id: 'light', label: 'Clair', icon: SunIcon },
                            { id: 'dark', label: 'Sombre', icon: MoonIcon },
                            { id: 'auto', label: 'Automatique', icon: ComputerDesktopIcon }
                          ].map((theme) => (
                            <button
                              key={theme.id}
                              className="flex items-center justify-center flex-col p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <theme.icon className="h-6 w-6 text-gray-400 mb-2" aria-hidden="true" />
                              <span className="text-sm font-medium text-gray-700">
                                {theme.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div role="tabpanel" id="notifications-panel" aria-labelledby="notifications-tab">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Préférences de notifications
                    </h2>
                    <div className="space-y-6">
                      {[
                        { id: 'stock', label: 'Alertes de stock', description: 'Notifications quand les stocks sont faibles' },
                        { id: 'expiry', label: 'Expirations', description: 'Alertes pour les médicaments arrivant à expiration' },
                        { id: 'orders', label: 'Commandes', description: 'Notifications sur les nouvelles commandes' },
                        { id: 'reports', label: 'Rapports', description: 'Notifications quand les rapports sont prêts' }
                      ].map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              {notification.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {notification.description}
                            </p>
                          </div>
                          <button
                            role="switch"
                            aria-checked={true}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                            <span className="sr-only">
                              Notifications {notification.label}
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div role="tabpanel" id="privacy-panel" aria-labelledby="privacy-tab">
                  <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Confidentialité et sécurité
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Authentification à deux facteurs
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Ajoutez une couche de sécurité supplémentaire à votre compte
                        </p>
                        <Button variant="outline">
                          Configurer 2FA
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Sessions actives
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Gérez les appareils connectés à votre compte
                        </p>
                        <Button variant="outline">
                          Voir les sessions
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Télécharger mes données
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Obtenez une copie de toutes vos données personnelles
                        </p>
                        <Button variant="outline">
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;