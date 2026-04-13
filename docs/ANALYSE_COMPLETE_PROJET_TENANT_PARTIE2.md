# Analyse Complète du Projet - Partie Tenant (Suite)

## 📦 Modules et Fonctionnalités Complètes (Suite)

### 6. 📊 COMPTABILITÉ (Accounting)

**Module**: `src/business-logic/accounting/`

#### Fonctionnalités Principales

##### 6.1 Plan Comptable
- **Gestion des comptes**
  - Code et libellé
  - Type de compte (actif, passif, charge, produit, capitaux)
  - Catégorie et sous-catégorie
  - Compte parent (hiérarchie)
  - Devise
  - Statut (actif/inactif)

##### 6.2 Écritures Comptables
- **Transactions comptables**
  - Numéro d'écriture unique
  - Date et période comptable
  - Type (vente, achat, ajustement, clôture)
  - Référence source (facture, paiement, etc.)
  - Description
  - Statut (brouillon, validé, clôturé)

- **Lignes d'écriture**
  - Compte débité/crédité
  - Montant
  - Libellé
  - Centre de coût
  - Projet

##### 6.3 Grand Livre (General Ledger)
- **Consultation**
  - Par compte
  - Par période
  - Soldes et mouvements
  - Balance générale

##### 6.4 Périodes Comptables
- **Gestion des périodes**
  - Exercice fiscal
  - Périodes mensuelles
  - Ouverture/clôture
  - Verrouillage

##### 6.5 Budgets
- **Planification budgétaire**
  - Budget par compte
  - Budget par département
  - Suivi réalisé vs budget
  - Alertes de dépassement

##### 6.6 Rapports Comptables
- **Rapports standards**
  - Balance générale
  - Grand livre
  - Journal
  - Compte de résultat
  - Bilan
  - Tableau de flux de trésorerie

##### 6.7 Intégration Automatique
- **Événements écoutés**
  - `sale.completed` → Débit 411/Crédit 707
  - `purchase_order.received` → Débit 311/Crédit 401
  - `payment.received` → Débit 512/Crédit 411
  - `stock.adjusted` → Débit 659/Crédit 311 (négatif)
  - `invoice.cancelled` → Écritures d'annulation

##### 6.8 Dashboard Comptable en Temps Réel
- **WebSocket (Gateway)**
  - Soldes de comptes live
  - Transactions récentes
  - Indicateurs clés
  - Alertes

**Tables de Base de Données**:
- `accounts` - Plan comptable
- `account_codes` - Codes comptables
- `accounting_transactions` - Écritures
- `financial_periods` - Périodes
- `budgets` - Budgets

---

### 7. 🏢 PARTENAIRES B2B (Business Partners)

**Module**: `src/business-logic/partners/`

#### Fonctionnalités Principales

##### 7.1 Gestion des Partenaires
- **Types de partenaires**
  - Détaillants (retailers)
  - Grossistes (wholesalers)
  - Clients B2B
  - Distributeurs

- **Informations partenaire**
  - Code partenaire unique
  - Raison sociale et nom commercial
  - Numéro fiscal (TIN)
  - Numéro d'enregistrement
  - Statut (actif, inactif, suspendu, blacklisté)
  - Conditions de paiement (jours)
  - Limite de crédit
  - Score de risque
  - Coordonnées

##### 7.2 Contacts Partenaires
- **Gestion des contacts**
  - Nom et fonction
  - Email et téléphone
  - Contact principal
  - Départements

##### 7.3 Adresses Partenaires
- **Adresses multiples**
  - Type (facturation, livraison, siège)
  - Adresse complète
  - Adresse par défaut

##### 7.4 Webhooks Partenaires
- **Intégrations API**
  - URL de webhook
  - Événements souscrits
  - Authentification
  - Retry policy
  - Logs d'appels

**Tables de Base de Données**:
- `business_partners` - Partenaires
- `partner_contacts` - Contacts
- `partner_addresses` - Adresses
- `partner_webhooks` - Webhooks

---

### 8. 📋 COMMANDES B2B (Sales Orders)

**Module**: `src/business-logic/sales-orders-b2b/`

#### Fonctionnalités Principales

##### 8.1 Cycle de Commande B2B
- **Workflow complet**
  - Création de devis
  - Conversion en commande
  - Vérification de crédit
  - Allocation de stock
  - Préparation (picking)
  - Expédition
  - Facturation
  - Paiement

##### 8.2 Commandes Clients
- **Informations commande**
  - Numéro de commande unique
  - Partenaire client
  - Date de commande
  - Date de livraison prévue
  - Statut
  - Montants (sous-total, remises, taxes, total)
  - Vérification de crédit
  - Source (web, téléphone, EDI)
  - Notes

