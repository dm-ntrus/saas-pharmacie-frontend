import React, { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Menu as MenuIcon,
  Bell,
  X,
  Home,
  Users,
  ClipboardList,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  UsersRound,
  DollarSign,
  Truck,
  Heart,
  Store,
  User,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { clsx } from 'clsx';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  requiredRoles?: UserRole[];
  badge?: number;
}

const navigation: NavigationItem[] = [
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: Home 
  },
  { 
    name: 'Patients', 
    href: '/patients', 
    icon: Users,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]
  },
  { 
    name: 'Prescriptions', 
    href: '/prescriptions', 
    icon: ClipboardList,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]
  },
  { 
    name: 'Inventaire', 
    href: '/inventory', 
    icon: Package,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]
  },
  { 
    name: 'Ventes', 
    href: '/sales', 
    icon: ShoppingBag,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN, UserRole.CASHIER]
  },
  { 
    name: 'Rapports', 
    href: '/reports', 
    icon: BarChart3,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST]
  },
  { 
    name: 'Utilisateurs', 
    href: '/users', 
    icon: UsersRound,
    requiredRoles: [UserRole.ADMIN]
  },
  { 
    name: 'Comptabilité', 
    href: '/accounting', 
    icon: DollarSign,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST]
  },
  { 
    name: 'RH', 
    href: '/hr', 
    icon: User,
    requiredRoles: [UserRole.ADMIN]
  },
  { 
    name: 'Livraisons', 
    href: '/delivery', 
    icon: Truck,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST]
  },
  { 
    name: 'Fidélité', 
    href: '/loyalty', 
    icon: Heart,
    requiredRoles: [UserRole.ADMIN, UserRole.PHARMACIST]
  },
  { 
    name: 'Pharmacies', 
    href: '/pharmacy', 
    icon: Store,
    requiredRoles: [UserRole.ADMIN]
  },
  { 
    name: 'Paramètres', 
    href: '/settings', 
    icon: Settings,
    requiredRoles: [UserRole.ADMIN]
  },
];

const Navigation = () => {
  const { user, logout, hasAnyRole } = useAuth();
  const router = useRouter();

  // Filtrer les éléments de navigation selon les rôles
  const filteredNavigation = navigation.filter(item => {
    if (!item.requiredRoles) return true;
    return hasAnyRole(item.requiredRoles);
  });

  const isCurrentPage = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/dashboard" className="flex items-center">
                    <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PS</span>
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      PharmacySaaS
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {filteredNavigation.slice(0, 6).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        isCurrentPage(item.href)
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors'
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Voir les notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Ouvrir le menu utilisateur</span>
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={clsx(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Mon profil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={clsx(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Paramètres
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={clsx(
                              active ? 'bg-gray-100' : '',
                              'block w-full text-left px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Se déconnecter
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Ouvrir le menu principal</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {filteredNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={clsx(
                    isCurrentPage(item.href)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Voir les notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as={Link}
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Mon profil
                </Disclosure.Button>
                <Disclosure.Button
                  as={Link}
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Paramètres
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Se déconnecter
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navigation;