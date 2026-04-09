import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(relPath: string) {
  return readFileSync(join(root, relPath), "utf-8");
}

describe("B2B frontend contract coverage", () => {
  it("implements all B2B hook endpoint families", () => {
    const hookFiles = [
      "src/hooks/api/usePartners.ts",
      "src/hooks/api/useSalesOrdersB2B.ts",
      "src/hooks/api/useCreditControl.ts",
      "src/hooks/api/useCommercialTerms.ts",
      "src/hooks/api/useReturnsRma.ts",
      "src/hooks/api/useApMatching.ts",
      "src/hooks/api/useB2BDashboard.ts",
      "src/hooks/api/useB2BGovernance.ts",
      "src/hooks/api/useB2BAsync.ts",
      "src/hooks/api/useB2BIntegrations.ts",
    ];

    for (const file of hookFiles) {
      expect(existsSync(join(root, file))).toBe(true);
    }

    expect(read("src/hooks/api/usePartners.ts")).toContain("/partners");
    expect(read("src/hooks/api/usePartners.ts")).toContain("/credit-check");
    expect(read("src/hooks/api/useSalesOrdersB2B.ts")).toContain("/sales-orders-b2b");
    expect(read("src/hooks/api/useSalesOrdersB2B.ts")).toContain("/transition");
    expect(read("src/hooks/api/useCreditControl.ts")).toContain("/credit-control/");
    expect(read("src/hooks/api/useCommercialTerms.ts")).toContain("/commercial-terms");
    expect(read("src/hooks/api/useCommercialTerms.ts")).toContain("/pricing/quote");
    expect(read("src/hooks/api/useReturnsRma.ts")).toContain("/returns-rma/authorizations");
    expect(read("src/hooks/api/useReturnsRma.ts")).toContain("/disposition");
    expect(read("src/hooks/api/useApMatching.ts")).toContain("/ap-matching/three-way");
    expect(read("src/hooks/api/useB2BDashboard.ts")).toContain("/b2b-dashboard");
    expect(read("src/hooks/api/useB2BGovernance.ts")).toContain("/b2b-governance/credit-override");
    expect(read("src/hooks/api/useB2BGovernance.ts")).toContain("/b2b-governance/price-override");
    expect(read("src/hooks/api/useB2BGovernance.ts")).toContain("/approvals/${id}/approve");
    expect(read("src/hooks/api/useB2BGovernance.ts")).toContain("/approvals/${id}/reject");
    expect(read("src/hooks/api/useB2BAsync.ts")).toContain("/b2b-async/jobs");
    expect(read("src/hooks/api/useB2BIntegrations.ts")).toContain("/partners/import-csv");
    expect(read("src/hooks/api/useB2BIntegrations.ts")).toContain("/webhooks/register");
    expect(read("src/hooks/api/useB2BIntegrations.ts")).toContain("/webhooks/ingest");
  });

  it("exposes all B2B module pages and sidebar entries", () => {
    const pages = [
      "src/app/tenant/[tenant_slug]/(modules)/customers-b2b/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/sales-orders-b2b/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/credit-desk/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/pricing-desk/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/returns-rma/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/ap-matching/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/b2b-dashboard/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/b2b-governance/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/b2b-async/page.tsx",
      "src/app/tenant/[tenant_slug]/(modules)/b2b-integrations/page.tsx",
    ];
    for (const file of pages) {
      expect(existsSync(join(root, file))).toBe(true);
    }

    const sidebar = read("src/layouts/tenant/Sidebar.tsx");
    expect(sidebar).toContain('href: "/customers-b2b"');
    expect(sidebar).toContain('href: "/sales-orders-b2b"');
    expect(sidebar).toContain('href: "/credit-desk"');
    expect(sidebar).toContain('href: "/pricing-desk"');
    expect(sidebar).toContain('href: "/returns-rma"');
    expect(sidebar).toContain('href: "/ap-matching"');
    expect(sidebar).toContain('href: "/b2b-dashboard"');
    expect(sidebar).toContain('href: "/b2b-governance"');
    expect(sidebar).toContain('href: "/b2b-async"');
    expect(sidebar).toContain('href: "/b2b-integrations"');
  });

  it("has FR/EN i18n keys for B2B modules", () => {
    const fr = JSON.parse(read("messages/fr.json"));
    const en = JSON.parse(read("messages/en.json"));

    expect(fr.nav.customersB2B).toBeTruthy();
    expect(fr.nav.salesOrdersB2B).toBeTruthy();
    expect(fr.nav.creditDesk).toBeTruthy();
    expect(fr.nav.pricingDesk).toBeTruthy();
    expect(fr.nav.returnsRma).toBeTruthy();
    expect(fr.nav.apMatching).toBeTruthy();
    expect(fr.nav.b2bDashboard).toBeTruthy();
    expect(fr.nav.b2bGovernance).toBeTruthy();
    expect(fr.nav.b2bAsync).toBeTruthy();
    expect(fr.nav.b2bIntegrations).toBeTruthy();

    expect(en.nav.customersB2B).toBeTruthy();
    expect(en.nav.salesOrdersB2B).toBeTruthy();
    expect(en.nav.creditDesk).toBeTruthy();
    expect(en.nav.pricingDesk).toBeTruthy();
    expect(en.nav.returnsRma).toBeTruthy();
    expect(en.nav.apMatching).toBeTruthy();
    expect(en.nav.b2bDashboard).toBeTruthy();
    expect(en.nav.b2bGovernance).toBeTruthy();
    expect(en.nav.b2bAsync).toBeTruthy();
    expect(en.nav.b2bIntegrations).toBeTruthy();

    expect(fr.b2b).toBeTruthy();
    expect(en.b2b).toBeTruthy();
  });

  it("keeps sidebar i18n keys aligned", () => {
    const fr = JSON.parse(read("messages/fr.json"));
    const en = JSON.parse(read("messages/en.json"));
    const sidebar = read("src/layouts/tenant/Sidebar.tsx");

    const requiredNavKeys = [
      "dashboard",
      "sales",
      "inventory",
      "patients",
      "prescriptions",
      "vaccination",
      "delivery",
      "billing",
      "payments",
      "accounting",
      "suppliers",
      "supplyChain",
      "purchaseOrders",
      "purchaseRequests",
      "supplierQuotes",
      "forecasts",
      "stockPolicies",
      "supplierPerformance",
      "supplyChainAlerts",
      "quality",
      "insurance",
      "eInvoice",
      "hr",
      "analytics",
      "notifications",
      "reports",
      "loyalty",
      "businessAudit",
      "settings",
      "customersB2B",
      "salesOrdersB2B",
      "creditDesk",
      "pricingDesk",
      "returnsRma",
      "apMatching",
      "b2bDashboard",
      "b2bGovernance",
      "b2bAsync",
      "b2bIntegrations",
    ];

    for (const key of requiredNavKeys) {
      expect(fr.nav[key]).toBeTruthy();
      expect(en.nav[key]).toBeTruthy();
      expect(sidebar).toContain(`labelKey: "${key}"`);
    }
  });

  it("has tenant layout i18n keys in FR/EN", () => {
    const fr = JSON.parse(read("messages/fr.json"));
    const en = JSON.parse(read("messages/en.json"));

    const keys = [
      "mobileNavigationAriaLabel",
      "organizationPlaceholder",
      "organizationsLabel",
      "logout",
      "darkMode",
      "lightMode",
      "closeMenu",
    ];

    for (const key of keys) {
      expect(fr.tenantLayout[key]).toBeTruthy();
      expect(en.tenantLayout[key]).toBeTruthy();
    }
  });
});
