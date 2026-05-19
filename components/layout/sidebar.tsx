"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard,
  Upload,
  ListTodo,
  PenTool,
  ShieldCheck,
  ShoppingCart,
  Library,
  Settings,
  BarChart3,
  Users,
  User,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wallet
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const contributorLinks: SidebarItem[] = [
  { label: 'Overview', href: '/contributor', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Upload Dataset', href: '/contributor/upload', icon: <Upload className="h-4 w-4" /> },
  { label: 'My Submissions', href: '/contributor/submissions', icon: <FileText className="h-4 w-4" /> },
  { label: 'Wallet & Earnings', href: '/contributor/wallet', icon: <Wallet className="h-4 w-4" /> },
];

const annotatorLinks: SidebarItem[] = [
  { label: 'Dashboard', href: '/annotator', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Tasks', href: '/annotator/tasks', icon: <ListTodo className="h-4 w-4" /> },
  { label: 'Performance', href: '/annotator/performance', icon: <FileText className="h-4 w-4" /> },
  { label: 'Analytics', href: '/annotator/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Wallet & Earnings', href: '/annotator/wallet', icon: <Wallet className="h-4 w-4" /> },
];

const expertLinks: SidebarItem[] = [
  { label: 'Dashboard', href: '/expert', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Review Queue', href: '/expert/queue', icon: <ListTodo className="h-4 w-4" /> },
  { label: 'Performance', href: '/expert/performance', icon: <FileText className="h-4 w-4" /> },
  { label: 'Analytics', href: '/expert/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Wallet & Earnings', href: '/expert/wallet', icon: <Wallet className="h-4 w-4" /> },
];

const buyerLinks: SidebarItem[] = [
  { label: 'Dashboard', href: '/buyer', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Marketplace', href: '/buyer/marketplace', icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Library', href: '/buyer/library', icon: <Library className="h-4 w-4" /> },
];

const adminLinks: SidebarItem[] = [
  { label: 'Console', href: '/admin', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { label: 'System', href: '/admin/system', icon: <Settings className="h-4 w-4" /> },
];

const allRoleLinks: Record<string, SidebarItem[]> = {
  contributor: contributorLinks,
  annotator: annotatorLinks,
  expert: expertLinks,
  buyer: buyerLinks,
  admin: adminLinks,
};

const sharedLinks: SidebarItem[] = [
  { label: 'Profile', href: '/dashboard/profile', icon: <User className="h-4 w-4" /> },
  { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
  { label: 'Support', href: '/dashboard/support', icon: <HelpCircle className="h-4 w-4" /> },
];

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role = 'contributor' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const roleLinks = allRoleLinks[role] || contributorLinks;

  return (
    <aside className={cn(
      "flex h-full flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <Link href="/" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
            <h2 className="text-xl font-black brand-gradient-text">FidelAI</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{role} Panel</p>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg border bg-background hover:bg-muted transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
        {/* Role Specific Group */}
        <section>
          {!isCollapsed && <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase opacity-50">Main Menu</p>}
          <nav className="flex flex-col gap-1">
            {roleLinks.map((item) => (
              <SidebarNavLink key={item.href} item={item} active={pathname === item.href} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </section>

        {/* Shared Group */}
        <section>
          {!isCollapsed && <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase opacity-50">Account Management</p>}
          <nav className="flex flex-col gap-1">
            {sharedLinks.map((item) => (
              <SidebarNavLink key={item.href} item={item} active={pathname === item.href} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </section>
      </div>

      {/* Logout / User Info */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={() => {
            logout();
            router.replace('/login');
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarNavLink({ item, active, isCollapsed }: { item: SidebarItem; active: boolean; isCollapsed: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
        active
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        isCollapsed && "justify-center px-0"
      )}
    >
      <div className={cn("transition-transform duration-200 group-hover:scale-110", active && "scale-110")}>
        {item.icon}
      </div>
      {!isCollapsed && <span className="font-semibold">{item.label}</span>}
      {active && !isCollapsed && (
        <motion.div 
          layoutId="sidebar-active"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </Link>
  );
}
