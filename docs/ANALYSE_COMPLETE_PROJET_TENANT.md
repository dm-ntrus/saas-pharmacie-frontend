# Analyse Complète du Projet - Partie Tenant

## 📋 Table des Matières

1. [Vue d'Ensemble du Projet](#vue-densemble-du-projet)
2. [Architecture Globale](#architecture-globale)
3. [Modules et Fonctionnalités Complètes](#modules-et-fonctionnalités-complètes)
4. [Schéma de Base de Données Tenant](#schéma-de-base-de-données-tenant)
5. [Intégrations et Services](#intégrations-et-services)
6. [Sécurité et Permissions](#sécurité-et-permissions)

---

## 🎯 Vue d'Ensemble du Projet

### Informations Générales

- **Nom**: PharmaApp SaaS Backend - Multi-Tenant Platform
- **Version**: 1.0.0
- **Statut**: ✅ Production Ready
- **Framework**: NestJS 11
- **Base de données**: SurrealDB 1.3+
- **Authentification**: Keycloak 26+ (JWT avec Organizations)
- **Architecture**: Multi-tenant avec isolation complète des données

### Objectif Principal

Plateforme SaaS complète pour la gestion de pharmacies avec support multi-tenant, incluant:
- Gestion complète de l'inventaire pharmaceutique
- Point de vente (POS) et ventes
- Gestion de la chaîne d'approvisionnement
- Prescriptions et patients
- Comptabilité et facturation
- Business Intelligence et Analytics
- Ressources Humaines
- E-invoicing et conformité fiscale

---

## 🏗️ Architecture Globale

### Structure des Répertoires

```
saas-pharmacie-backend/
├── src/
│   ├── business-logic/          # 40+ modules métier
│   ├── tenant/                  # Gestion multi-tenant
│   ├── plateform/               # Services plateforme
│   ├── auth/                    # Authentification
│   ├── keycloak/                # Intégration Keycloak
│   ├── identity/                # Gestion identités
│   ├── pharmacy/                # Configuration pharmacies
│   ├── surrealdb-config/        # Configuration SurrealDB
│   ├── ai/                      # Intelligence Artificielle
│   ├── bff/                     # Backend for Frontend
│   └── shared/                  # Utilitaires partagés
├── db/
│   └── schema/
│       ├── tables/
│       │   ├── tenant/          # 130+ tables tenant
│       │   ├── plateform/       # Tables plateforme
│       │   └── hybrid/          # Tables partagées
│       ├── migrations/          # Migrations de schéma
│       └── functions/           # Fonctions SurrealDB
└── docs/                        # Documentation complète
```

### Principes Architecturaux

1. **Clean Architecture**: Séparation Domain/Application/Infrastructure
2. **Multi-Tenancy**: Isolation complète par tenant avec databases dédiées
3. **Event-Driven**: EventEmitter2 pour communication inter-modules
4. **SAGA Pattern**: Transactions distribuées avec rollback automatique
5. **CQRS**: Séparation lecture/écriture pour performance
6. **Repository Pattern**: Abstraction de la persistance

---

## 📦 Modules et Fonctionnalités Complètes


### 1. 📦 GESTION DE L'INVENTAIRE (Inventory Management)

**Module**: `src/business-logic/inventory/`

#### Fonctionnalités Principales

##### 1.1 Gestion des Produits
- **Création et gestion de produits pharmaceutiques**
  - Informations de base (nom, SKU, code-barres, fabricant)
  - Classification (catégorie, forme galénique, principe actif)
  - Propriétés pharmaceutiques (narcotique, chaîne du froid, DEA schedule)
  - Conditions de stockage et métadonnées
  - Images et documentation
  - Codes ATC et classe thérapeutique
  - Prix de référence avec historique

- **Recherche et filtrage avancés**
  - Par SKU, code-barres, nom, fabricant
  - Par catégorie et type
  - Par statut (actif, discontinué)
  - Avec prix par organisation

##### 1.2 Gestion des Lots (Batches)
- **Suivi complet des lots**
  - Numéro de lot unique
  - Date d'expiration et alertes
  - Quantités (actuelle, réservée, disponible)
  - Coût unitaire et valeur totale
  - Statut (actif, expiré, rappelé, disposé)
  - Localisation dans l'entrepôt

- **Opérations sur les lots**
  - Ajustements de quantité avec raison
  - Transferts entre emplacements
  - Désactivation et disposition
  - Historique complet des mouvements

##### 1.3 Emplacements d'Inventaire
- **Gestion des emplacements**
  - Types: entrepôt, étagère, réfrigérateur, coffre-fort
  - Catégories d'affichage: vente, stockage, quarantaine
  - Capacité et conditions de stockage
  - Hiérarchie parent-enfant
  - Activation/désactivation

- **Suivi par emplacement**
  - Inventaire par emplacement
  - Historique des mouvements
  - Capacité utilisée vs disponible

##### 1.4 Alertes d'Inventaire
- **Types d'alertes**
  - Stock faible (low_stock)
  - Rupture de stock (out_of_stock)
  - Expiration proche (expiring_soon)
  - Lot expiré (expired)
  - Température hors limites (temperature_alert)
  - Rappel de lot (batch_recall)

- **Gestion des alertes**
  - Niveaux de sévérité (critique, élevé, moyen, faible)
  - Accusé de réception
  - Résolution avec notes
  - Mise en veille temporaire
  - Notifications automatiques

##### 1.5 Réservations de Stock
- **Système de réservation**
  - Réservation pour commandes POS
  - Réservation pour prescriptions
  - Expiration automatique (15 minutes par défaut)
  - Allocation par lot et emplacement
  - Annulation et libération

##### 1.6 Transferts de Stock
- **Gestion des transferts**
  - Entre emplacements
  - Entre pharmacies (multi-site)
  - Statuts: brouillon, en transit, reçu, annulé
  - Lignes de transfert détaillées
  - Réception partielle ou complète

##### 1.7 Comptages d'Inventaire
- **Types de comptage**
  - Complet (full)
  - Cyclique (cycle)
  - Spot check
  - Substances contrôlées

- **Processus de comptage**
  - Création et planification
  - Démarrage et verrouillage
  - Saisie des comptages par ligne
  - Calcul des écarts
  - Application des ajustements
  - Génération d'événements comptables

##### 1.8 Rappels de Lots
- **Gestion des rappels**
  - Types: volontaire, réglementaire, qualité
  - Niveaux de risque: critique, élevé, moyen, faible
  - Statut: initié, en cours, complété, annulé
  - Actions: retrait, retour, destruction
  - Suivi des quantités affectées

##### 1.9 Substances Contrôlées
- **Traçabilité DEA**
  - Logs d'actions (dispensation, ajustement, destruction)
  - Schedules DEA (I à V)
  - Signatures et autorisations
  - Rapports réglementaires

##### 1.10 Transactions d'Inventaire
- **Historique complet (append-only)**
  - Types: réception, vente, ajustement, transfert, retour
  - Traçabilité complète
  - Audit réglementaire
  - Rapports comptables

##### 1.11 Analytics et Rapports
- **Analyses de stock**
  - Niveaux de stock par catégorie
  - Suggestions de réapprovisionnement
  - Valeur totale de l'inventaire
  - Rotation des stocks
  - Rapport d'expiration
  - Analyse ABC

**Tables de Base de Données**:
- `products` - Produits
- `product_batches` - Lots de produits
- `inventory_locations` - Emplacements
- `inventory_alerts` - Alertes
- `inventory_reservations` - Réservations
- `stock_transfers` - Transferts
- `inventory_counts` - Comptages
- `batch_recalls` - Rappels
- `controlled_substance_logs` - Substances contrôlées
- `inventory_transactions` - Transactions (append-only)
- `inventory_items` - Items d'inventaire
- `inventory_events` - Événements
- `inventory_policies` - Politiques

---

### 2. 💰 VENTES ET POINT DE VENTE (Sales & POS)

**Module**: `src/business-logic/sales/`

#### Fonctionnalités Principales

##### 2.1 Point de Vente (POS)
- **Création de ventes**
  - Ventes au comptant et à crédit
  - Support multi-articles
  - Calcul automatique des totaux
  - Gestion des remises (montant et pourcentage)
  - Calcul de la TVA
  - Gestion de la monnaie rendue
  - Idempotence (clé unique pour éviter doublons)

- **Méthodes de paiement**
  - Espèces (cash)
  - Carte bancaire (card)
  - Mobile Money
  - Crédit (credit)
  - Assurance (insurance)
  - Mixte (mixed)

##### 2.2 Gestion des Ventes
- **Statuts de vente**
  - En attente (pending)
  - Complétée (completed)
  - Partiellement payée (partially_paid)
  - Remboursée (refunded)
  - Annulée (cancelled)

- **Informations de vente**
  - Numéro de vente unique
  - Patient associé (optionnel)
  - Caissier
  - Articles vendus avec détails
  - Montants (sous-total, taxes, remises, total)
  - Source (prescription, walk-in, etc.)
  - Assurance (fournisseur, police, couverture)

##### 2.3 Articles de Vente
- **Détails par article**
  - Produit et quantité
  - Prix unitaire et remises
  - Lot et numéro de lot
  - Coût unitaire (pour calcul marge)
  - Emplacement de prélèvement
  - Lien vers ligne de prescription
  - Indicateur cadeau

##### 2.4 Remboursements et Retours
- **Gestion des remboursements**
  - Remboursement complet ou partiel
  - Génération de numéro de retour
  - Raison du remboursement
  - Mise à jour du statut
  - Événements pour comptabilité
  - Annulation des points de fidélité

##### 2.5 Réservations de Panier
- **Système anti-survente**
  - Réservation temporaire (15 min)
  - Vérification de stock en temps réel
  - Libération automatique à expiration
  - Rollback en cas d'échec

##### 2.6 Sessions de Caisse
- **Gestion des sessions**
  - Ouverture avec fond de caisse
  - Suivi des transactions
  - Clôture avec comptage
  - Écarts de caisse
  - Rapports de session

##### 2.7 Rapports de Ventes
- **Analytics**
  - Total des ventes par période
  - Revenu total
  - Transaction moyenne
  - Produits les plus vendus
  - Ventes par caissier
  - Ventes par méthode de paiement

##### 2.8 Intégrations
- **Événements émis**
  - `sale.completed` → Inventaire, Comptabilité, Fidélité
  - `sale.refunded` → Comptabilité, Inventaire, Fidélité
  - Déduction automatique du stock
  - Création d'écritures comptables
  - Attribution de points de fidélité

**Tables de Base de Données**:
- `sales` - Ventes
- `sale_items` - Articles de vente (relation)
- `cashier_sessions` - Sessions de caisse
- `daily_sales_reports` - Rapports quotidiens
- `sales_return_document` - Documents de retour

---

### 3. 🚚 CHAÎNE D'APPROVISIONNEMENT (Supply Chain)

**Module**: `src/business-logic/supply-chain/`

#### Fonctionnalités Principales

##### 3.1 Gestion des Fournisseurs
- **Informations fournisseur**
  - Code fournisseur unique
  - Nom et type (grossiste, fabricant, distributeur)
  - Statut (actif, inactif, suspendu, blacklisté)
  - Coordonnées complètes
  - Personne de contact
  - Conditions de paiement et livraison
  - Évaluation et certifications
  - Licences

- **Opérations**
  - Création et mise à jour
  - Recherche et filtrage
  - Désactivation
  - Historique des commandes

##### 3.2 Demandes d'Achat (Purchase Requests)
- **Workflow de demande**
  - Création en brouillon
  - Lignes de demande avec produits
  - Soumission pour approbation
  - Approbation/rejet
  - Conversion en bon de commande
  - Annulation

- **Statuts**
  - Brouillon (draft)
  - Soumis (submitted)
  - Approuvé (approved)
  - Rejeté (rejected)
  - Converti (converted)
  - Annulé (cancelled)

##### 3.3 Bons de Commande (Purchase Orders)
- **Création et gestion**
  - Numéro de commande unique
  - Fournisseur et date de commande
  - Date de livraison prévue
  - Lignes de commande détaillées
  - Calculs automatiques (sous-total, taxes, frais)
  - Adresse de livraison
  - Notes et instructions

- **Statuts de commande**
  - Brouillon (draft)
  - Commandé (ordered)
  - Partiellement reçu (partially_received)
  - Reçu (received)
  - Annulé (cancelled)

- **Lignes de commande**
  - Produit et quantités
  - Coût unitaire
  - Quantité commandée/reçue/en attente
  - Statut par ligne
  - Numéro de lot et expiration

##### 3.4 Réception de Marchandises (Goods Receipt)
- **Processus de réception**
  - Génération de numéro GRN
  - Réception par ligne de commande
  - Quantités reçues/acceptées/rejetées
  - Contrôle qualité (QC)
  - Numéros de lot et dates d'expiration
  - Coûts unitaires
  - Notes de réception

- **Transaction SAGA**
  - Mise à jour des lignes de commande
  - Création du GRN header et lignes
  - Mise à jour du statut de la commande
  - Publication d'événements via Outbox
  - Rollback automatique en cas d'erreur

- **Événements**
  - `purchase_order.received` → Inventaire, Comptabilité
  - Création automatique des lots
  - Écritures comptables (Débit 311, Crédit 401)

##### 3.5 Devis Fournisseurs
- **Gestion des devis**
  - Devis par produit et fournisseur
  - Prix unitaire et devise
  - Quantité minimum de commande
  - Délai de livraison
  - Référence du devis
  - Date de validité
  - Comparaison multi-fournisseurs

##### 3.6 Contrats Fournisseurs
- **Gestion contractuelle**
  - Numéro de contrat
  - Dates de début et fin
  - Conditions de paiement
  - Remises contractuelles
  - Volumes minimums
  - Pénalités et bonus
  - Renouvellement automatique

##### 3.7 Performance Fournisseurs
- **Métriques de performance**
  - Taux de livraison à temps (OTIF)
  - Taux de qualité
  - Délai moyen de livraison
  - Taux de conformité
  - Évaluation globale
  - Historique des incidents

##### 3.8 Prévisions de Demande
- **Forecasting**
  - Prévisions par produit
  - Méthodes: historique, saisonnalité, ML
  - Périodes de prévision
  - Niveau de confiance
  - Ajustements manuels

##### 3.9 Politiques d'Inventaire
- **Règles de réapprovisionnement**
  - Point de commande (reorder point)
  - Quantité de commande économique (EOQ)
  - Stock de sécurité
  - Délai de réapprovisionnement
  - Fournisseur préféré

##### 3.10 Alertes Supply Chain
- **Types d'alertes**
  - Rupture de stock imminente
  - Retard de livraison
  - Problème qualité
  - Dépassement de budget
  - Performance fournisseur

##### 3.11 Dashboard Supply Chain
- **Indicateurs clés**
  - Commandes en cours
  - Valeur des commandes
  - Taux de service
  - Rotation des stocks
  - Coût d'approvisionnement
  - Performance fournisseurs

**Tables de Base de Données**:
- `suppliers` - Fournisseurs
- `supplier_contracts` - Contrats
- `supplier_products` - Produits fournisseurs
- `supplier_product_quotes` - Devis
- `purchase_requests` - Demandes d'achat
- `purchase_request_lines` - Lignes de demande
- `purchase_orders` - Bons de commande
- `purchase_order_items` - Lignes de commande
- `goods_receipts` - Réceptions
- `goods_receipt_lines` - Lignes de réception
- `demand_forecasts` - Prévisions
- `inventory_policies` - Politiques
- `supplier_performance` - Performance

---

### 4. 💊 PRESCRIPTIONS ET PATIENTS

**Module**: `src/business-logic/prescriptions/` et `src/business-logic/patients/`

#### Fonctionnalités Principales

##### 4.1 Gestion des Patients
- **Profil patient complet**
  - Informations démographiques
  - Coordonnées et adresse
  - Assurance santé
  - Allergies et conditions médicales
  - Historique médical
  - Préférences de communication
  - Consentements

- **Patients multi-pharmacies**
  - Support de patients partagés entre pharmacies
  - Historique unifié
  - Synchronisation des données

##### 4.2 Prescriptions
- **Cycle de vie complet**
  - Réception (papier, électronique, téléphone)
  - Vérification par pharmacien
  - Préparation
  - Dispensation
  - Conseil pharmaceutique

- **Types de prescriptions**
  - Nouvelle (new)
  - Renouvellement (refill)
  - Transfert entrant/sortant
  - Urgence (emergency)
  - Préparation magistrale (compound)

- **Informations prescripteur**
  - Nom et NPI
  - Numéro DEA
  - Coordonnées (téléphone, fax)

- **Statuts**
  - En attente (pending)
  - Vérifiée (verified)
  - En cours (in_progress)
  - Prête (ready)
  - Dispensée (dispensed)
  - Annulée (cancelled)
  - Retournée (returned)
  - En attente (on_hold)

##### 4.3 Articles de Prescription
- **Détails par médicament**
  - Produit et quantité
  - Posologie et instructions
  - Renouvellements autorisés/restants
  - Jours de traitement
  - Substitution autorisée
  - Statut de dispensation

##### 4.4 Fonctionnalités Avancées

**OCR et Ingestion**
- Reconnaissance optique de caractères
- Extraction automatique des données
- Validation et correction

**NLP (Natural Language Processing)**
- Analyse des instructions
- Extraction des posologies
- Détection d'anomalies

**Analyse et Interactions**
- Vérification des interactions médicamenteuses
- Alertes d'allergies
- Contre-indications
- Duplications thérapeutiques

**Substitution**
- Génériques disponibles
- Équivalents thérapeutiques
- Règles de substitution

**Assurance**
- Vérification d'éligibilité
- Soumission de réclamations
- Calcul des co-paiements
- Autorisation préalable

**Conformité Légale**
- Validation réglementaire
- Substances contrôlées
- Limites de quantité
- Prescripteur autorisé

**Scellement Digital**
- Signature électronique
- Horodatage
- Intégrité des données
- Non-répudiation

**Monitoring**
- Suivi de l'adhérence
- Alertes de renouvellement
- Rappels de prise
- Fin de traitement

**Préparation de Doses**
- Piluliers
- Doses unitaires
- Étiquetage automatique

**Revue Médicamenteuse**
- Revue complète du profil
- Optimisation thérapeutique
- Recommandations

##### 4.5 Livraison
- **Méthodes**
  - Retrait en magasin (in_store_pickup)
  - Livraison à domicile (home_delivery)
  - Retrait en voiture (curbside_pickup)
  - Courrier (mail_order)

- **Suivi**
  - Notifications de statut
  - Rappels de retrait
  - Confirmation de livraison

**Tables de Base de Données**:
- `patients` - Patients
- `enhanced_patients` - Profils enrichis
- `patient_user` - Lien patient-utilisateur
- `prescriptions` - Prescriptions
- `prescription_items` - Articles de prescription

---

### 5. 💳 FACTURATION ET PAIEMENTS (Billing & Payments)

**Module**: `src/business-logic/billing/` et `src/business-logic/payments/`

#### Fonctionnalités Principales

##### 5.1 Facturation
- **Génération de factures**
  - Numéro de facture unique
  - Lien avec vente ou commande
  - Calcul automatique des montants
  - Taxes et remises
  - Conditions de paiement
  - Échéances

- **Types de factures**
  - Facture de vente
  - Facture B2B
  - Facture d'assurance
  - Facture récurrente

- **Statuts**
  - Brouillon (draft)
  - Émise (issued)
  - Envoyée (sent)
  - Partiellement payée (partially_paid)
  - Payée (paid)
  - En retard (overdue)
  - Annulée (cancelled)

##### 5.2 Articles de Facture
- **Détails par ligne**
  - Description et quantité
  - Prix unitaire
  - Remises
  - Taxes
  - Total ligne

##### 5.3 Paiements
- **Enregistrement des paiements**
  - Montant et devise
  - Méthode de paiement
  - Référence de transaction
  - Date de paiement
  - Lien avec facture(s)

- **Méthodes supportées**
  - Espèces
  - Carte bancaire
  - Virement bancaire
  - Mobile Money
  - Chèque

##### 5.4 Avoirs et Notes de Débit
- **Gestion des avoirs**
  - Création suite à retour
  - Montant et raison
  - Application sur factures
  - Remboursement

##### 5.5 Rapprochement Bancaire
- **Transactions bancaires**
  - Import automatique
  - Rapprochement avec paiements
  - Écarts et ajustements

##### 5.6 Intégrations Paiement
- **Provider cartes bancaires**
  - Paiements en ligne
  - Webhooks
  - Gestion des échecs

- **Mobile Money**
  - Orange Money
  - MTN Mobile Money
  - Moov Money

**Tables de Base de Données**:
- `invoices` - Factures
- `invoice_items` - Articles de facture
- `payments` - Paiements
- `bank_accounts` - Comptes bancaires
- `bank_transactions` - Transactions bancaires

---

