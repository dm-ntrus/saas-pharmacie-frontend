"use client";

import React from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { Card, CardContent } from "@/components/ui";

export default function CertificatesPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <CertificatesContent />
    </ModuleGuard>
  );
}

function CertificatesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Certificats de vaccination
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Les certificats sont générés après chaque injection. Accédez à un certificat via
          le détail d’une injection ou le dossier patient.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-slate-600 dark:text-slate-400">
            Pour consulter ou télécharger un certificat, ouvrez d’abord le détail de
            l’injection concernée : le lien « Voir le certificat » s’affiche si un
            certificat a été généré. Vous pouvez également ouvrir un certificat par son
            ID dans l’URL : /vaccination/certificates/[id].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
