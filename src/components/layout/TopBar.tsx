import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/appStore";
import {
  Bell,
  Menu as MenuIcon,
  Search,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "@/lib/i18n-simple";

type TopbarProps = {
  onMenuClick: () => void;
  sidebarOpen: boolean;
};

const TopBar: React.FC<TopbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } =
    useAppStore();
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tNotifications = useTranslations("notifications");
  const tTopBar = useTranslations("layout.topbar");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Toggle button for desktop */}
          {/* <button
            onClick={onMenuClick}
            className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-4"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button> */}

          {/* Search */}
          <div className="ml-2 sm:ml-4 max-w-lg w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={tCommon("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500">
              <span className="sr-only">{tNotifications("title")}</span>
              <div className="relative">
                <Bell className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {tNotifications("title")} ({unreadNotifications.length})
                    </p>
                  </div>
                  {unreadNotifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      {tNotifications("noUnread")}
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {unreadNotifications.slice(0, 5).map((notification) => (
                        <Menu.Item key={notification.id}>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                handleNotificationClick(notification.id)
                              }
                              className={`${
                                active ? "bg-gray-50" : ""
                              } block w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50`}
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <span
                                  className={`inline-block w-2 h-2 rounded-full ${
                                    notification.type === "error"
                                      ? "bg-red-500"
                                      : notification.type === "warning"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }`}
                                />
                              </div>
                              <p className="mt-1 text-sm text-gray-600 truncate">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString(locale)}
                              </p>
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  )}
                  {unreadNotifications.length > 5 && (
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        href="/notifications"
                        className="text-sm text-emerald-600 hover:text-emerald-500"
                      >
                        {tTopBar("viewAllNotifications")}
                      </Link>
                    </div>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <span className="sr-only">{tTopBar("openUserMenu")}</span>
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              ) : (
                <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircle className="mr-3 h-5 w-5" />
                        {tTopBar("myProfile")}
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        {tTopBar("settings")}
                      </Link>
                    )}
                  </Menu.Item>

                  <div className="border-t border-gray-100"></div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        {tTopBar("logout")}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
