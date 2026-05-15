"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Marketplace", href: "#marketplace" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const role = user?.role?.toLowerCase() || null;
  const shouldFetchApplicationStatus = Boolean(user && role === "unknown");
  const { data: applicationStatus, isLoading: isApplicationStatusLoading } = useApplicationStatus({
    enabled: shouldFetchApplicationStatus,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const roleRoots = ["contributor", "annotator", "expert", "buyer", "admin"];
  const knownRoleHref = role && roleRoots.includes(role) ? `/${role}` : "/dashboard/profile";
  const onboardingHref = "/onboarding";

  let authMode: "guest" | "known-role" | "onboarding" | "review" = "guest";
  const isAuthActionsLoading = Boolean(user && shouldFetchApplicationStatus && isApplicationStatusLoading);
  if (user) {
    if (role === "unknown") {
      if (isApplicationStatusLoading) {
        authMode = "guest";
      } else if (applicationStatus?.has_application) {
        authMode = "review";
      } else {
        authMode = "onboarding";
      }
    } else {
      authMode = "known-role";
    }
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (isAuthLoading || isAuthActionsLoading) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl brand-gradient-logo flex items-center justify-center shadow-lg brand-shadow brand-shadow-hover transition-shadow">
                  <Database className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                <span className="brand-text">Fidel AI</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-10 w-24 rounded-lg bg-foreground/5 animate-pulse" />
              <div className="h-11 w-32 rounded-xl bg-foreground/5 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  const renderDesktopAuth = () => {
    if (authMode === "known-role") {
      return (
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={knownRoleHref}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </div>
      );
    }

    if (authMode === "onboarding") {
      return (
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={onboardingHref}
            className="px-5 py-2.5 text-sm font-medium text-white brand-gradient-btn rounded-xl shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5"
          >
            Complete Onboarding
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }

    if (authMode === "review") {
      return (
        <div className="hidden lg:flex items-center gap-3">
          <span className="px-4 py-2 text-sm font-medium text-orange-600">
            In Review
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="hidden lg:flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-5 py-2.5 text-sm font-medium text-white brand-gradient-btn rounded-xl shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5"
        >
          Get Started
        </Link>
      </div>
    );
  };

  const renderMobileAuth = () => {
    if (authMode === "known-role") {
      return (
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
          <Link
            href={knownRoleHref}
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        </div>
      );
    }

    if (authMode === "onboarding") {
      return (
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
          <Link
            href={onboardingHref}
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 text-sm text-center font-medium text-white brand-gradient-btn rounded-xl"
          >
            Complete Onboarding
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="px-4 py-3 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }

    if (authMode === "review") {
      return (
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
          <span className="px-4 py-3 text-sm text-center text-orange-600">
            In Review
          </span>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="px-4 py-3 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
        <Link
          href="/login"
          onClick={() => setMobileOpen(false)}
          className="px-4 py-3 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          onClick={() => setMobileOpen(false)}
          className="px-4 py-3 text-sm text-center font-medium text-white brand-gradient-btn rounded-xl"
        >
          Get Started
        </Link>
      </div>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl brand-gradient-logo flex items-center justify-center shadow-lg brand-shadow brand-shadow-hover transition-shadow">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl brand-gradient-logo opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                <span className="brand-text">Fidel AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            {renderDesktopAuth()}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {renderMobileAuth()}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
