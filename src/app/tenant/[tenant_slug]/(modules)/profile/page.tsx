"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { usePermissions } from "@/hooks/usePermissions";
import { ROLE_LABELS, Role } from "@/types/roles";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import {
  User,
  Mail,
  Building2,
  Shield,
  Key,
  Globe,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { currentOrganization, organizations } = useOrganization();
  const { roles } = usePermissions();

  if (!user) return null;

  const roleLabels = Array.from(roles)
    .map((r) => ROLE_LABELS[r as Role])
    .filter(Boolean);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Mon Profil
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {user.given_name?.[0]}
              {user.family_name?.[0]}
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Nom complet
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {user.given_name} {user.family_name}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Key className="w-4 h-4 text-slate-400" />
                ID : {user.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Rôles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Rôles assignés
              </p>
              <div className="flex flex-wrap gap-2">
                {roleLabels.length > 0 ? (
                  roleLabels.map((label) => (
                    <Badge key={label} variant="primary">
                      {label}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="default">Utilisateur</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Rôles bruts (système)
              </p>
              <div className="flex flex-wrap gap-1">
                {Array.from(roles).map((r) => (
                  <Badge key={r} variant="default" size="sm">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Organisations ({organizations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentOrganization?.id === org.id
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {org.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {org.subdomain}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentOrganization?.id === org.id && (
                    <Badge variant="primary" size="sm">
                      Active
                    </Badge>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {org.roles.map((r) => (
                      <Badge key={r} variant="default" size="sm">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Préférences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Les préférences utilisateur (langue, fuseau horaire, notifications)
            seront configurables ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