- **Statuts**
  - Brouillon (draft)
  - Confirmée (confirmed)
  - Crédit vérifié (credit_checked)
  - Bloquée (blocked)
  - En préparation (picking)
  - Expédiée (shipped)
  - Livrée (delivered)
  - Facturée (invoiced)
  - Annulée (cancelled)

##### 8.3 Lignes de Commande
- **Détails par ligne**
  - Produit et quantité
  - Prix unitaire
  - Remises
  - Taxes
  - Total ligne
  - Statut d'allocation
  - Quantité allouée/expédiée

##### 8.4 Vérification de Crédit
- **Contrôle automatique**
  - Vérification de la limite
  - Calcul de l'encours
  - Blocage si dépassement
  - Workflow d'approbation d'exception

##### 8.5 Allocation de Stock
- **Réservation automatique**
  - Par lot et emplacement
  - FIFO/FEFO
  - Gestion des ruptures
  - Backorders

##### 8.6 Préparation et Expédition
- **Picking**
  - Listes de préparation
  - Scan de codes-barres
  - Validation quantités
  - Emballage

- **Expédition**
  - Bon de livraison
  - Transporteur
  - Numéro de suivi
  - Date d'expédition

**Tables de Base de Données**:
- `sales_orders` - Commandes
- `sales_order_lines` - Lignes de commande

---

### 9. 💳 CONTRÔLE DE CRÉDIT (Credit Control)

**Module**: `src/business-logic/credit-control/`

#### Fonctionnalités Principales

##### 9.1 Comptes de Crédit
- **Gestion des comptes**
  - Partenaire associé
  - Limite de crédit
  - Encours actuel
  - Crédit disponible
  - Statut (actif, bloqué, suspendu)
  - Historique des modifications

##### 9.2 Événements de Crédit
- **Suivi des mouvements**
  - Type (utilisation, paiement, ajustement)
  - Montant
  - Solde avant/après
  - Référence (commande, paiement)
  - Date et utilisateur

##### 9.3 Vérification de Crédit
- **Contrôles automatiques**
  - Vérification en temps réel
  - Calcul de l'encours
  - Blocage automatique
  - Notifications

##### 9.4 Approbations d'Exception
- **Workflow d'approbation**
  - Demande de dépassement
  - Approbateur
  - Raison
  - Montant autorisé
  - Durée de validité

##### 9.5 Scoring de Risque
- **Évaluation du risque**
  - Historique de paiement
  - Retards
  - Litiges
  - Score calculé
  - Catégorie de risque

##### 9.6 Recouvrement
- **Gestion des impayés**
  - Aging (30/60/90 jours)
  - Relances automatiques
  - Promesses de paiement
  - Actions de recouvrement

**Tables de Base de Données**:
- `credit_accounts` - Comptes de crédit
- `credit_events` - Événements de crédit

---

### 10. 🔄 RETOURS ET RMA (Returns Management)

**Module**: `src/business-logic/returns-rma/`

#### Fonctionnalités Principales

##### 10.1 Autorisations de Retour (RMA)
- **Création de RMA**
  - Numéro RMA unique
  - Type (client, fournisseur)
  - Raison (défaut, erreur, expiration, rappel)
  - Statut
  - Date de demande
  - Approbation

- **Statuts**
  - Demandé (requested)
  - Approuvé (approved)
  - Rejeté (rejected)
  - En transit (in_transit)
  - Reçu (received)
  - Inspecté (inspected)
  - Complété (completed)
  - Annulé (cancelled)

##### 10.2 Lignes de Retour
- **Détails par ligne**
  - Produit et lot
  - Quantité retournée
  - Raison du retour
  - Condition (bon, endommagé, expiré)
  - Action (remboursement, remplacement, avoir)
  - Décision QC

##### 10.3 Inspection Qualité
- **Contrôle qualité**
  - Inspection visuelle
  - Vérification lot/expiration
  - Test de conformité
  - Décision (accepter, rejeter, détruire)
  - Photos et notes

##### 10.4 Actions de Retour
- **Traitement**
  - Remise en stock
  - Destruction
  - Retour fournisseur
  - Quarantaine

##### 10.5 Avoirs et Remboursements
- **Génération automatique**
  - Avoir client
  - Demande de remboursement fournisseur
  - Remplacement de produit

**Tables de Base de Données**:
- `return_authorizations` - Autorisations RMA
- `return_lines` - Lignes de retour

---

### 11. 📄 TERMES COMMERCIAUX (Commercial Terms)

**Module**: `src/business-logic/commercial-terms/`

#### Fonctionnalités Principales

##### 11.1 Listes de Prix
- **Gestion des prix**
  - Nom et code
  - Devise
  - Date de début/fin
  - Priorité
  - Clients/segments applicables

##### 11.2 Articles de Liste de Prix
- **Prix par produit**
  - Produit
  - Prix unitaire
  - Quantité minimum
  - Unité de mesure
  - Remise incluse

