import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  CodeBracketIcon,
  DocumentTextIcon,
  KeyIcon,
  CubeIcon,
  ServerIcon,
  ShieldCheckIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const ApiDocsPage: NextPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const sections = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: InformationCircleIcon },
    { id: 'authentication', name: 'Authentification', icon: ShieldCheckIcon },
    { id: 'pos', name: 'Point de Vente', icon: CubeIcon },
    { id: 'inventory', name: 'Inventaire', icon: ServerIcon },
    { id: 'prescriptions', name: 'Prescriptions', icon: DocumentTextIcon },
    { id: 'customers', name: 'Clients', icon: DocumentTextIcon },
    { id: 'analytics', name: 'Analytics', icon: DocumentTextIcon },
    { id: 'webhooks', name: 'Webhooks', icon: CodeBracketIcon },
    { id: 'errors', name: 'Codes d\'erreur', icon: ExclamationTriangleIcon }
  ];

  const endpoints = {
    pos: [
      {
        method: 'POST',
        path: '/api/pos/transactions',
        description: 'Créer une nouvelle transaction de vente',
        auth: true,
        parameters: [
          { name: 'items', type: 'array', required: true, description: 'Liste des produits vendus' },
          { name: 'customerId', type: 'string', required: false, description: 'ID du client' },
          { name: 'paymentMethod', type: 'enum', required: true, description: 'cash|card|mobile_money' },
          { name: 'discount', type: 'number', required: false, description: 'Pourcentage de remise' }
        ],
        response: {
          transactionId: 'string',
          total: 'number',
          tax: 'number',
          change: 'number',
          receipt: 'string'
        }
      },
      {
        method: 'GET',
        path: '/api/pos/transactions',
        description: 'Lister les transactions',
        auth: true,
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Numéro de page' },
          { name: 'limit', type: 'number', required: false, description: 'Éléments par page (max 100)' },
          { name: 'startDate', type: 'string', required: false, description: 'Date de début (ISO 8601)' },
          { name: 'endDate', type: 'string', required: false, description: 'Date de fin (ISO 8601)' }
        ]
      },
      {
        method: 'GET',
        path: '/api/pos/transactions/{id}',
        description: 'Obtenir une transaction spécifique',
        auth: true,
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'ID de la transaction' }
        ]
      }
    ],
    inventory: [
      {
        method: 'GET',
        path: '/api/inventory/products',
        description: 'Lister tous les produits en stock',
        auth: true,
        parameters: [
          { name: 'category', type: 'string', required: false, description: 'Filtrer par catégorie' },
          { name: 'lowStock', type: 'boolean', required: false, description: 'Produits en rupture uniquement' },
          { name: 'search', type: 'string', required: false, description: 'Recherche par nom ou DCI' }
        ]
      },
      {
        method: 'POST',
        path: '/api/inventory/products',
        description: 'Ajouter un nouveau produit',
        auth: true,
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Nom du produit' },
          { name: 'dci', type: 'string', required: true, description: 'Dénomination Commune Internationale' },
          { name: 'category', type: 'string', required: true, description: 'Catégorie thérapeutique' },
          { name: 'price', type: 'number', required: true, description: 'Prix unitaire' },
          { name: 'quantity', type: 'number', required: true, description: 'Quantité en stock' }
        ]
      },
      {
        method: 'PUT',
        path: '/api/inventory/products/{id}/stock',
        description: 'Mettre à jour le stock d\'un produit',
        auth: true,
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'ID du produit' },
          { name: 'quantity', type: 'number', required: true, description: 'Nouvelle quantité' },
          { name: 'reason', type: 'string', required: true, description: 'Motif de l\'ajustement' }
        ]
      }
    ],
    prescriptions: [
      {
        method: 'POST',
        path: '/api/prescriptions/validate',
        description: 'Valider une prescription médicale',
        auth: true,
        parameters: [
          { name: 'prescriptionId', type: 'string', required: true, description: 'ID de l\'ordonnance' },
          { name: 'patientId', type: 'string', required: true, description: 'ID du patient' },
          { name: 'medications', type: 'array', required: true, description: 'Liste des médicaments prescrits' }
        ]
      },
      {
        method: 'GET',
        path: '/api/prescriptions/interactions',
        description: 'Vérifier les interactions médicamenteuses',
        auth: true,
        parameters: [
          { name: 'medications', type: 'string', required: true, description: 'IDs des médicaments séparés par virgule' }
        ]
      }
    ]
  };

  const codeExamples = {
    curl: `curl -X POST https://api.pharmassaas.com/api/pos/transactions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      {
        "productId": "prod_123",
        "quantity": 2,
        "price": 15.50
      }
    ],
    "paymentMethod": "mobile_money",
    "customerId": "cust_456"
  }'`,
    javascript: `const response = await fetch('https://api.pharmassaas.com/api/pos/transactions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{
      productId: 'prod_123',
      quantity: 2,
      price: 15.50
    }],
    paymentMethod: 'mobile_money',
    customerId: 'cust_456'
  })
});

const transaction = await response.json();`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

data = {
    'items': [{
        'productId': 'prod_123',
        'quantity': 2,
        'price': 15.50
    }],
    'paymentMethod': 'mobile_money',
    'customerId': 'cust_456'
}

response = requests.post(
    'https://api.pharmassaas.com/api/pos/transactions',
    headers=headers,
    json=data
)`
  };

  const [activeLanguage, setActiveLanguage] = useState<keyof typeof codeExamples>('curl');

  return (
    <>
      <Head>
        <title>Documentation API - NakiCode PharmaSaaS</title>
        <meta name="description" content="Documentation complète de l'API NakiCode PharmaSaaS pour intégrer notre plateforme dans vos systèmes." />
        <meta name="keywords" content="API, documentation, intégration, développeur, pharmacie" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                NakiCode PharmaSaaS
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
                <Link href="/features" className="text-gray-600 hover:text-gray-900">Fonctionnalités</Link>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Tarifs</Link>
                <Link href="/api-docs" className="text-indigo-600 font-medium">API</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white h-screen sticky top-0 overflow-y-auto border-r border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <CodeBracketIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">API Docs</h2>
              </div>
              
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {activeSection === 'overview' && (
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">API NakiCode PharmaSaaS</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Intégrez facilement notre plateforme de gestion pharmaceutique dans vos systèmes existants.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <ServerIcon className="h-12 w-12 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">API REST</h3>
                    <p className="text-gray-600">Architecture REST standard avec réponses JSON</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <ShieldCheckIcon className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sécurisée</h3>
                    <p className="text-gray-600">Authentification OAuth 2.0 et chiffrement HTTPS</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <CodeBracketIcon className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">SDKs Disponibles</h3>
                    <p className="text-gray-600">JavaScript, Python, PHP et plus à venir</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">URL de Base</h2>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    https://api.pharmassaas.com
                  </div>
                  <p className="text-gray-600 mt-2">Tous les endpoints sont préfixés par cette URL de base.</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Démarrage Rapide</h2>
                  <ol className="list-decimal list-inside space-y-3 text-gray-600">
                    <li>Obtenez votre clé API depuis votre tableau de bord</li>
                    <li>Incluez la clé dans l'en-tête <code className="bg-gray-100 px-2 py-1 rounded">Authorization</code></li>
                    <li>Effectuez vos premiers appels vers les endpoints</li>
                    <li>Implémentez les webhooks pour les notifications temps réel</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'authentication' && (
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Authentification</h1>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="text-yellow-700">
                      <strong>Sécurité:</strong> Ne partagez jamais votre clé API. Utilisez des variables d'environnement en production.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Obtenir une Clé API</h2>
                    <p className="text-gray-600 mb-4">
                      Connectez-vous à votre tableau de bord et naviguez vers Paramètres → API pour générer votre clé.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm">pk_live_1234567890abcdef...</code>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisation de la Clé</h2>
                    <p className="text-gray-600 mb-4">
                      Incluez votre clé API dans l'en-tête Authorization de chaque requête:
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-green-400 text-sm">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Environnements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Test</h3>
                        <p className="text-sm text-gray-600 mb-2">Clés commençant par <code>pk_test_</code></p>
                        <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                          https://api.pharmassaas.com/test
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Production</h3>
                        <p className="text-sm text-gray-600 mb-2">Clés commençant par <code>pk_live_</code></p>
                        <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                          https://api.pharmassaas.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeSection === 'pos' || activeSection === 'inventory' || activeSection === 'prescriptions') && endpoints[activeSection as keyof typeof endpoints] && (
              <div className="max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {activeSection === 'pos' && 'Point de Vente'}
                  {activeSection === 'inventory' && 'Gestion d\'Inventaire'}
                  {activeSection === 'prescriptions' && 'Prescriptions'}
                </h1>

                <div className="space-y-6">
                  {endpoints[activeSection as keyof typeof endpoints].map((endpoint, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedEndpoint(expandedEndpoint === `${activeSection}-${index}` ? null : `${activeSection}-${index}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                            {endpoint.auth && (
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                Auth Required
                              </span>
                            )}
                          </div>
                          {expandedEndpoint === `${activeSection}-${index}` ? 
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" /> :
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          }
                        </div>
                        <p className="text-gray-600 mt-2">{endpoint.description}</p>
                      </div>

                      {expandedEndpoint === `${activeSection}-${index}` && (
                        <div className="px-6 pb-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                            {/* Paramètres */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h3>
                              <div className="space-y-3">
                                {endpoint.parameters?.map((param, paramIndex) => (
                                  <div key={paramIndex} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <code className="text-sm font-mono text-indigo-600">{param.name}</code>
                                      <div className="flex space-x-2">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                          {param.type}
                                        </span>
                                        {param.required ? (
                                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                            Requis
                                          </span>
                                        ) : (
                                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            Optionnel
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{param.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Exemple de code */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Exemple</h3>
                                <div className="flex space-x-2">
                                  {Object.keys(codeExamples).map(lang => (
                                    <button
                                      key={lang}
                                      onClick={() => setActiveLanguage(lang as keyof typeof codeExamples)}
                                      className={`text-xs px-3 py-1 rounded ${
                                        activeLanguage === lang
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {lang.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-gray-900 rounded-lg overflow-hidden">
                                <div className="p-4 overflow-x-auto">
                                  <pre className="text-green-400 text-sm">
                                    {codeExamples[activeLanguage]}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'errors' && (
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Codes d'Erreur</h1>
                
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Format des Erreurs</h2>
                  <p className="text-gray-600 mb-4">
                    Toutes les erreurs retournent un format JSON standardisé:
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Le paramètre 'quantity' est requis",
    "details": {
      "parameter": "quantity",
      "expected": "number",
      "received": "null"
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { code: '400', name: 'Bad Request', description: 'Paramètres manquants ou invalides', color: 'bg-red-100 text-red-800' },
                    { code: '401', name: 'Unauthorized', description: 'Clé API manquante ou invalide', color: 'bg-red-100 text-red-800' },
                    { code: '403', name: 'Forbidden', description: 'Accès interdit pour cette ressource', color: 'bg-orange-100 text-orange-800' },
                    { code: '404', name: 'Not Found', description: 'Ressource non trouvée', color: 'bg-gray-100 text-gray-800' },
                    { code: '429', name: 'Rate Limited', description: 'Trop de requêtes, ralentissez', color: 'bg-yellow-100 text-yellow-800' },
                    { code: '500', name: 'Internal Error', description: 'Erreur serveur, contactez le support', color: 'bg-red-100 text-red-800' }
                  ].map((error, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${error.color}`}>
                            {error.code}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{error.name}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{error.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ApiDocsPage;