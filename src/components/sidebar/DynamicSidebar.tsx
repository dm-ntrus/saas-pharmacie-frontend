"use client";

import React, { useMemo } from "react";
import { useFeatureCatalog } from "@/hooks/useFeatureCatalog";
import { useFeatureFlags } from "@/context/FeatureFlagContext";

interface SidebarItem {
  key: string;
  label: string;
  icon?: string;
  href: string;
  order: number;
  section: string;
}

/**
 * Sidebar Dynamique - Construit automatiquement depuis le catalogue
 * 
 * ENTERPRISE-GRADE:
 * - Pas de hardcoding des items
 * - Ordre dynamique depuis metadata.order
 * - Icônes dynamiques depuis metadata.icon
 * - Sections dynamiques depuis metadata.ui_section
 * - Filtrage automatique selon les entitlements
 */
export function DynamicSidebar() {
  const { data, isLoading: catalogLoading } = useFeatureCatalog();
  const { isFeatureEnabled, loading: entitlementsLoading } = useFeatureFlags();

  /**
   * Construire les items de sidebar depuis le catalogue
   */
  const sidebarItems = useMemo<SidebarItem[]>(() => {
    const features = data?.features ?? [];
    if (features.length === 0) return [];

    return features
      .filter(f => {
        // Filtrer uniquement les modules (pas les quotas, support, etc.)
        if (!f.key.startsWith('module.')) return false;
        
        // Vérifier que la feature est enabled dans le plan
        return isFeatureEnabled(f.key);
      })
      .map(f => {
        // Extraire le nom du module depuis la clé (module.dashboard → dashboard)
        const moduleName = f.key.replace('module.', '');
        
        return {
          key: f.key,
          label: f.name,
          icon: f.metadata?.icon || 'default',
          href: `/app/${moduleName}`,
          order: f.metadata?.order || 999,
          section: f.metadata?.ui_section || 'main',
        };
      })
      .sort((a, b) => a.order - b.order); // Tri par ordre
  }, [data, isFeatureEnabled]);

  /**
   * Grouper par section
   */
  const itemsBySection = useMemo(() => {
    const sections: Record<string, SidebarItem[]> = {};
    
    sidebarItems.forEach(item => {
      if (!sections[item.section]) {
        sections[item.section] = [];
      }
      sections[item.section].push(item);
    });
    
    return sections;
  }, [sidebarItems]);

  if (catalogLoading || entitlementsLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="sidebar">
      {Object.entries(itemsBySection).map(([section, items]) => (
        <div key={section} className="sidebar-section">
          <h3 className="sidebar-section-title">
            {getSectionLabel(section)}
          </h3>
          <ul className="sidebar-items">
            {items.map(item => (
              <li key={item.key}>
                <a href={item.href} className="sidebar-item">
                  <span className={`icon icon-${item.icon}`} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    main: 'Principal',
    operations: 'Opérations',
    management: 'Gestion',
    analytics: 'Analytics',
    settings: 'Paramètres',
  };
  return labels[section] || section;
}

function SidebarSkeleton() {
  return (
    <aside className="sidebar">
      <div className="animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 bg-gray-200 rounded mb-2" />
        ))}
      </div>
    </aside>
  );
}
