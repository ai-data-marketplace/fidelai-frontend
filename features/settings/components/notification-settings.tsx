"use client";

import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Briefcase, ShoppingBag, Info, Mail, User } from "lucide-react";
import apiClient from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/endpoints";
import { useAuth } from "@/context/auth-context";
import { useProfile } from "@/lib/hooks";

export function NotificationSettings() {
  const { user } = useAuth();
  const profileQuery = useProfile();

  const [settings, setSettings] = useState({
    emailAll: true,
    accountAlerts: true,
    taskAlerts: true,
    marketplaceAlerts: false,
    systemAnnouncements: true,
  });

  const debounceRef = useRef<number | null>(null);

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const prefs = profileQuery.data?.notification_preferences as any;
    if (!prefs) return;
    try {
      const email_notification =
        prefs.email_notification ?? prefs.emailAll ?? true;
      const categories = prefs.categories ?? {};
      setSettings({
        emailAll: !!email_notification,
        accountAlerts:
          categories.account !== undefined ? !!categories.account : true,
        taskAlerts: !!categories.tasks,
        marketplaceAlerts: !!categories.marketplace,
        systemAnnouncements: !!categories.system,
      });
    } catch (e) {}
  }, [profileQuery.data]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      const payload = {
        notification_preferences: {
          email_notification: !!settings.emailAll,
          categories: {
            account: !!settings.accountAlerts,
            tasks: !!settings.taskAlerts,
            marketplace: !!settings.marketplaceAlerts,
            system: !!settings.systemAnnouncements,
          },
        },
      };

      try {
        await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, payload);
      } catch (err) {
        console.error("Failed updating notification preferences", err);
      }
    }, 1000);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [settings]);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b">
        <h3 className="text-lg font-bold">Email Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Manage which emails you want to receive from FidelAI.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <NotificationToggle
          icon={Mail}
          title="Global Email Notifications"
          description="Receive all major platform updates via your registered email address."
          checked={settings.emailAll}
          onToggle={() => toggle("emailAll")}
        />
        <NotificationToggle
          icon={User}
          title="Account Notifications"
          description="Get notified about important account changes, password updates, and security alerts."
          checked={settings.accountAlerts}
          onToggle={() => toggle("accountAlerts")}
        />
        {/* task toggle hidden for contributors */}
        {user?.role !== "contributor" && (
          <NotificationToggle
            icon={Briefcase}
            title="Task & Workspace Alerts"
            description="Get notified when a new task is assigned or your submission is reviewed."
            checked={settings.taskAlerts}
            onToggle={() => toggle("taskAlerts")}
          />
        )}
        <NotificationToggle
          icon={ShoppingBag}
          title="Marketplace & Sales"
          description="Receive alerts for dataset purchases, inquiries, and license approvals."
          checked={settings.marketplaceAlerts}
          onToggle={() => toggle("marketplaceAlerts")}
        />
        <NotificationToggle
          icon={Info}
          title="System Announcements"
          description="Stay updated on platform maintenance, security advisories, and new features."
          checked={settings.systemAnnouncements}
          onToggle={() => toggle("systemAnnouncements")}
        />
      </div>
    </div>
  );
}

function NotificationToggle({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: any;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon size={18} />
        </div>
        <div className="space-y-0.5">
          <h5 className="text-sm font-bold">{title}</h5>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}
