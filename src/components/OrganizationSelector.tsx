import React from 'react';
import { useOrganization } from '@/context/OrganizationContext';

interface ProtectedComponentProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  requiredRoles = [],
  requiredPermissions = [],
  fallback = null,
  children
}) => {
  const { hasRole, hasPermission } = useOrganization();
  
  // Vérifier les rôles
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => hasRole(role));
  
  // Vérifier les permissions
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));
  
  if (!hasRequiredRole || !hasRequiredPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};