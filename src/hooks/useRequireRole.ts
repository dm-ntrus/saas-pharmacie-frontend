import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../context/OrganizationContext';

export function useRequireRole(requiredRoles: string[]) {
  const { currentOrganization, hasRole } = useOrganization();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentOrganization) {
      navigate('/auth/select-organization');
      return;
    }
    
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      navigate('/unauthorized');
    }
  }, [currentOrganization, requiredRoles, hasRole, navigate]);
}