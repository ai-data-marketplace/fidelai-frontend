"use client";

import { cn } from '@/lib/utils';
import { Bell, Briefcase, ShoppingCart, ShieldCheck, X } from 'lucide-react';

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'system' | 'task' | 'marketplace' | 'account';
    isRead: boolean;
  };
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const icons = {
  system: Bell,
  task: Briefcase,
  marketplace: ShoppingCart,
  account: ShieldCheck,
};

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const Icon = icons[(notification.type as keyof typeof icons)] || Bell;

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all flex items-start gap-4",
      notification.isRead ? "bg-background border-border" : "bg-primary/5 border-primary/20 ring-1 ring-primary/5"
    )}>
      <div className={cn(
        "p-2.5 rounded-lg border",
        notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary text-white border-primary shadow-sm"
      )}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn("font-bold text-sm", !notification.isRead && "text-primary")}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.time}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
        
        {!notification.isRead && (
          <button 
            onClick={() => onMarkRead?.(notification.id)}
            className="text-[10px] font-black uppercase tracking-widest text-primary mt-2 hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>

      <button 
        onClick={() => onDelete?.(notification.id)}
        className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
