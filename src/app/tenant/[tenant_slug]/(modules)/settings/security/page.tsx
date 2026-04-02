"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuth } from "@/context/AuthContext";
import {
  use2FAStatus,
  use2FASetup,
  use2FAVerifySetup,
  use2FADisable,
} from "@/hooks/api/useIdentity";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
} from "@/components/ui";
import {
  ArrowLeft,
  Lock,
  Shield,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsSecurityPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <SecurityContent />
    </ModuleGuard>
  );
}

function SecurityContent() {
  const { buildPath: path } = useTenantPath();
  const { user } = useAuth();
  const userId =
    (user as { id?: string; sub?: string })?.id ??
    (user as { sub?: string })?.sub ??
    "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path("/settings")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sécurité
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authentification à deux facteurs et sessions
          </p>
        </div>
      </div>

      <TwoFactorSection userId={userId} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" /> Sessions actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Gérez vos sessions actives depuis le profil utilisateur Keycloak.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TwoFactorSection({ userId }: { userId: string }) {
  const { data: status, isLoading: statusLoading } = use2FAStatus(
    userId || null,
  );
  const setupMutation = use2FASetup();
  const verifyMutation = use2FAVerifySetup();
  const disableMutation = use2FADisable();

  const [step, setStep] = useState<
    "idle" | "setup" | "verify" | "backup" | "disable"
  >("idle");
  const [setupData, setSetupData] = useState<{
    qrCodeUrl?: string;
    secret?: string;
    backupCodes?: string[];
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  const handleStartSetup = useCallback(async () => {
    try {
      const result = await setupMutation.mutateAsync(userId);
      const data = (result as any)?.data ?? result;
      setSetupData(data);
      setStep("setup");
    } catch {
      // error handled by mutation
    }
  }, [setupMutation, userId]);

  const handleVerify = useCallback(async () => {
    if (!verifyCode || verifyCode.length < 6) return;
    try {
      await verifyMutation.mutateAsync({ userId, code: verifyCode });
      if (setupData?.backupCodes?.length) {
        setStep("backup");
      } else {
        setStep("idle");
      }
      setVerifyCode("");
    } catch {
      // error handled by mutation
    }
  }, [verifyMutation, userId, verifyCode, setupData]);

  const handleDisable = useCallback(async () => {
    if (!disablePassword) return;
    try {
      await disableMutation.mutateAsync({
        userId,
        password: disablePassword,
      });
      setStep("idle");
      setDisablePassword("");
    } catch {
      // error handled by mutation
    }
  }, [disableMutation, userId, disablePassword]);

  const copyToClipboard = useCallback(
    (text: string, type: "secret" | "backup") => {
      navigator.clipboard.writeText(text).then(() => {
        if (type === "secret") {
          setCopiedSecret(true);
          setTimeout(() => setCopiedSecret(false), 2000);
        } else {
          setCopiedBackup(true);
          setTimeout(() => setCopiedBackup(false), 2000);
        }
      });
    },
    [],
  );

  if (statusLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" /> Authentification à deux facteurs (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-slate-500">Chargement…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const is2FAEnabled = status?.enabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" /> Authentification à deux facteurs (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {is2FAEnabled ? (
              <>
                <Badge variant="success">Activé</Badge>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Votre compte est protégé par le 2FA.
                </span>
              </>
            ) : (
              <>
                <Badge variant="danger">Désactivé</Badge>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Renforcez la sécurité de votre compte.
                </span>
              </>
            )}
          </div>
          {status?.backupCodesRemaining !== undefined &&
            status.backupCodesRemaining > 0 && (
              <span className="text-xs text-slate-500">
                {status.backupCodesRemaining} codes de secours restants
              </span>
            )}
        </div>

        {/* IDLE state */}
        {step === "idle" && (
          <div className="flex gap-3">
            {!is2FAEnabled ? (
              <Button
                onClick={handleStartSetup}
                disabled={setupMutation.isPending}
              >
                {setupMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Configurer le 2FA
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setStep("disable")}
              >
                Désactiver le 2FA
              </Button>
            )}
          </div>
        )}

        {/* SETUP step: QR code + secret */}
        {step === "setup" && setupData && (
          <div className="space-y-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Étape 1 : Scanner le QR code
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Scannez ce code avec votre application d&apos;authentification
              (Google Authenticator, Authy, etc.)
            </p>

            {setupData.qrCodeUrl && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img
                  src={setupData.qrCodeUrl}
                  alt="QR Code 2FA"
                  className="w-48 h-48"
                />
              </div>
            )}

            {setupData.secret && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Ou saisissez cette clé manuellement :
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 rounded border text-sm font-mono break-all">
                    {setupData.secret}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(setupData.secret!, "secret")
                    }
                  >
                    {copiedSecret ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Étape 2 : Vérifier le code
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Entrez le code à 6 chiffres affiché par votre application.
              </p>
              <div className="flex gap-2">
                <Input
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-40 text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  autoFocus
                />
                <Button
                  onClick={handleVerify}
                  disabled={
                    verifyCode.length < 6 || verifyMutation.isPending
                  }
                >
                  {verifyMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Vérifier
                </Button>
              </div>
            </div>

            <Button variant="ghost" onClick={() => setStep("idle")}>
              Annuler
            </Button>
          </div>
        )}

        {/* BACKUP CODES step */}
        {step === "backup" && setupData?.backupCodes && (
          <div className="space-y-4 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Codes de secours
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Sauvegardez ces codes dans un endroit sûr. Ils vous
                  permettront de vous connecter si vous perdez l&apos;accès à
                  votre application 2FA. Chaque code ne peut être utilisé
                  qu&apos;une seule fois.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-slate-900 rounded-lg border">
              {setupData.backupCodes.map((code, i) => (
                <code key={i} className="text-sm font-mono text-center py-1">
                  {code}
                </code>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(
                    setupData.backupCodes!.join("\n"),
                    "backup",
                  )
                }
              >
                {copiedBackup ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedBackup ? "Copié !" : "Copier les codes"}
              </Button>
              <Button onClick={() => setStep("idle")}>
                J&apos;ai sauvegardé mes codes
              </Button>
            </div>
          </div>
        )}

        {/* DISABLE step */}
        {step === "disable" && (
          <div className="space-y-4 p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Désactiver le 2FA
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Cela réduira la sécurité de votre compte. Confirmez votre mot
                  de passe pour continuer.
                </p>
              </div>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={handleDisable}
                disabled={!disablePassword || disableMutation.isPending}
              >
                {disableMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirmer la désactivation
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("idle");
                  setDisablePassword("");
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
