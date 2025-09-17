import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContextDatabase';

export interface OfflineAction {
  id: string;
  type: 'story_create' | 'story_react' | 'mood_entry' | 'goal_update' | 'notification_mark_read';
  data: any;
  timestamp: Date;
  userId: string;
  synced: boolean;
  attempts: number;
}

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActions: OfflineAction[];
  queueAction: (type: string, data: any) => void;
  syncPendingActions: () => Promise<void>;
  clearSyncedActions: () => void;
  getStorageUsage: () => Promise<StorageEstimate | null>;
  exportOfflineData: () => string;
  importOfflineData: (data: string) => boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored, syncing pending actions...');
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Working offline. Changes will sync when connection is restored.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending actions from localStorage
  useEffect(() => {
    if (user) {
      const savedActions = localStorage.getItem(`tioskap_offline_${user.id}`);
      if (savedActions) {
        const parsed = JSON.parse(savedActions);
        setPendingActions(parsed.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        })));
      }
    }
  }, [user]);

  // Save pending actions to localStorage
  useEffect(() => {
    if (user && pendingActions.length > 0) {
      localStorage.setItem(`tioskap_offline_${user.id}`, JSON.stringify(pendingActions));
    }
  }, [pendingActions, user]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingActions.length > 0 && !isSyncing) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions.length]);

  const queueAction = (type: string, data: any) => {
    if (!user) return;

    const action: OfflineAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      data,
      timestamp: new Date(),
      userId: user.id,
      synced: false,
      attempts: 0
    };

    setPendingActions(prev => [...prev, action]);

    // If online, try to sync immediately
    if (isOnline) {
      setTimeout(syncPendingActions, 100);
    }
  };

  const syncPendingActions = async () => {
    if (!isOnline || isSyncing || pendingActions.length === 0) return;

    setIsSyncing(true);
    
    try {
      const unsyncedActions = pendingActions.filter(action => !action.synced);
      let syncedCount = 0;
      let failedCount = 0;

      for (const action of unsyncedActions) {
        try {
          // Simulate API sync with random delay and occasional failure
          await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
          
          if (Math.random() > 0.1) { // 90% success rate
            await syncAction(action);
            
            setPendingActions(prev => prev.map(a => 
              a.id === action.id ? { ...a, synced: true } : a
            ));
            
            syncedCount++;
          } else {
            // Increment attempts for failed actions
            setPendingActions(prev => prev.map(a => 
              a.id === action.id ? { ...a, attempts: a.attempts + 1 } : a
            ));
            
            failedCount++;
          }
        } catch (error) {
          console.error('Error syncing action:', action, error);
          setPendingActions(prev => prev.map(a => 
            a.id === action.id ? { ...a, attempts: a.attempts + 1 } : a
          ));
          failedCount++;
        }
      }

      if (syncedCount > 0) {
        console.log(`✅ Sync complete: ${syncedCount} actions synced successfully`);
      }

      if (failedCount > 0) {
        console.log(`⚠️ Partial sync: ${failedCount} actions failed to sync. Will retry automatically.`);
      }

      // Remove synced actions older than 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      setPendingActions(prev => prev.filter(action => 
        !action.synced || action.timestamp > oneDayAgo
      ));

    } catch (error) {
      console.error('Sync error:', error);
      console.log('❌ Sync error: Could not sync with server. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncAction = async (action: OfflineAction): Promise<void> => {
    // Simulate different sync operations based on action type
    switch (action.type) {
      case 'story_create':
        // Sync story creation to server
        console.log('Syncing story creation:', action.data);
        break;
      
      case 'story_react':
        // Sync reaction to server
        console.log('Syncing story reaction:', action.data);
        break;
      
      case 'mood_entry':
        // Sync mood entry to server
        console.log('Syncing mood entry:', action.data);
        break;
      
      case 'goal_update':
        // Sync goal update to server
        console.log('Syncing goal update:', action.data);
        break;
      
      case 'notification_mark_read':
        // Sync notification status to server
        console.log('Syncing notification read status:', action.data);
        break;
      
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  const clearSyncedActions = () => {
    setPendingActions(prev => prev.filter(action => !action.synced));
    if (user) {
      const unsyncedActions = pendingActions.filter(action => !action.synced);
      localStorage.setItem(`tioskap_offline_${user.id}`, JSON.stringify(unsyncedActions));
    }
  };

  const getStorageUsage = async (): Promise<StorageEstimate | null> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        return await navigator.storage.estimate();
      } catch (error) {
        console.error('Error getting storage estimate:', error);
        return null;
      }
    }
    return null;
  };

  const exportOfflineData = (): string => {
    if (!user) return '';

    const data = {
      userId: user.id,
      exportDate: new Date().toISOString(),
      pendingActions,
      // Add other offline data
      mood: localStorage.getItem(`tioskap_mood_${user.id}`),
      goals: localStorage.getItem(`tioskap_goals_${user.id}`),
      notifications: localStorage.getItem(`tioskap_notifications_${user.id}`),
      searches: localStorage.getItem(`tioskap_searches_${user.id}`)
    };

    return JSON.stringify(data, null, 2);
  };

  const importOfflineData = (jsonData: string): boolean => {
    if (!user) return false;

    try {
      const data = JSON.parse(jsonData);
      
      if (data.userId !== user.id) {
        console.error('Import error: Data belongs to another user');
        return false;
      }

      // Import pending actions
      if (data.pendingActions) {
        const importedActions = data.pendingActions.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp),
          synced: false // Mark as unsynced to ensure they get processed
        }));
        setPendingActions(prev => [...prev, ...importedActions]);
      }

      // Import other data
      if (data.mood) {
        localStorage.setItem(`tioskap_mood_${user.id}`, data.mood);
      }
      if (data.goals) {
        localStorage.setItem(`tioskap_goals_${user.id}`, data.goals);
      }
      if (data.notifications) {
        localStorage.setItem(`tioskap_notifications_${user.id}`, data.notifications);
      }
      if (data.searches) {
        localStorage.setItem(`tioskap_searches_${user.id}`, data.searches);
      }

      console.log('Offline data imported successfully');

      return true;
    } catch (error) {
      console.error('Import error:', error);
      console.error('Import error: Could not import data. Check file format.');
      return false;
    }
  };

  // Service Worker Registration (if available)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingActions,
        queueAction,
        syncPendingActions,
        clearSyncedActions,
        getStorageUsage,
        exportOfflineData,
        importOfflineData
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

