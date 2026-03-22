"use client";

import React, { useState, useEffect } from 'react';
import { jwtService } from '@/services/jwt.service';
import { tokenService } from '@/services/token.service';
import { getCookie, setCookie } from '@/utils/cookies';

interface Organization {
  id: string;
  name: string;
  roles: string[];
  tenantId: string;
  subdomain: string;
}

export const OrganizationSelector: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<string | null>(null);
  
  useEffect(() => {
    // Extraire les organizations du token
    const token = tokenService.getAccessToken();
    if (token) {
      const orgs = jwtService.getOrganizations(token);
      setOrganizations(orgs.map(org => ({
        id: org.id,
        name: org.name,
        roles: org.roles,
        tenantId: org.attributes.tenant_id[0],
        subdomain: org.attributes.subdomain[0]
      })));
      
      // Sélectionner la première organization par défaut
      if (orgs.length > 0) {
        const savedOrg = getCookie("current_organization");
        setCurrentOrg(savedOrg || orgs[0].id);
      }
    }
  }, []);
  
  const handleOrgChange = (orgId: string) => {
    setCurrentOrg(orgId);
    
    // Save in cookie only
    setCookie("current_organization", orgId);
    localStorage.setItem("current_organization", orgId);
    // Recharger la page pour appliquer le nouveau contexte
    // window.location.reload();
  };
  
  if (organizations.length === 0) {
    return null;
  }
  
  if (organizations.length === 1) {
    // Une seule organization, pas besoin de sélecteur
    return (
      <div className="organization-badge">
        {organizations[0].name}
      </div>
    );
  }
  
  return (
    <div className="organization-selector">
      <label>Organisation</label>
      <select 
        value={currentOrg || ''} 
        onChange={(e) => handleOrgChange(e.target.value)}
      >
        {organizations.map(org => (
          <option key={org.id} value={org.id}>
            {org.name} ({org.roles.join(', ')})
          </option>
        ))}
      </select>
    </div>
  );
};