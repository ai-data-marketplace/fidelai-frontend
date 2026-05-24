"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  Users, 
  Wallet, 
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const actions = [
  { 
    title: "Manage Payout", 
    href: "/admin/system", 
    icon: <Database className="h-5 w-5" />, 
    color: "bg-blue-500",
    description: "Configure payout rule" 
  },
  { 
    title: "Review Users", 
    href: "/admin/users", 
    icon: <Users className="h-5 w-5" />, 
    color: "bg-emerald-500",
    description: "Role and identity verification" 
  },
  { 
    title: "Manage Scores", 
    href: "/admin/system", 
    icon: <Wallet className="h-5 w-5" />, 
    color: "bg-amber-500",
    description: "Configure score rules" 
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href} className="block h-full">
          <Card className="relative h-full min-h-[112px] overflow-hidden border-border/40 bg-card shadow-sm transition-all group hover:border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${action.color} text-white p-3 rounded-2xl shadow-lg shadow-black/5`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                   <h3 className="text-sm font-black uppercase tracking-widest">{action.title}</h3>
                   <p className="text-xs text-muted-foreground font-medium">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
            {/* Visual highlight */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${action.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`} />
          </Card>
        </Link>
      ))}
    </div>
  );
}
