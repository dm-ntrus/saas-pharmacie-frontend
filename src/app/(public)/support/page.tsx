"use client";
import React, { useState } from 'react';
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
import { Button } from '@/design-system';

const SupportPage = () => {
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
      color: 'bg-cyan-500',
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
      <div className="bg-white pt-10">

        {/* Hero Section  */}
        <section className="bg-gradient-to-b from-sky-50 via-white to-white text-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <QuestionMarkCircleIcon className="h-16 w-16 text-sky-500 mr-4" />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                      Centre de <span className="text-sky-600">Support</span>
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  Nous sommes là pour vous accompagner à chaque étape de votre parcours avec NakiCode PharmaSaaS. Support technique 24/7, formation et documentation complète.
                </p>
                
                {/* Quick stats */}
                {/* <div className="grid grid-cols-3 justify-items-start gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-700">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">&lt;2min</div>
                    <div className="text-sm text-gray-700">Réponse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">2 Pays</div>
                    <div className="text-sm text-gray-700">Présence</div>
                  </div>
                </div> */}
              </div>
              
              <div>
                {/* Search bar moved to right side */}
                <div className="bg-gray-900/10 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-6 text-center">Trouvez rapidement une réponse</h3>
                  <div className="relative mb-6">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher dans notre base de connaissances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl border-0 focus:ring-4 focus:ring-sky-200 text-lg"
                    />
                  </div>
                  <div className="text-center">
                    <Button size="lg">
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez Notre Équipe</h2>
              <p className="text-xl text-gray-600">Choisissez le canal qui vous convient le mieux</p>
            </div>

            <div className="space-y-6">
              {supportChannels.map((channel, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left mb-6 lg:mb-0">
                      <div className={`${channel.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 lg:mb-0 lg:mr-6`}>
                        <channel.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{channel.name}</h3>
                        <p className="text-gray-600 text-lg mb-4">{channel.description}</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>Disponible {channel.availability}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span>Réponse {channel.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button className={`px-8 py-4 rounded-xl font-semibold text-white transition-colors hover:opacity-90 ${channel.color} text-lg`}>
                        {channel.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section with sidebar layout */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
              <p className="text-xl text-gray-600">Les réponses aux questions les plus courantes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
                  <h3 className="font-semibold text-gray-900 mb-6">Catégories</h3>
                  <div className="space-y-2">
                    {faqCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <category.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                {searchFilteredFaqs.length > 0 ? (
                  <div className="space-y-6">
                    {searchFilteredFaqs.map((faq, index) => (
                      <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 pr-4 leading-relaxed">{faq.question}</h3>
                          <div className="flex flex-shrink-0">
                            {[...Array(faq.popularity)].map((_, i) => (
                              <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">{faq.answer}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                          <span className="text-gray-500 font-medium">Cette réponse vous a-t-elle aidé ?</span>
                          <div className="flex space-x-4">
                            <button className="flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium">
                              <span>👍</span>
                              <span>Oui</span>
                            </button>
                            <button className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium">
                              <span>👎</span>
                              <span>Non</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <QuestionMarkCircleIcon className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Aucun résultat trouvé</h3>
                    <p className="text-gray-600 text-lg mb-8">Essayez d'autres mots-clés ou contactez notre support directement.</p>
                    <button className="bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sky-700 transition-colors">
                      Contacter le Support
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ressources Utiles</h2>
              <p className="text-xl text-gray-600">Documentation, tutoriels et formation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Documentation Technique',
                  description: 'Guides détaillés et documentation complète pour maîtriser toutes les fonctionnalités de la plateforme.',
                  icon: BookOpenIcon,
                  color: 'bg-blue-500',
                  items: ['Guide utilisateur complet', 'Documentation API', 'Guides d\'intégration', 'Résolution de problèmes'],
                  action: 'Consulter les Docs',
                  stats: '50+ Guides'
                },
                {
                  title: 'Formation & Webinaires',
                  description: 'Sessions de formation en direct et contenu pédagogique pour optimiser votre utilisation.',
                  icon: AcademicCapIcon,
                  color: 'bg-green-500',
                  items: ['Formation personnalisée', 'Webinaires hebdomadaires', 'Programme de certification', 'Meilleures pratiques'],
                  action: 'Voir les Formations',
                  stats: 'Formation Live'
                },
                {
                  title: 'Communauté & Support',
                  description: 'Rejoignez notre communauté active d\'utilisateurs et bénéficiez de l\'entraide collective.',
                  icon: UserGroupIcon,
                  color: 'bg-cyan-500',
                  items: ['Forum communautaire', 'Groupes régionaux', 'Études de cas', 'Partage d\'expériences'],
                  action: 'Rejoindre la Communauté',
                  stats: '1000+ Membres'
                }
              ].map((resource, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${resource.color} w-16 h-16 rounded-xl flex items-center justify-center`}>
                      <resource.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {resource.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{resource.title}</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">{resource.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {resource.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-gray-700">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gray-900 text-white py-4 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center text-lg">
                    {resource.action}
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Nos Bureaux</h2>
              <p className="text-xl text-gray-300">Support local en Afrique centrale</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {Object.entries(contactInfo).map(([key, office]) => (
                <div key={key} className="bg-gray-800 rounded-2xl p-10 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center mb-8">
                    <GlobeAltIcon className="h-12 w-12 text-sky-300 mr-4" />
                    <h3 className="text-3xl font-bold text-sky-300">{office.city}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <p className="font-semibold text-gray-300 mb-2">Adresse</p>
                        <p className="text-white text-lg">{office.address}</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-300 mb-2">Horaires</p>
                        <p className="text-white text-lg">{office.hours}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="font-semibold text-gray-300 mb-2">Téléphone</p>
                        <a href={`tel:${office.phone}`} className="text-sky-300 hover:text-sky-200 text-lg font-medium">
                          {office.phone}
                        </a>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-300 mb-2">Email</p>
                        <a href={`mailto:${office.email}`} className="text-sky-300 hover:text-sky-200 text-lg font-medium">
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <Button size="lg" className="w-full">
                      Contacter ce Bureau
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
  );
};

export default SupportPage;