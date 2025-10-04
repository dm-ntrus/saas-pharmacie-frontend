import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, PaymentMethod, SaleStatus } from "@/types";
import Link from "next/link";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const reportSchema = Yup.object().shape({
  startDate: Yup.date().required("Date de début requise"),
  endDate: Yup.date()
    .required("Date de fin requise")
    .min(
      Yup.ref("startDate"),
      "La date de fin doit être après la date de début"
    ),
});

const SalesReportsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.MANAGER]);

  const [filterCashier, setFilterCashier] = useState<string>("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Default to last 30 days
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const formik = useFormik({
    initialValues: {
      startDate: defaultStartDate.toISOString().split("T")[0],
      endDate: defaultEndDate.toISOString().split("T")[0],
    },
    validationSchema: reportSchema,
    onSubmit: () => {
      // Trigger refetch
    },
  });

  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: [
      "salesReport",
      formik.values.startDate,
      formik.values.endDate,
      filterCashier,
      filterPaymentMethod,
      filterStatus,
    ],
    queryFn: () =>
      apiClient.getSalesReport({
        startDate: new Date(formik.values.startDate),
        endDate: new Date(formik.values.endDate),
      }),
  });

  // Fetch all sales for detailed filtering
  const { data: salesData } = useQuery({
    queryKey: [
      "sales",
      formik.values.startDate,
      formik.values.endDate,
      filterCashier,
      filterPaymentMethod,
      filterStatus,
    ],
    queryFn: () =>
      apiClient.getSales({
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        cashierId: filterCashier || undefined,
        paymentMethod: filterPaymentMethod || undefined,
        status: filterStatus || undefined,
      }),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!salesData?.data) return null;

    const sales = salesData.data;
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const completedSales = sales.filter(
      (sale) => sale.status === SaleStatus.COMPLETED
    ).length;
    const refundedSales = sales.filter(
      (sale) => sale.status === SaleStatus.REFUNDED
    ).length;
    const avgSaleAmount = totalSales > 0 ? totalRevenue / totalSales : 0;
    const totalItems = sales.reduce(
      (sum, sale) => sum + (sale.items?.length || 0),
      0
    );

    return {
      totalSales,
      totalRevenue,
      completedSales,
      refundedSales,
      avgSaleAmount,
      totalItems,
      avgItemsPerSale: totalSales > 0 ? totalItems / totalSales : 0,
    };
  }, [salesData]);

  // Daily sales data for line chart
  const dailySalesData = useMemo(() => {
    if (!salesData?.data) return [];

    const dailyMap = new Map<
      string,
      { date: string; revenue: number; count: number }
    >();

    salesData.data.forEach((sale) => {
      const date = new Date(sale.saleDate).toLocaleDateString("fr-FR");
      const existing = dailyMap.get(date) || { date, revenue: 0, count: 0 };
      existing.revenue += sale.totalAmount;
      existing.count += 1;
      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [salesData]);

  // Payment method distribution
  const paymentMethodData = useMemo(() => {
    if (!salesData?.data) return [];

    const methodMap = new Map<string, number>();

    salesData.data.forEach((sale) => {
      const current = methodMap.get(sale.paymentMethod) || 0;
      methodMap.set(sale.paymentMethod, current + sale.totalAmount);
    });

    return Array.from(methodMap.entries()).map(([method, value]) => ({
      name:
        method === PaymentMethod.CASH
          ? "Espèces"
          : method === PaymentMethod.CARD
          ? "Carte"
          : method === PaymentMethod.INSURANCE
          ? "Assurance"
          : "Mixte",
      value,
    }));
  }, [salesData]);

  // Top cashiers
  const topCashiersData = useMemo(() => {
    if (!salesData?.data) return [];

    const cashierMap = new Map<
      string,
      { name: string; revenue: number; count: number }
    >();

    salesData.data.forEach((sale) => {
      if (sale.cashier) {
        const cashierName = `${sale.cashier.firstName} ${sale.cashier.lastName}`;
        const existing = cashierMap.get(sale.cashier.id) || {
          name: cashierName,
          revenue: 0,
          count: 0,
        };
        existing.revenue += sale.totalAmount;
        existing.count += 1;
        cashierMap.set(sale.cashier.id, existing);
      }
    });

    return Array.from(cashierMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [salesData]);

  // Top products
  const topProductsData = useMemo(() => {
    if (!salesData?.data) return [];

    const productMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    salesData.data.forEach((sale) => {
      sale.items?.forEach((item) => {
        if (item.product) {
          const existing = productMap.get(item.product.id) || {
            name: item.product.name,
            quantity: 0,
            revenue: 0,
          };
          existing.quantity += item.quantity;
          existing.revenue += item.totalPrice;
          productMap.set(item.product.id, existing);
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [salesData]);

  const handleExport = () => {
    if (!salesData?.data) return;

    const csvContent = [
      [
        "Numéro",
        "Date",
        "Patient",
        "Caissier",
        "Mode paiement",
        "Statut",
        "Sous-total",
        "Remise",
        "TVA",
        "Total",
      ],
      ...salesData.data.map((sale) => [
        sale.saleNumber,
        new Date(sale.saleDate).toLocaleString("fr-FR"),
        sale.patient
          ? `${sale.patient.firstName} ${sale.patient.lastName}`
          : "N/A",
        `${sale.cashier?.firstName} ${sale.cashier?.lastName}`,
        sale.paymentMethod,
        sale.status,
        sale.subtotal,
        sale.discountAmount,
        sale.taxAmount,
        sale.totalAmount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-ventes-${formik.values.startDate}-${formik.values.endDate}.csv`;
    a.click();
  };

  return (
    <Layout title="Rapports de ventes - PharmacySaaS">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rapports de ventes
            </h1>
            <p className="text-gray-600">
              Analysez les performances de votre pharmacie
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/sales">Ventes</Link>
            </Button>
            <Button
              onClick={handleExport}
              icon={<ArrowDownTrayIcon className="h-4 w-4" />}
              disabled={!salesData?.data || salesData.data.length === 0}
            >
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                type="date"
                label="Date de début"
                {...formik.getFieldProps("startDate")}
                error={
                  formik.touched.startDate && formik.errors.startDate
                    ? formik.errors.startDate
                    : undefined
                }
              />
              <Input
                type="date"
                label="Date de fin"
                {...formik.getFieldProps("endDate")}
                error={
                  formik.touched.endDate && formik.errors.endDate
                    ? formik.errors.endDate
                    : undefined
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caissier
                </label>
                <select
                  value={filterCashier}
                  onChange={(e) => setFilterCashier(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="">Tous</option>
                  {/* Add cashiers options */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode de paiement
                </label>
                <select
                  value={filterPaymentMethod}
                  onChange={(e) => setFilterPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="">Tous</option>
                  <option value={PaymentMethod.CASH}>Espèces</option>
                  <option value={PaymentMethod.CARD}>Carte</option>
                  <option value={PaymentMethod.INSURANCE}>Assurance</option>
                  <option value={PaymentMethod.MIXED}>Mixte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="">Tous</option>
                  <option value={SaleStatus.COMPLETED}>Complétée</option>
                  <option value={SaleStatus.REFUNDED}>Remboursée</option>
                  <option value={SaleStatus.CANCELLED}>Annulée</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Nombre de ventes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {statistics.totalSales}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {statistics.completedSales} complétées
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-sky-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Chiffre d'affaires
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(statistics.totalRevenue)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {statistics.refundedSales} remboursées
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Panier moyen
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(statistics.avgSaleAmount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {statistics.avgItemsPerSale.toFixed(1)} articles/vente
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Articles vendus
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {statistics.totalItems}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Sur {statistics.totalSales} ventes
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Chiffre d'affaires"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par mode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
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
                    {paymentMethodData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Cashiers */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 caissiers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCashiersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="CA" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 produits vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProductsData.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-sky-600 text-white text-xs font-bold rounded">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qté: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sky-600">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SalesReportsPage;
