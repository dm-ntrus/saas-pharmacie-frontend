"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  Building2,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from "@/store/appStore";

type TopBarProps = {
  onMenuClick: () => void;
  sidebarOpen: boolean;
};

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { notifications, markNotificationAsRead } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un médicament, patient ou vente..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 text-slate-900 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <Link 
              href={``}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Nouvelle Vente
            </Link>
          </div>
        </header>
  );
};

export default TopBar;
