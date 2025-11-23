import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const InventoryReports: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const [alertFilter, setAlertFilter] = useState<
    "all" | "critical" | "warning"
  >("all");

  // Fetch dashboard data
  const { data: alerts } = useQuery({
    queryKey: ["inventory-alerts"],
    queryFn: () => apiClient.getInventoryAlerts({ resolved: false }),
  });

  const { data: expiringBatches } = useQuery({
    queryKey: ["expiring-batches"],
    queryFn: () => apiClient.getExpiringBatches(30),
  });

  const { data: stockLevels } = useQuery({
    queryKey: ["stock-levels"],
    queryFn: () => apiClient.getStockLevelsReport(),
  });

  const { data: valuation } = useQuery({
    queryKey: ["inventory-valuation"],
    queryFn: () => apiClient.getInventoryValuation(),
  });

  const { data: expirationReport } = useQuery({
    queryKey: ["expiration-report"],
    queryFn: () => apiClient.getExpirationReport(),
  });

  const { data: lowStockReport } = useQuery({
    queryKey: ["low-stock-report"],
    queryFn: () => apiClient.getLowStockReport(),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getAlertIcon = (severity: string) => {
    if (severity === "critical") {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
    return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
  };

  const getAlertColor = (severity: string) => {
    if (severity === "critical") {
      return "bg-red-50 border-red-200";
    }
    return "bg-yellow-50 border-yellow-200";
  };

  const filteredAlerts = alerts?.alerts.filter((alert: any) => {
    if (alertFilter === "all") return true;
    return alert.severity === alertFilter;
  });

  // Mock data for charts (replace with real data)
  const stockByCategory = [
    { name: "Médicaments", value: 450, fill: COLORS[0] },
    { name: "OTC", value: 280, fill: COLORS[1] },
    { name: "Dispositifs", value: 120, fill: COLORS[2] },
    { name: "Compléments", value: 90, fill: COLORS[3] },
  ];

  const stockTrend = [
    { date: "Jan", value: 850 },
    { date: "Fév", value: 920 },
    { date: "Mar", value: 880 },
    { date: "Avr", value: 940 },
    { date: "Mai", value: 910 },
    { date: "Juin", value: 940 },
  ];

  const topProducts = [
    { id: 1, name: "Paracétamol 500mg", stock: 450, value: 2250 },
    { id: 1, name: "Amoxicilline 250mg", stock: 280, value: 4200 },
    { id: 1, name: "Ibuprofène 400mg", stock: 350, value: 2800 },
    { id: 1, name: "Aspirine 500mg", stock: 200, value: 1600 },
    { id: 1, name: "Oméprazole 20mg", stock: 180, value: 2700 },
  ];

  const stats = [
    {
      title: "Valeur Stock Total",
      value: formatCurrency(valuation?.totalValue || 125000),
      change: "+12.5%",
      trend: "up",
      icon: CubeIcon,
      color: "bg-blue-500",
    },
    {
      title: "Alertes Actives",
      value: alerts?.total || 0,
      change: "-5",
      trend: "down",
      icon: BellIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Expiration < 30j",
      value: expiringBatches?.length || 0,
      change: "+3",
      trend: "up",
      icon: ClockIcon,
      color: "bg-red-500",
    },
    {
      title: "Produits Actifs",
      value: stockLevels?.totalProducts || 0,
      change: "+8",
      trend: "up",
      icon: CheckCircleIcon,
      color: "bg-green-500",
    },
  ];

  return (
    <Layout title="Dashboard Inventaire - PharmacySaaS">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rapports de l'Inventaire
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble de votre stock et alertes
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/inventory">Produits</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/inventory/batches">Lots</Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <ArrowTrendingUpIcon
                          className={`h-4 w-4 ${
                            stat.title.includes("Alerte") ||
                            stat.title.includes("Expiration")
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <ArrowTrendingDownIcon
                          className={`h-4 w-4 ${
                            stat.title.includes("Alerte")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      )}
                      <span
                        className={`ml-1 text-sm ${
                          stat.trend === "up" &&
                          (stat.title.includes("Alerte") ||
                            stat.title.includes("Expiration"))
                            ? "text-red-600"
                            : stat.trend === "down" &&
                              stat.title.includes("Alerte")
                            ? "text-green-600"
                            : stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Alertes Actives</CardTitle>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setAlertFilter("all")}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        alertFilter === "all"
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Toutes
                    </button>
                    <button
                      onClick={() => setAlertFilter("critical")}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        alertFilter === "critical"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Critiques
                    </button>
                    <button
                      onClick={() => setAlertFilter("warning")}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        alertFilter === "warning"
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Avertissements
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredAlerts && filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`p-4 border rounded-lg ${getAlertColor(
                          alert.severity
                        )}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.severity)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {alert.product?.name || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.createdAt).toLocaleString(
                                  "fr-FR"
                                )}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Résoudre
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">
                        Aucune alerte active
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expiring Batches */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Lots expirant bientôt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expiringBatches && expiringBatches.length > 0 ? (
                    expiringBatches.slice(0, 5).map((batch: any) => (
                      <div
                        key={batch.id}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {batch.product?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Lot: {batch.batchNumber}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Expire le:{" "}
                          {new Date(batch.expirationDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ClockIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">
                        Aucun lot expirant prochainement
                      </p>
                    </div>
                  )}
                  {expiringBatches && expiringBatches.length > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href="/inventory/batches?expiringDays=30">
                        Voir tous ({expiringBatches.length})
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stock by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Stock par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du stock</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Valeur totale"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 produits par valeur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-sky-100 text-sky-600 rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.stock} unités
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.value)}
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          <Link href={`/inventory/products/${product.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InventoryReports;
