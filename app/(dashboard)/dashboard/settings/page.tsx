"use client";

import { Tabs } from "@/components/ui/tabs";
import { SecuritySettings } from "@/features/settings/components/security-settings";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import { Shield, Bell, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const settingsTabs = [
    {
      id: 'security',
      label: 'Security',
      icon: <Shield size={16} />,
      content: <SecuritySettings />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={16} />,
      content: <NotificationSettings />,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette size={16} />,
      content: <AppearanceSettings />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account configurations and platform preferences.</p>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <Tabs 
          tabs={settingsTabs} 
          defaultValue="security"
          className="p-8"
        />
      </div>
    </motion.div>
  );
}