// Offline Status Component
export function OfflineStatus() {
  const { isOnline, isSyncing, pendingActions } = useOffline();
  const unsyncedCount = pendingActions.filter(action => !action.synced).length;

  if (isOnline && unsyncedCount === 0 && !isSyncing) {
    return null; // Don't show when everything is synced and online
  }

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-3 rounded-lg shadow-lg border ${
      isOnline 
        ? isSyncing 
          ? 'bg-blue-50 border-blue-200 text-blue-800'
          : 'bg-green-50 border-green-200 text-green-800'
        : 'bg-orange-50 border-orange-200 text-orange-800'
    }`}>
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          isOnline
            ? isSyncing
              ? 'bg-blue-500 animate-pulse'
              : 'bg-green-500'
            : 'bg-orange-500'
        }`} />
        
        {!isOnline && (
          <span>Modo offline</span>
        )}
        
        {isSyncing && (
          <span>Sincronizando...</span>
        )}
        
        {unsyncedCount > 0 && (
          <span>{unsyncedCount} acciones pendientes</span>
        )}
      </div>
    </div>
  );
}

// Offline Actions Hook
export function useOfflineActions() {
  const { queueAction, isOnline } = useOffline();

  const createStoryOffline = (storyData: any) => {
    queueAction('story_create', storyData);
  };

  const reactToStoryOffline = (storyId: string, reaction: string) => {
    queueAction('story_react', { storyId, reaction });
  };

  const addMoodEntryOffline = (moodData: any) => {
    queueAction('mood_entry', moodData);
  };

  const updateGoalOffline = (goalId: string, updates: any) => {
    queueAction('goal_update', { goalId, updates });
  };

  const markNotificationReadOffline = (notificationId: string) => {
    queueAction('notification_mark_read', { notificationId });
  };

  return {
    createStoryOffline,
    reactToStoryOffline,
    addMoodEntryOffline,
    updateGoalOffline,
    markNotificationReadOffline,
    isOnline
  };
}