##### 11.3 Règles de Remise
- **Types de remises**
  - Remise en pourcentage
  - Remise en montant
  - Remise par palier de quantité
  - Remise par volume
  - Remise saisonnière
  - Remise contractuelle

- **Conditions**
  - Produits/catégories applicables
  - Clients/segments applicables
  - Quantité minimum
  - Montant minimum
  - Dates de validité
  - Cumul autorisé

##### 11.4 Promotions
- **Gestion des promotions**
  - Code promo
  - Type (pourcentage, montant, gratuit)
  - Conditions d'application
  - Limite d'utilisation
  - Période de validité

##### 11.5 Ristournes (Rebates)
- **Ristournes de fin d'année**
  - Calcul par volume
  - Paliers de ristourne
  - Période de calcul
  - Paiement

**Tables de Base de Données**:
- `price_lists` - Listes de prix
- `price_list_items` - Articles de prix
- `discount_rules` - Règles de remise
- `organization_product_price` - Prix par organisation
- `product_price_history` - Historique des prix

---

### 12. 📊 BUSINESS INTELLIGENCE (BI & Analytics)

**Module**: `src/business-logic/bi/`

#### Fonctionnalités Principales

##### 12.1 Dashboards
- **Tableaux de bord personnalisables**
  - Widgets configurables
  - Filtres dynamiques
  - Actualisation en temps réel
  - Export PDF/Excel
  - Partage

##### 12.2 Rapports
- **Rapports prédéfinis**
  - Ventes par période
  - Performance produits
  - Analyse ABC
  - Rotation des stocks
  - Marge par produit/catégorie
  - Performance fournisseurs
  - Analyse clients

- **Rapports personnalisés**
  - Générateur de requêtes
  - Colonnes sélectionnables
  - Filtres avancés
  - Groupements
  - Calculs agrégés

##### 12.3 KPIs (Indicateurs Clés)
- **Métriques suivies**
  - Chiffre d'affaires
  - Marge brute
  - Rotation des stocks
  - Taux de service
  - DSO (Days Sales Outstanding)
  - Taux de rupture
  - OTIF (On Time In Full)

##### 12.4 Alertes BI
- **Alertes automatiques**
  - Seuils configurables
  - Notifications multi-canal
  - Escalade
  - Historique

##### 12.5 Sources de Données
- **Connexions**
  - Base de données interne
  - APIs externes
  - Fichiers (CSV, Excel)
  - Actualisation planifiée

##### 12.6 Dashboard en Temps Réel
- **WebSocket Gateway**
  - Métriques live
  - Graphiques animés
  - Notifications push

**Tables de Base de Données**:
- `bi_dashboards` - Tableaux de bord
- `bi_reports` - Rapports
- `bi_kpis` - KPIs
- `bi_alerts` - Alertes
- `bi_data_sources` - Sources de données
- `analytics_reports` - Rapports analytics
- `kpi_metrics` - Métriques KPI

---

### 13. 👥 RESSOURCES HUMAINES (HR)

**Module**: `src/business-logic/hr/`

#### Fonctionnalités Principales

##### 13.1 Gestion des Employés
- **Profil employé**
  - Informations personnelles
  - Poste et département
  - Date d'embauche
  - Contrat (CDI, CDD, stage)
  - Salaire et avantages
  - Coordonnées d'urgence
  - Documents (CV, diplômes, contrat)

##### 13.2 Gestion des Horaires
- **Planification**
  - Shifts/postes
  - Horaires de travail
  - Rotations
  - Disponibilités
  - Remplacements

##### 13.3 Présence et Pointage
- **Suivi de présence**
  - Pointage entrée/sortie
  - Heures travaillées
  - Heures supplémentaires
  - Absences
  - Retards

##### 13.4 Congés et Absences
- **Gestion des congés**
  - Types (payés, maladie, sans solde)
  - Demandes de congé
  - Approbation/rejet
  - Soldes de congés
  - Calendrier d'équipe

##### 13.5 Paie
- **Traitement de la paie**
  - Calcul automatique
  - Éléments de paie
  - Déductions
  - Cotisations sociales
  - Bulletins de paie
  - Virements

##### 13.6 Évaluations
- **Gestion des performances**
  - Évaluations périodiques
  - Objectifs
  - Compétences
  - Feedback
  - Plans de développement

##### 13.7 Formation
- **Gestion de la formation**
  - Catalogue de formations
  - Inscriptions
  - Suivi de participation
  - Certifications
  - Renouvellements

**Tables de Base de Données**:
- `hr/employees` - Employés
- `hr/shifts` - Horaires
- `hr/attendance` - Présence
- `hr/leaves` - Congés
- `hr/payroll` - Paie
- `hr/evaluations` - Évaluations
- `training_records` - Formations

