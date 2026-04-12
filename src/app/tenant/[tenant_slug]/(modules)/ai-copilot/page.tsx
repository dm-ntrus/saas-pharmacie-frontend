"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useAICopilot } from "@/hooks/api/useAI";
import { useTranslations } from "@/lib/i18n-simple";

export default function AICopilotPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_WRITE]}>
      <AICopilotContent />
    </ModuleGuard>
  );
}

function AICopilotContent() {
  const t = useTranslations("ai");
  const copilot = useAICopilot();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<Array<{ question: string; answer: string; ts: string }>>([]);
  const storageKey = useMemo(() => "ai_copilot_history_v1", []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<{ question: string; answer: string; ts: string }>;
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, 10));
    } catch {
      // ignore corrupted local history
    }
  }, [storageKey]);

  const persistHistory = (next: Array<{ question: string; answer: string; ts: string }>) => {
    setHistory(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const submit = async () => {
    const q = question.trim();
    if (!q) {
      setInputError(t("requiredQuestion"));
      return;
    }
    setInputError(null);
    const result = await copilot.mutateAsync({ question: q, context: {} });
    const responseText = typeof result?.answer === "string" ? result.answer : "";
    setAnswer(responseText);
    setMetadata(result);
    const nextHistory = [{ question: q, answer: responseText, ts: new Date().toISOString() }, ...history].slice(0, 10);
    persistHistory(nextHistory);
    setQuestion("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("copilotTitle")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("copilotSubtitle")}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            persistHistory([]);
            setAnswer("");
            setMetadata(null);
          }}
          disabled={history.length === 0}
        >
          {t("clearHistory")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("questionLabel")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="w-full min-h-32 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900"
            placeholder={t("questionPlaceholder")}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (inputError) setInputError(null);
            }}
          />
          {inputError && <p className="text-sm text-amber-600">{inputError}</p>}
          <Button onClick={submit} disabled={copilot.isPending}>
            {copilot.isPending ? t("submitting") : t("submit")}
          </Button>
          {copilot.error && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-700">{copilot.error.message}</p>
              <Button size="sm" variant="outline" onClick={submit}>
                {t("retry")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>{t("answer")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{answer}</p>
          </CardContent>
        </Card>
      )}

      {!copilot.isPending && !copilot.error && !answer && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("emptyState")}</p>
          </CardContent>
        </Card>
      )}

      {metadata && (
        <Card>
          <CardHeader>
            <CardTitle>{t("metadata")}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(metadata, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("historyTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((item) => (
              <div key={item.ts} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-1">
                <p className="text-xs text-slate-500">{new Date(item.ts).toLocaleString()}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.question}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{item.answer || "—"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
