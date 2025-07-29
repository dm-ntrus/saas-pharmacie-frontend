import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ArrowRightIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const SupportPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportChannels = [
    {
      name: 'Chat en Direct',
      description: 'Support instantané avec notre équipe technique',
      icon: ChatBubbleLeftRightIcon,
      availability: '24/7',
      responseTime: '< 2 min',
      color: 'bg-green-500',
      action: 'Démarrer le Chat'
    },
    {
      name: 'Support Téléphonique',
      description: 'Assistance vocale pour problèmes complexes',
      icon: PhoneIcon,
      availability: '8h-18h WAT',
      responseTime: 'Immédiat',
      color: 'bg-blue-500',
      action: 'Appeler Maintenant'
    },
    {
      name: 'Démo Personnalisée',
      description: 'Session de formation individuelle',
      icon: VideoCameraIcon,
      availability: 'Sur RDV',
      responseTime: '24-48h',
      color: 'bg-purple-500',
      action: 'Réserver un Créneau'
    },
    {
      name: 'Email Support',
      description: 'Questions détaillées avec suivi par ticket',
      icon: DocumentTextIcon,
      availability: '24/7',
      responseTime: '< 4h',
      color: 'bg-orange-500',
      action: 'Envoyer un Email'
    }
  ];

  const faqCategories = [
    { id: 'all', name: 'Toutes', icon: QuestionMarkCircleIcon },
    { id: 'getting-started', name: 'Prise en Main', icon: BookOpenIcon },
    { id: 'billing', name: 'Facturation', icon: DocumentTextIcon },
    { id: 'technical', name: 'Technique', icon: TagIcon },
    { id: 'integrations', name: 'Intégrations', icon: GlobeAltIcon }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'Comment créer ma première vente dans le système ?',
      answer: 'Rendez-vous dans le module Point de Vente, scannez ou sélectionnez vos produits, choisissez le mode de paiement (espèces, carte ou Mobile Money) et validez la transaction. Le reçu sera automatiquement généré.',
      popularity: 5
    },
    {
      category: 'billing',
      question: 'Puis-je payer avec Mobile Money ?',
      answer: 'Oui, nous acceptons AirtelMoney, OrangeMoney, M-Pesa, EcoCash et LumiCash. Les paiements sont sécurisés et instantanés.',
      popularity: 5
    },
    {
      category: 'technical',
      question: 'Le système fonctionne-t-il hors ligne ?',
      answer: 'Oui, notre application fonctionne en mode hors ligne pour les ventes et consultations stocks. La synchronisation se fait automatiquement dès le retour de la connexion.',
      popularity: 4
    },
    {
      category: 'getting-started',
      question: 'Comment importer mes produits existants ?',
      answer: 'Utilisez notre outil d\'import Excel/CSV dans Inventaire → Import. Vous pouvez aussi nous envoyer votre fichier et nous ferons l\'import pour vous gratuitement.',
      popularity: 4
    },
    {
      category: 'billing',
      question: 'Y a-t-il des frais cachés ?',
      answer: 'Aucun frais caché. Le prix affiché inclut toutes les fonctionnalités, support, mises à jour et formation de base. Seuls les services premium supplémentaires sont facturés à part.',
      popularity: 4
    },
    {
      category: 'technical',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Vos données sont chiffrées (AES-256), sauvegardées quotidiennement et hébergées sur des serveurs certifiés ISO 27001. Nous respectons strictement les réglementations sur la protection des données.',
      popularity: 5
    },
    {
      category: 'integrations',
      question: 'Puis-je connecter ma comptabilité externe ?',
      answer: 'Oui, nous avons des connecteurs pour Sage, QuickBooks, et autres logiciels comptables. Notre API permet aussi des intégrations personnalisées.',
      popularity: 3
    },
    {
      category: 'technical',
      question: 'Comment configurer les alertes de stock ?',
      answer: 'Dans Inventaire → Paramètres, définissez les seuils minimaux par produit. Les alertes seront envoyées par email, SMS et notifications push selon vos préférences.',
      popularity: 4
    }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchFilteredFaqs = filteredFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactInfo = {
    kinshasa: {
      city: 'Kinshasa',
      address: 'Avenue Colonel Ebeya, Q/Socimat, Commune de Gombe',
      phone: '+243 99 123 4567',
      email: 'support@nakicode.com',
      hours: 'Lun-Ven: 8h-18h WAT'
    },
    bujumbura: {
      city: 'Bujumbura',
      address: 'Boulevard du 28 Novembre, Q/Rohero',
      phone: '+257 79 123 456',
      email: 'support.bi@nakicode.com',
      hours: 'Lun-Ven: 8h-18h CAT'
    }
  };

  return (
    <>
      <Head>
        <title>Support - NakiCode PharmaSaaS</title>
        <meta name="description" content="Obtenez de l'aide avec notre support 24/7, documentation complète et formation personnalisée." />
        <meta name="keywords" content="support, aide, documentation, formation, assistance technique" />
      </Head>

      <div className="min-h-screen bg-white">
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
                <Link href="/support" className="text-indigo-600 font-medium">Support</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <QuestionMarkCircleIcon className="h-20 w-20 text-indigo-300 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Centre de <span className="text-indigo-300">Support</span>
            </h1>
            <p className="text-xl text-indigo-200 mb-8">
              Nous sommes là pour vous accompagner à chaque étape de votre parcours avec NakiCode PharmaSaaS.
              Support technique 24/7, formation et documentation complète.
            </p>
            
            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans notre base de connaissances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl border-0 focus:ring-4 focus:ring-indigo-200 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Canaux de support */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez Notre Équipe</h2>
              <p className="text-xl text-gray-600">Choisissez le canal qui vous convient le mieux</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportChannels.map((channel, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
                  <div className={`${channel.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <channel.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{channel.name}</h3>
                  <p className="text-gray-600 mb-6">{channel.description}</p>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{channel.availability}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Réponse {channel.responseTime}</span>
                    </div>
                  </div>
                  
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors hover:opacity-90 ${channel.color}`}>
                    {channel.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
              <p className="text-xl text-gray-600">Les réponses aux questions les plus courantes</p>
            </div>

            {/* Catégories FAQ */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <category.icon className="h-5 w-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Liste FAQ */}
            <div className="space-y-6">
              {searchFilteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    <div className="flex">
                      {[...Array(faq.popularity)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Cette réponse vous a-t-elle aidé ?</span>
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">👍 Oui</button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">👎 Non</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {searchFilteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600 mb-6">Essayez d'autres mots-clés ou contactez notre support.</p>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Contacter le Support
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Ressources additionnelles */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ressources Utiles</h2>
              <p className="text-xl text-gray-600">Documentation, tutoriels et formation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Documentation Technique',
                  description: 'Guides détaillés pour toutes les fonctionnalités',
                  icon: BookOpenIcon,
                  color: 'bg-blue-500',
                  items: ['Guide utilisateur', 'API Documentation', 'Intégrations', 'Dépannage'],
                  action: 'Consulter les Docs'
                },
                {
                  title: 'Formation & Webinaires',
                  description: 'Sessions de formation live et enregistrées',
                  icon: AcademicCapIcon,
                  color: 'bg-green-500',
                  items: ['Formation de base', 'Webinaires mensuels', 'Certification', 'Best practices'],
                  action: 'Voir les Formations'
                },
                {
                  title: 'Communauté',
                  description: 'Échangez avec d\'autres utilisateurs',
                  icon: UserGroupIcon,
                  color: 'bg-purple-500',
                  items: ['Forum utilisateurs', 'Groupes WhatsApp', 'Cas d\'usage', 'Retours d\'expérience'],
                  action: 'Rejoindre la Communauté'
                }
              ].map((resource, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className={`${resource.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                    <resource.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-6">{resource.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {resource.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center">
                    {resource.action}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Informations de contact */}
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Bureaux</h2>
              <p className="text-xl text-gray-300">Support local en Afrique centrale</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(contactInfo).map(([key, office]) => (
                <div key={key} className="bg-gray-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-indigo-300">{office.city}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-gray-300">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <a href={`tel:${office.phone}`} className="text-indigo-300 hover:text-indigo-200">
                          {office.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${office.email}`} className="text-indigo-300 hover:text-indigo-200">
                          {office.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Horaires</p>
                        <p className="text-gray-300">{office.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">NakiCode PharmaSaaS</h3>
                <p className="text-gray-400">
                  Solution SaaS de gestion pharmaceutique pour l'Afrique
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produit</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/features" className="hover:text-white">Fonctionnalités</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Tarifs</Link></li>
                  <li><Link href="/demo" className="hover:text-white">Démo</Link></li>
                  <li><Link href="/api-docs" className="hover:text-white">API</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/support" className="hover:text-white">Centre d'aide</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                  <li><Link href="/training" className="hover:text-white">Formation</Link></li>
                  <li><Link href="/status" className="hover:text-white">Statut</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">À propos</Link></li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-white">Carrières</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 NakiCode. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SupportPage;