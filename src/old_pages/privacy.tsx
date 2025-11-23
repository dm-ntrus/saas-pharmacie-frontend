import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheckIcon, DocumentTextIcon, KeyIcon, EyeIcon } from '@heroicons/react/24/outline';

const PrivacyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité - NakiCode PharmaSaaS</title>
        <meta name="description" content="Politique de confidentialité et protection des données de NakiCode PharmaSaaS. Conformité RGPD et sécurité des données pharmaceutiques." />
      </Head>

      <div className="min-h-screen bg-white">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-xl font-bold text-sky-600">NakiCode PharmaSaaS</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <ShieldCheckIcon className="h-16 w-16 text-sky-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Politique de Confidentialité</h1>
            <p className="text-xl text-gray-600">Dernière mise à jour : 21 janvier 2025</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                NakiCode ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. Cette politique explique quand et pourquoi nous collectons des informations personnelles, comment nous les utilisons, les conditions dans lesquelles nous pouvons les divulguer à des tiers et comment nous les protégeons.
              </p>
              <p className="text-gray-600">
                Cette politique s'applique à tous les utilisateurs de la plateforme NakiCode PharmaSaaS, incluant les pharmacies, leurs employés, et les patients dont les données sont traitées via notre système.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données Collectées</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Données d'Inscription</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Nom et prénom de l'utilisateur</li>
                <li>Adresse email professionnelle</li>
                <li>Numéro de téléphone</li>
                <li>Informations sur la pharmacie (nom, adresse, licence)</li>
                <li>Rôle et fonction dans la pharmacie</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Données d'Utilisation</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Logs de connexion et d'activité</li>
                <li>Adresse IP et informations sur l'appareil</li>
                <li>Pages visitées et fonctionnalités utilisées</li>
                <li>Données de performance et d'erreur</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Données Pharmaceutiques</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Informations sur les médicaments et produits</li>
                <li>Données de prescription (avec consentement patient)</li>
                <li>Informations client anonymisées</li>
                <li>Transactions et données financières</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des Données</h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <p className="text-blue-700">
                    <strong>Finalités principales :</strong> Fournir nos services SaaS de gestion pharmaceutique, assurer la sécurité des données et améliorer l'expérience utilisateur.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Services Principaux</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Gestion des ventes et inventaire</li>
                <li>Traitement des prescriptions</li>
                <li>Génération de rapports et analyses</li>
                <li>Support technique et formation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Amélioration des Services</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Analyse d'usage pour optimiser les fonctionnalités</li>
                <li>Développement de nouvelles fonctionnalités</li>
                <li>Prévention de la fraude et sécurité</li>
                <li>Conformité réglementaire</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sécurité des Données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <KeyIcon className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Chiffrement</h3>
                  <p className="text-sm text-gray-600">Données chiffrées en transit (TLS 1.3) et au repos (AES-256)</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                  <p className="text-sm text-gray-600">ISO 27001, SOC 2 Type II et conformité HIPAA</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Mesures Techniques</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Authentification à deux facteurs obligatoire</li>
                <li>Surveillance continue des accès et activités</li>
                <li>Sauvegardes chiffrées quotidiennes</li>
                <li>Tests de sécurité réguliers par des tiers</li>
                <li>Séparation stricte des données par tenant</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Mesures Organisationnelles</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Formation continue du personnel sur la sécurité</li>
                <li>Accès aux données sur base du besoin de savoir</li>
                <li>Audits de sécurité trimestriels</li>
                <li>Plan de réponse aux incidents</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos Droits</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <EyeIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                  <p className="text-green-700">
                    <strong>Transparence totale :</strong> Vous avez le droit de savoir exactement quelles données nous détenons sur vous et comment elles sont utilisées.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Droits d'Accès</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Consulter vos données personnelles</li>
                    <li>Obtenir une copie de vos données</li>
                    <li>Connaître les finalités de traitement</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Droits de Contrôle</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Rectifier des données inexactes</li>
                    <li>Supprimer vos données (droit à l'oubli)</li>
                    <li>Limiter le traitement</li>
                    <li>Portabilité des données</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                <strong>Comment exercer vos droits :</strong> Contactez notre Délégué à la Protection des Données à l'adresse 
                <a href="mailto:privacy@nakicode.com" className="text-sky-600 hover:text-sky-800 ml-1">privacy@nakicode.com</a> 
                avec une pièce d'identité. Nous répondons sous 30 jours.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partage des Données</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Principe de Non-Divulgation</h3>
              <p className="text-gray-600 mb-4">
                Nous ne vendons, ne louons et ne partageons jamais vos données personnelles à des fins commerciales. 
                Vos données pharmaceutiques restent strictement confidentielles et appartiennent à votre pharmacie.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Cas Exceptionnels de Partage</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Prestataires techniques :</strong> Hébergement sécurisé et maintenance (sous contrat strict)</li>
                <li><strong>Obligations légales :</strong> Réquisitions judiciaires ou autorités de santé</li>
                <li><strong>Protection des droits :</strong> Prévention de fraude ou activités illégales</li>
                <li><strong>Transferts d'entreprise :</strong> En cas de fusion/acquisition (avec notification préalable)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Conservation des Données</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700">
                  <strong>Durée de conservation :</strong> Nous conservons vos données uniquement le temps nécessaire aux finalités 
                  de traitement et conformément aux obligations légales pharmaceutiques (minimum 5 ans pour les données de prescription).
                </p>
              </div>

              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Type de Données</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Durée de Conservation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Compte utilisateur actif</td>
                    <td className="border border-gray-300 px-4 py-2">Durée de l'abonnement + 1 an</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Données de prescription</td>
                    <td className="border border-gray-300 px-4 py-2">5 ans (obligation légale)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Données financières</td>
                    <td className="border border-gray-300 px-4 py-2">7 ans (obligations comptables)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Logs techniques</td>
                    <td className="border border-gray-300 px-4 py-2">12 mois maximum</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferts Internationaux</h2>
              <p className="text-gray-600 mb-4">
                Vos données sont hébergées principalement en Afrique (centres de données à Johannesburg et Lagos) 
                pour garantir la souveraineté des données. Certains services de support peuvent nécessiter des 
                transferts vers l'Union Européenne, toujours sous garanties appropriées (clauses contractuelles types).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies et Technologies Similaires</h2>
              <p className="text-gray-600 mb-4">
                Nous utilisons des cookies essentiels au fonctionnement du service, des cookies d'analyse 
                (avec votre consentement) et des cookies de sécurité. Vous pouvez gérer vos préférences 
                via le panneau de configuration accessible dans votre compte.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact et Réclamations</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Délégué à la Protection des Données</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email :</strong> privacy@nakicode.com</p>
                  <p><strong>Adresse :</strong> NakiCode SAS, Avenue Colonel Ebeya, Q/Socimat, Gombe, Kinshasa</p>
                  <p><strong>Téléphone :</strong> +243 99 123 4567</p>
                </div>
              </div>

              <p className="text-gray-600 mt-4">
                <strong>Autorités de contrôle :</strong> En cas de désaccord avec notre traitement de vos données, 
                vous pouvez saisir la Commission Nationale de l'Informatique et des Libertés (CNIL) en France 
                ou l'autorité compétente de votre pays de résidence.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications de cette Politique</h2>
              <p className="text-gray-600">
                Nous pouvons mettre à jour cette politique de temps en temps. Les modifications importantes 
                seront notifiées par email aux utilisateurs actifs au moins 30 jours avant leur entrée en vigueur. 
                La version actuelle est toujours disponible sur cette page avec la date de dernière mise à jour.
              </p>
            </section>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              Cette politique de confidentialité est effective depuis le 21 janvier 2025.
            </p>
            <Link 
              href="/"
              className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;