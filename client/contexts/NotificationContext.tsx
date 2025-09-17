import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContextDatabase';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'crisis';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'reaction' | 'crisis' | 'system' | 'community' | 'achievement' | 'reminder';
  autoDelete?: number; // seconds until auto-delete
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadByCategory: (category: string) => Notification[];
  enablePushNotifications: () => Promise<boolean>;
  isPermissionGranted: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedNotifications = localStorage.getItem(`tioskap_notifications_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    }
  }, [isAuthenticated, user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (isAuthenticated && user && notifications.length > 0) {
      localStorage.setItem(`tioskap_notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, isAuthenticated, user]);

  // Check for push notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setIsPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Auto-delete notifications with expiry
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.filter(notification => {
        if (notification.autoDelete) {
          const elapsed = (Date.now() - notification.timestamp.getTime()) / 1000;
          return elapsed < notification.autoDelete;
        }
        return true;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep only last 100

    // Show browser notification if permission granted
    if (isPermissionGranted && 'Notification' in window) {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/placeholder.svg',
          badge: '/placeholder.svg',
          tag: newNotification.id,
          requireInteraction: notification.priority === 'critical',
          silent: notification.priority === 'low',
        });

        browserNotification.onclick = () => {
          if (notification.actionUrl) {
            window.open(notification.actionUrl, '_blank');
          }
          browserNotification.close();
        };

        // Auto-close non-critical notifications
        if (notification.priority !== 'critical') {
          setTimeout(() => browserNotification.close(), 5000);
        }
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }

    // Play notification sound for critical alerts
    if (notification.priority === 'critical' || notification.type === 'crisis') {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcCT2b3O+5dCI');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadByCategory = (category: string) => {
    return notifications.filter(n => !n.read && n.category === category);
  };

  const enablePushNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setIsPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPermissionGranted(granted);
      
      if (granted) {
        addNotification({
          type: 'success',
          title: '¡Notificaciones activadas!',
          message: 'Ahora recibirás alertas importantes en tiempo real',
          priority: 'medium',
          category: 'system',
          autoDelete: 5
        });
      }
      
      return granted;
    }

    return false;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications for demo
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Simulate random reactions every 30-60 seconds
      if (Math.random() < 0.3) {
        const reactions = ['❤️', '🤗', '💪', '🌟', '🙏'];
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        addNotification({
          type: 'info',
          title: 'Nueva reacción',
          message: `Alguien reaccionó ${reaction} a tu historia`,
          priority: 'low',
          category: 'reaction',
          actionUrl: '/desahogos',
          actionText: 'Ver historia',
          autoDelete: 30
        });
      }

      // Simulate wellness reminders
      if (Math.random() < 0.1) {
        const reminders = [
          'Recuerda tomar un respiro profundo',
          'Momento perfecto para una breve meditación',
          '¿Has bebido suficiente agua hoy?',
          'Considera escribir en tu diario personal'
        ];
        const reminder = reminders[Math.floor(Math.random() * reminders.length)];
        
        addNotification({
          type: 'info',
          title: 'Recordatorio de bienestar',
          message: reminder,
          priority: 'low',
          category: 'reminder',
          autoDelete: 60
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        addNotification, 
        markAsRead, 
        markAllAsRead,
        deleteNotification,
        clearAll,
        getUnreadByCategory,
        enablePushNotifications,
        isPermissionGranted
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Crisis Alert System
export const useCrisisAlerts = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const triggerCrisisAlert = (message: string, userId?: string) => {
    addNotification({
      type: 'crisis',
      title: '🚨 ALERTA DE CRISIS',
      message: `Posible situación de crisis detectada: "${message.substring(0, 100)}..."`,
      priority: 'critical',
      category: 'crisis',
      actionUrl: userId ? `/admin/crisis/${userId}` : '/admin/crisis',
      actionText: 'Ver detalles'
    });

    // Also add to crisis alerts for admins
    const existingAlerts = JSON.parse(localStorage.getItem('tioskap_crisis_alerts') || '[]');
    const newAlert = {
      id: `crisis_${Date.now()}`,
      userId: userId || 'anonymous',
      message: message.substring(0, 500),
      timestamp: new Date().toISOString(),
      severity: 'high',
      resolved: false,
      reportedBy: user?.id || 'system'
    };
    
    existingAlerts.unshift(newAlert);
    localStorage.setItem('tioskap_crisis_alerts', JSON.stringify(existingAlerts.slice(0, 100)));
  };

  return { triggerCrisisAlert };
};
