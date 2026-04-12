import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const frontendRoot = process.cwd();
const backendRoot = join(frontendRoot, "..", "..");

function readFromFrontend(relPath: string) {
  return readFileSync(join(frontendRoot, relPath), "utf-8");
}

function readFromBackend(relPath: string) {
  return readFileSync(join(backendRoot, relPath), "utf-8");
}

describe("AI frontend/backend contract coherence", () => {
  it("exposes AI hook and service for UI integration", () => {
    const hook = readFromFrontend("src/hooks/api/useAI.ts");
    const service = readFromFrontend("src/services/ai.service.ts");
    const sidebar = readFromFrontend("src/layouts/tenant/Sidebar.tsx");

    expect(hook).toContain("useAICopilot");
    expect(hook).toContain("useAIHealthReadiness");
    expect(hook).toContain("useAIAdvanced");
    expect(service).toContain("callAdvanced");
    expect(sidebar).toContain('href: "/ai-copilot"');
    expect(sidebar).toContain('href: "/ai-sre-dashboard"');
  });

  it("ships AI module pages for copilot and SRE", () => {
    const copilotPage = readFromFrontend("src/app/tenant/[tenant_slug]/(modules)/ai-copilot/page.tsx");
    const srePage = readFromFrontend("src/app/tenant/[tenant_slug]/(modules)/ai-sre-dashboard/page.tsx");
    const dashboardPage = readFromFrontend("src/app/tenant/[tenant_slug]/(modules)/dashboard/page.tsx");

    expect(copilotPage).toContain("useAICopilot");
    expect(copilotPage).toContain("localStorage");
    expect(srePage).toContain("useAISreDashboard");
    expect(srePage).toContain("readyChecks");
    expect(srePage).toContain("exportJson");
    expect(srePage).toContain("exportCsv");
    expect(srePage).toContain("[7, 30, 90]");
    expect(dashboardPage).toContain('buildPath("/ai-copilot")');
    expect(dashboardPage).toContain('buildPath("/ai-sre-dashboard")');
  });

  it("keeps AI route families aligned with backend controller", () => {
    const frontendService = readFromFrontend("src/services/ai.service.ts");
    const backendController = readFromBackend("src/ai/ai.controller.ts");

    const routeFamilies = [
      "copilot/query",
      "prescriptions/ocr-extract",
      "prescriptions/risk-score",
      "metrics",
      "maintenance/purge-logs",
      "model-eval",
      "model-explain",
      "health/advanced",
      "health/readiness",
      "sre/dashboard",
    ];

    for (const route of routeFamilies) {
      expect(frontendService).toContain(route);
      expect(backendController).toContain(route);
    }
  });

  it("maps backend advanced endpoints through callAdvanced helper", () => {
    const frontendService = readFromFrontend("src/services/ai.service.ts");
    const backendController = readFromBackend("src/ai/ai.controller.ts");

    const advancedRoutes = [
      "quality/deviation-classify",
      "notifications/prioritize",
      "cold-chain/forecast-risk",
      "supply/supplier-selection",
      "delivery/cluster-zones",
      "security/fraud-detection",
      "inventory/eoq-optimize",
      "commerce/pricing-optimize",
      "sales/basket-anomalies",
      "sales/narrative",
      "inventory/demand-shock",
      "hr/staffing-forecast",
      "hr/absenteeism-risk",
      "billing/cashflow-forecast",
      "billing/payment-delay-predict",
      "delivery/eta-predict",
      "delivery/prioritize",
      "vaccination/missed-booster-risk",
    ];

    expect(frontendService).toContain("callAdvanced");
    for (const route of advancedRoutes) {
      expect(backendController).toContain(route);
    }
  });
});