---

### 14. 📧 E-INVOICING ET CONFORMITÉ FISCALE

**Module**: `src/business-logic/e-invoice/`

#### Fonctionnalités Principales

##### 14.1 Factures Électroniques
- **Génération conforme**
  - Format XML (UBL, Factur-X)
  - Signature électronique
  - Horodatage
  - QR Code
  - Archivage légal

##### 14.2 Intégration Autorités Fiscales
- **Soumission automatique**
  - API administration fiscale
  - Validation en temps réel
  - Numéro fiscal unique
  - Statut de soumission

##### 14.3 Credentials Fiscaux
- **Gestion des accès**
  - Certificats
  - Clés API
  - Tokens d'authentification
  - Renouvellement automatique

##### 14.4 Audit Fiscal
- **Traçabilité complète**
  - Logs de soumission
  - Réponses autorités
  - Erreurs et rejets
  - Corrections
  - Historique complet

##### 14.5 Rapports Fiscaux
- **Déclarations**
  - TVA
  - Retenue à la source
  - Déclarations périodiques
  - Export comptable

**Tables de Base de Données**:
- `e-invoice/fiscal_invoices` - Factures fiscales
- `e-invoice/fiscal_credentials` - Credentials
- `e-invoice/fiscal_audit_logs` - Logs d'audit

---

### 15. 💉 VACCINATION

**Module**: `src/business-logic/vaccination/`

#### Fonctionnalités Principales

##### 15.1 Gestion des Vaccins
- **Catalogue de vaccins**
  - Nom et fabricant
  - Type de vaccin
  - Maladies ciblées
  - Schéma vaccinal
  - Âge recommandé
  - Contre-indications

##### 15.2 Rendez-vous de Vaccination
- **Planification**
  - Prise de rendez-vous
  - Calendrier
  - Rappels automatiques
  - Confirmation
  - Annulation/report

##### 15.3 Dossiers de Vaccination
- **Historique vaccinal**
  - Vaccins reçus
  - Dates d'administration
  - Lots et numéros
  - Rappels à venir
  - Carnet de vaccination digital

##### 15.4 Administration
- **Injection**
  - Enregistrement de l'acte
  - Fiole utilisée
  - Site d'injection
  - Professionnel administrant
  - Consentement

##### 15.5 Certificats de Vaccination
- **Génération automatique**
  - Certificat PDF
  - QR Code vérifiable
  - Pass sanitaire
  - Conformité internationale

##### 15.6 Effets Secondaires
- **Pharmacovigilance**
  - Déclaration d'effets indésirables
  - Gravité
  - Suivi
  - Notification autorités

##### 15.7 Gestion des Fioles
- **Traçabilité**
  - Numéro de fiole
  - Lot et expiration
  - Doses disponibles/utilisées
  - Chaîne du froid
  - Destruction

##### 15.8 Prévisions de Demande
- **Forecasting**
  - Campagnes de vaccination
  - Saisonnalité
  - Besoins en doses
  - Commandes prévisionnelles

**Tables de Base de Données**:
- `vaccination_appointments` - Rendez-vous
- `vaccination_records` - Dossiers
- `vaccination_injections` - Injections
- `vaccination_certificates` - Certificats
- `vaccination_side_effects` - Effets secondaires
- `vaccine_vials` - Fioles
- `vaccine_demand_forecasts` - Prévisions

---

### 16. 🔔 NOTIFICATIONS

**Module**: `src/business-logic/notification/`

#### Fonctionnalités Principales

##### 16.1 Canaux de Notification
- **Multi-canal**
  - Email (SMTP, SendGrid)
  - SMS (Twilio, Vonage)
  - WhatsApp Business
  - Push notifications (Firebase)
  - In-app notifications

##### 16.2 Templates
- **Modèles personnalisables**
  - Variables dynamiques
  - Multi-langue
  - HTML/Texte
  - Prévisualisation
  - Versioning

##### 16.3 Événements
- **Déclencheurs automatiques**
  - Vente complétée
  - Prescription prête
  - Rappel de renouvellement
  - Alerte de stock
  - Rendez-vous vaccination
  - Facture émise
  - Paiement reçu

##### 16.4 Préférences Utilisateur
- **Gestion des préférences**
  - Canaux préférés
  - Fréquence
  - Opt-in/opt-out
  - Horaires de réception

##### 16.5 File d'Attente
- **Traitement asynchrone**
  - BullMQ
  - Retry automatique
  - Dead letter queue
  - Monitoring

##### 16.6 Historique
- **Traçabilité**
  - Notifications envoyées
  - Statut de livraison
  - Ouvertures et clics
  - Erreurs

**Tables de Base de Données**:
- `notifications` - Notifications
- `notification_templates` - Templates
- `device_tokens` - Tokens d'appareils

---

