"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Menu, X } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { data: applicationStatus, isLoading: isApplicationStatusLoading } = useApplicationStatus();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const normalizedRole = (user?.role || "contributor").toLowerCase();
  const applicationRole = (applicationStatus?.role || normalizedRole).toLowerCase();
  const expectedRoute = (() => {
    if (!user) return "/login";
    if (applicationRole === "unknown") {
      return applicationStatus?.has_application ? "/onboarding/pending" : "/onboarding/step-1";
    }

    const roleRoots = ["contributor", "annotator", "expert", "buyer", "admin"];
    if (roleRoots.includes(normalizedRole)) {
      const firstSegment = pathname.split("/")[1];
      if (roleRoots.includes(firstSegment) && firstSegment !== normalizedRole) {
        return `/${normalizedRole}`;
      }
    }

    return null;
  })();

  useLayoutEffect(() => {
    if (isLoading || isApplicationStatusLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (expectedRoute && expectedRoute !== pathname) {
      router.replace(expectedRoute);
    }
  }, [applicationStatus, expectedRoute, isApplicationStatusLoading, isLoading, pathname, router, user]);

  if (isLoading || isApplicationStatusLoading || !user || (expectedRoute && expectedRoute !== pathname)) {
    return <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading dashboard...</div>;
  }

  const sidebarRole = (user.role || "contributor").toLowerCase();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r hidden md:block">
        <Sidebar role={sidebarRole} />
      </aside>

      {/* Mobile Menu Trigger */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-4 rounded-full bg-primary text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-background z-50 md:hidden border-r shadow-2xl"
            >
              <Sidebar role={sidebarRole} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar Placeholder / Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider md:hidden">FidelAI</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <span className="text-xs font-bold text-primary">{(user.full_name || user.email || "U").slice(0, 2).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
