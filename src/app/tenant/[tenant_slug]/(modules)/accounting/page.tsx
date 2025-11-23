"use client";
import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartPieIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PrinterIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { Card, Button } from "@/design-system";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { CreateTransactionModal } from "@/components/accounting/CreateTransactionModal";
import { CreateAccountModal } from "@/components/accounting/CreateAccountModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { CreateJournalEntryModal } from "@/components/accounting/CreateJournalEntryModal";
import { CreateInvoiceModal } from "@/components/accounting/CreateInvoiceModal";
import { CreateExpenseModal } from "@/components/accounting/CreateExpenseModal";
import { RecordInvoicePaymentModal } from "@/components/accounting/RecordInvoicePaymentModal";
import { ApproveExpenseModal } from "@/components/accounting/ApproveExpenseModal";

const AccountingPage = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("this_month");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isJournalEntryModalOpen, setIsJournalEntryModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isApproveExpenseModalOpen, setIsApproveExpenseModalOpen] =
    useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{
    id: string;
    number: string;
    amount: number;
  } | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<{
    id: string;
    description: string;
    amount: number;
  } | null>(null);

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      // Mock data - à remplacer par l'API réelle
      return [
        {
          id: "1",
          date: "2025-01-21",
          description: "Vente médicaments",
          type: "income",
          category: "Ventes",
          amount: 125000,
          account: "Caisse Principale",
          status: "paid",
          reference: "FACT-2025-001",
        },
        {
          id: "2",
          date: "2025-01-20",
          description: "Achat stocks fournisseur",
          type: "expense",
          category: "Achats",
          amount: 85000,
          account: "Compte Bancaire",
          status: "approved",
          reference: "BC-2025-012",
        },
      ];
    },
  });

  const { data: financialReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["financial-reports"],
    queryFn: async () => {
      // Mock data - à remplacer par l'API réelle
      return {
        monthlyData: [
          {
            month: "Sep",
            revenus: 2800000,
            depenses: 1950000,
            benefice: 850000,
          },
          {
            month: "Oct",
            revenus: 3200000,
            depenses: 2100000,
            benefice: 1100000,
          },
          {
            month: "Nov",
            revenus: 2950000,
            depenses: 2250000,
            benefice: 700000,
          },
          {
            month: "Déc",
            revenus: 3800000,
            depenses: 2600000,
            benefice: 1200000,
          },
          {
            month: "Jan",
            revenus: 3500000,
            depenses: 2400000,
            benefice: 1100000,
          },
        ],
        expensesByCategory: [
          {
            name: "Achats Médicaments",
            value: 45,
            amount: 1800000,
            color: "#3B82F6",
          },
          { name: "Personnel", value: 25, amount: 1000000, color: "#10B981" },
          {
            name: "Charges Fixes",
            value: 15,
            amount: 600000,
            color: "#F59E0B",
          },
          { name: "Marketing", value: 8, amount: 320000, color: "#EF4444" },
          { name: "Autres", value: 7, amount: 280000, color: "#6B7280" },
        ],
      };
    },
  });

  const postTransactionMutation = useMutation({
    mutationFn: (id: string) => apiClient.postTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'une transation");
    },
  });

  const kpiData = [
    {
      title: "Chiffre d'Affaires",
      value: "3,500,000 FC",
      change: "+8.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
    },
    {
      title: "Total Dépenses",
      value: "2,400,000 FC",
      change: "-3.2%",
      trend: "down",
      icon: ReceiptRefundIcon,
      color: "bg-red-500",
    },
    {
      title: "Bénéfice Net",
      value: "1,100,000 FC",
      change: "+15.8%",
      trend: "up",
      icon: ChartPieIcon,
      color: "bg-blue-500",
    },
    {
      title: "Marge Brute",
      value: "31.4%",
      change: "+2.1%",
      trend: "up",
      icon: ArrowTrendingUpIcon,
      color: "bg-cyan-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "approved":
        return "Approuvé";
      case "pending":
        return "En attente";
      default:
        return "Inconnu";
    }
  };

  const stats = [
    {
      title: "Transactions ce Mois",
      value: transactions.length.toString(),
      icon: DocumentTextIcon,
      color: "bg-blue-500",
    },
    {
      title: "En Attente",
      value: transactions
        .filter((t) => t.status === "pending")
        .length.toString(),
      icon: ExclamationTriangleIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Approuvées",
      value: transactions
        .filter((t) => t.status === "approved")
        .length.toString(),
      icon: CheckCircleIcon,
      color: "bg-green-500",
    },
    {
      title: "Comptes Actifs",
      value: "5",
      icon: BanknotesIcon,
      color: "bg-cyan-500",
    },
  ];

  const handleApproveTransaction = (id: string) => {
    postTransactionMutation.mutateAsync(id);
  };

  const handleRecordPayment = (invoice: {
    id: string;
    number: string;
    amount: number;
  }) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleApproveExpense = (expense: {
    id: string;
    description: string;
    amount: number;
  }) => {
    setSelectedExpense(expense);
    setIsApproveExpenseModalOpen(true);
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (transactionsLoading || reportsLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comptabilité</h1>
          <p className="text-gray-600">Gestion financière et comptable</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          >
            <option value="this_month">Ce mois</option>
            <option value="last_month">Mois dernier</option>
            <option value="this_year">Cette année</option>
          </select>
          <Button
            variant="outline"
            icon={<DocumentTextIcon className="h-5 w-5" />}
            onClick={() => setIsJournalEntryModalOpen(true)}
          >
            Écriture Journal
          </Button>

          <Button
            variant="outline"
            icon={<ReceiptRefundIcon className="h-5 w-5" />}
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            Nouvelle Facture
          </Button>

          <Button
            variant="outline"
            icon={<BanknotesIcon className="h-5 w-5" />}
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Nouvelle Dépense
          </Button>
          <Button
            variant="outline"
            icon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsAccountModalOpen(true)}
          >
            Nouveau Compte
          </Button>
          <Button
            icon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsTransactionModalOpen(true)}
          >
            Nouvelle Transaction
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {kpi.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpi.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      kpi.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Vue d'ensemble", icon: ChartPieIcon },
            {
              id: "transactions",
              label: "Transactions",
              icon: DocumentTextIcon,
            },
            { id: "reports", label: "Rapports", icon: PrinterIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-3 font-medium text-base sm:text-lg ${
                activeTab === tab.id
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && financialReports && (
        <>
          {/* Graphiques de tendance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Évolution Mensuelle
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialReports.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${parseInt(value as string).toLocaleString()} FC`,
                        "",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenus"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Revenus"
                    />
                    <Line
                      type="monotone"
                      dataKey="depenses"
                      stroke="#EF4444"
                      strokeWidth={3}
                      name="Dépenses"
                    />
                    <Line
                      type="monotone"
                      dataKey="benefice"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      name="Bénéfice"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Répartition des Dépenses
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialReports.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {financialReports.expensesByCategory.map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4">
                {financialReports.expensesByCategory.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {category.amount.toLocaleString()} FC
                      </span>
                      <span className="text-xs text-gray-600 ml-2">
                        ({category.value}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Comptes et soldes */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comptes et Soldes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "Caisse Principale",
                  balance: 850000,
                  type: "Liquide",
                  color: "bg-green-500",
                },
                {
                  name: "Compte Bancaire Principal",
                  balance: 2450000,
                  type: "Bancaire",
                  color: "bg-blue-500",
                },
                {
                  name: "Compte Épargne",
                  balance: 1200000,
                  type: "Épargne",
                  color: "bg-cyan-500",
                },
              ].map((account, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {account.name}
                    </h4>
                    <div className={`w-3 h-3 rounded-full ${account.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {account.balance.toLocaleString()} FC
                  </p>
                  <p className="text-sm text-gray-600">{account.type}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === "transactions" && (
        <>
          {/* Statistiques des transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filtre et recherche */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline">Filtrer</Button>
                <Button variant="outline">Exporter</Button>
              </div>
            </div>
          </Card>

          {/* Liste des transactions */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          {transaction.reference && (
                            <div className="text-sm text-gray-500">
                              Réf: {transaction.reference}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {transaction.amount.toLocaleString()} FC
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.account}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<EyeIcon className="h-4 w-4" />}
                        >
                          Voir
                        </Button>
                        {transaction.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApproveTransaction(transaction.id)
                            }
                            loading={postTransactionMutation.isPending}
                            disabled={postTransactionMutation.isPending}
                            icon={<CheckCircleIcon className="h-4 w-4" />}
                          >
                            Approuver
                          </Button>
                        )}
                        {transaction.type === "expense" &&
                          transaction.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleApproveExpense({
                                  id: transaction.id,
                                  description: transaction.description,
                                  amount: transaction.amount,
                                })
                              }
                              icon={<CheckCircleIcon className="h-4 w-4" />}
                            >
                              Approuver
                            </Button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Bilan Comptable",
              description: "État des actifs et passifs",
              icon: ChartPieIcon,
            },
            {
              title: "Compte de Résultat",
              description: "Revenus et charges de la période",
              icon: DocumentTextIcon,
            },
            {
              title: "Tableau de Trésorerie",
              description: "Flux de trésorerie détaillés",
              icon: BanknotesIcon,
            },
            {
              title: "Grand Livre",
              description: "Historique de tous les comptes",
              icon: DocumentTextIcon,
            },
            {
              title: "Balance Générale",
              description: "Soldes de tous les comptes",
              icon: ChartPieIcon,
            },
            {
              title: "Analyse Financière",
              description: "Ratios et indicateurs clés",
              icon: ArrowTrendingUpIcon,
            },
          ].map((report, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="bg-sky-500 p-3 rounded-lg mr-4">
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Consulter
                </Button>
                <Button size="sm" className="flex-1">
                  <PrinterIcon className="h-4 w-4 mr-1" />
                  Générer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />

      <CreateAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      <CreateJournalEntryModal
        isOpen={isJournalEntryModalOpen}
        onClose={() => setIsJournalEntryModalOpen(false)}
      />

      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      <CreateExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      {selectedInvoice && (
        <RecordInvoicePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedInvoice(null);
          }}
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.number}
          totalAmount={selectedInvoice.amount}
        />
      )}

      {selectedExpense && (
        <ApproveExpenseModal
          isOpen={isApproveExpenseModalOpen}
          onClose={() => {
            setIsApproveExpenseModalOpen(false);
            setSelectedExpense(null);
          }}
          expenseId={selectedExpense.id}
          expenseDescription={selectedExpense.description}
          expenseAmount={selectedExpense.amount}
        />
      )}
    </div>
  );
};

export default AccountingPage;
