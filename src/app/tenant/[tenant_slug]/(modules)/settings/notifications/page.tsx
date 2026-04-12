"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { ArrowLeft, Bell } from "lucide-react";

export default function SettingsNotificationsPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <NotificationsContent />
    </ModuleGuard>
  );
}

function NotificationsContent() {
  const { buildPath: path } = useTenantPath();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Préférences de notifications</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Canaux et types de notifications</p></div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Préférences</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-slate-500">Configurez vos préférences depuis le centre de notifications (menu principal) ou les paramètres du module Notifications.</p></CardContent>
      </Card>
    </div>
  );
}
