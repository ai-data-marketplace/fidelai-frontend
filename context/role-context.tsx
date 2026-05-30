"use client";

import React, { createContext, useContext, useState } from "react";

type UserRole = "contributor" | "annotator" | "expert" | "buyer" | "admin";

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);

  const hasPermission = (requiredRole: UserRole) => {
    if (!role) return false;
    if (role === "admin") return true;
    return role === requiredRole;
  };

  return (
    <RoleContext.Provider value={{ role, setRole, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
};
