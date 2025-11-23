"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
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

const ReportsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST]);

  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [reportType, setReportType] = useState("sales");

  const { data: salesAnalytics, isLoading } = useQuery({
    queryKey: ["sales-analytics", selectedPeriod],
    queryFn: () => apiClient.getSalesAnalytics(selectedPeriod),
  });

  const reportTypes = [
    {
      id: "sales",
      name: "Rapport des ventes",
      description: "Analyse détaillée des ventes et revenus",
      icon: ChartBarIcon,
    },
    {
      id: "inventory",
      name: "Rapport d'inventaire",
      description: "État des stocks et mouvements",
      icon: ChartBarIcon,
    },
    {
      id: "patients",
      name: "Rapport des patients",
      description: "Statistiques des patients et prescriptions",
      icon: ChartBarIcon,
    },
    {
      id: "financial",
      name: "Rapport financier",
      description: "Analyse comptable et financière",
      icon: ChartBarIcon,
    },
  ];

  const periods = [
    { value: "7d", label: "7 derniers jours" },
    { value: "30d", label: "30 derniers jours" },
    { value: "3m", label: "3 derniers mois" },
    { value: "6m", label: "6 derniers mois" },
    { value: "1y", label: "1 an" },
  ];

  const handleGenerateReport = async (type: string) => {
    try {
      const blob = await apiClient.generateReport(type, {
        period: selectedPeriod,
        format: "pdf",
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rapport-${type}-${selectedPeriod}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
    }
  };

  const ReportCard = ({ report }: { report: (typeof reportTypes)[0] }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <report.icon className="h-8 w-8 text-sky-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" onClick={() => handleGenerateReport(report.id)}>
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Générer PDF
              </Button>
              <Button size="sm" variant="outline">
                Aperçu
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600">
            Générez des rapports détaillés sur votre activité
          </p>
        </div>
      </div>

      {/* Filtres de période */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Période d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={
                  selectedPeriod === period.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Types de rapports */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reportTypes.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Aperçu des données */}
      {salesAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>
              Aperçu des ventes -{" "}
              {periods.find((p) => p.value === selectedPeriod)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {salesAnalytics.dailySales?.reduce(
                    (sum, day) => sum + day.count,
                    0
                  ) || 0}
                </p>
                <p className="text-sm text-gray-600">Total des ventes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(
                    salesAnalytics.dailySales?.reduce(
                      (sum, day) => sum + day.amount,
                      0
                    ) || 0
                  )}
                </p>
                <p className="text-sm text-gray-600">Chiffre d'affaires</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {salesAnalytics.topProducts?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Produits vendus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
