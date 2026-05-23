"use client";

import { useTheme } from "@/context/theme-context";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, color: "bg-white border-border" },
    { id: 'dark', label: 'Dark', icon: Moon, color: "bg-slate-900 border-slate-800" },
    { id: 'system', label: 'System', icon: Monitor, color: "bg-gradient-to-br from-white to-slate-900 border-border" },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b">
        <h3 className="text-lg font-bold">Theme & Appearance</h3>
        <p className="text-sm text-muted-foreground">Select your interface style for FidelAI.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={cn(
              "relative flex flex-col items-center gap-4 p-4 rounded-2xl border transition-all text-center group",
              theme === t.id 
                ? "bg-primary/5 border-primary shadow-lg scale-105" 
                : "bg-card border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
               "h-16 w-full rounded-xl border-2 flex items-center justify-center p-2",
               t.color
            )}>
              <t.icon className={cn(
                "h-8 w-8 transition-transform group-hover:scale-110",
                t.id === 'light' ? "text-amber-500" : t.id === 'dark' ? "text-blue-400" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{t.label}</span>
              {theme === t.id && (
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
