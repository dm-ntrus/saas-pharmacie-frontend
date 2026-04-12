"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const hasAdminPermission = (permission: string) => {
    if (!user) return false;

    const adminPermissions: Record<string, string[]> = {
      system_admin: [
        "manage_users",
        "manage_tenants",
        "manage_settings",
        "view_reports",
      ],
    };

    for (const role of user.roles) {
      const perms = adminPermissions[role] || [];
      if (perms.includes(permission)) return true;
    }

    return false;
  };

  return (
    <AdminContext.Provider
      value={{
        hasAdminPermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
