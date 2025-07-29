import React from 'react';
import Link from 'next/link';
import { 
  BuildingStorefrontIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';

interface TenantSwitcherProps {
  currentTenant?: string;
}

const TenantSwitcher: React.FC<TenantSwitcherProps> = ({ currentTenant }) => {
  const demoTenants = [
    {
      slug: 'pharmacie1',
      name: 'Pharmacie Moderne',
      description: 'Kinshasa, RD Congo',
      color: 'bg-blue-500'
    },
    {
      slug: 'pharmacie-centrale',
      name: 'Pharmacie Centrale',
      description: 'Goma, RD Congo', 
      color: 'bg-green-500'
    },
    {
      slug: 'sante-plus',
      name: 'Santé Plus',
      description: 'Lubumbashi, RD Congo',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
        Pharmacies de Démonstration
      </h3>
      
      <div className="space-y-3">
        {demoTenants.map((tenant) => (
          <div
            key={tenant.slug}
            className={`border rounded-lg p-4 transition-colors ${
              currentTenant === tenant.slug 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${tenant.color}`}></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">{tenant.description}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/tenant/${tenant.slug}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  Visiter
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            {currentTenant === tenant.slug && (
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <p className="text-xs text-indigo-600 font-medium">
                  ✓ Pharmacie actuellement visitée
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Comment tester :</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Cliquez sur &quot;Visiter&quot; pour voir la page publique</p>
          <p>• Utilisez &quot;Espace Personnel&quot; pour accéder au tableau de bord</p>
          <p>• Chaque pharmacie a son propre domaine et ses données</p>
        </div>
      </div>
    </div>
  );
};

export default TenantSwitcher;