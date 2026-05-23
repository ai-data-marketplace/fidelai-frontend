"use client";

import { useState, useEffect } from "react";
import { NotificationItem } from "@/components/dashboard/notification-item";
import { Bell, CheckSquare, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/hooks";

export default function NotificationsPage() {
  const notificationsQuery = useNotifications({ page_size: 50 });
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (notificationsQuery.data?.results) {
      setNotifications(notificationsQuery.data.results);
    }
  }, [notificationsQuery.data]);
  const filteredNotifications = notifications;

  const markAllRead = async () => {
    try {
      await markAllMutation.mutateAsync();
      toast.success('All notifications marked as read');
      notificationsQuery.refetch();
    } catch (e) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification deleted");
  };

  const markRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success('Marked as read');
      notificationsQuery.refetch();
    } catch (e) {
      toast.error('Failed to mark as read');
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your tasks and account status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold border rounded-lg hover:bg-muted transition-colors"
          >
            <CheckSquare size={14} />
            Mark all as read
          </button>
 
        </div>
      </div>



      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <NotificationItem 
                notification={{
                  id: notification.id,
                  title: notification.title,
                  description: notification.message,
                  time: new Date(notification.created_at).toLocaleString(),
                  type: (notification.category || 'system') as any,
                  isRead: notification.is_read,
                }}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20"
          >
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
               <Bell className="text-muted-foreground opacity-50" size={32} />
            </div>
            <h3 className="text-lg font-bold text-muted-foreground">No notifications found</h3>
            <p className="text-sm text-muted-foreground opacity-70">We'll let you know when something important happens.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
