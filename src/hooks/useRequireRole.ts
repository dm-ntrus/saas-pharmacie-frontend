import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '../context/OrganizationContext';

export function useRequireRole(requiredRoles: string[]) {
  const { currentOrganization, hasRole } = useOrganization();
  const router = useRouter();
  
  useEffect(() => {
    if (!currentOrganization) {
      router.replace('/auth/select-organization');
      return;
    }
    
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      router.replace('/unauthorized');
    }
  }, [currentOrganization, requiredRoles, hasRole, router]);
}