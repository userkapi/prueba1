import { useNotifications } from '../contexts/NotificationContext';
import { useOffline } from '../contexts/OfflineContext';

/**
 * Utility hook that combines offline status with notifications
 * Use this in components that need to show notifications based on offline events
 */
export const useOfflineNotifications = () => {
  const { addNotification } = useNotifications();
  const { isOnline, isSyncing, pendingActions } = useOffline();

  const notifyOnlineStatus = (isOnlineNow: boolean) => {
    if (isOnlineNow) {
      addNotification({
        type: 'success',
        title: '🌐 Conexión restaurada',
        message: 'Sincronizando datos pendientes...',
        priority: 'medium',
        category: 'system',
        autoDelete: 3
      });
    } else {
      addNotification({
        type: 'warning',
        title: '📴 Sin conexión',
        message: 'Trabajando en modo offline. Los cambios se sincronizarán cuando se restablezca la conexión.',
        priority: 'medium',
        category: 'system',
        autoDelete: 5
      });
    }
  };

  const notifySyncStatus = (syncedCount: number, failedCount: number) => {
    if (syncedCount > 0) {
      addNotification({
        type: 'success',
        title: '✅ Sincronización completa',
        message: `${syncedCount} acciones sincronizadas correctamente`,
        priority: 'low',
        category: 'system',
        autoDelete: 3
      });
    }

    if (failedCount > 0) {
      addNotification({
        type: 'warning',
        title: '⚠️ Sincronización parcial',
        message: `${failedCount} acciones no pudieron sincronizarse. Se reintentará automáticamente.`,
        priority: 'medium',
        category: 'system',
        autoDelete: 5
      });
    }
  };

  const notifySyncError = () => {
    addNotification({
      type: 'error',
      title: '❌ Error de sincronización',
      message: 'No se pudo sincronizar con el servidor. Se reintentará automáticamente.',
      priority: 'medium',
      category: 'system',
      autoDelete: 5
    });
  };

  return {
    isOnline,
    isSyncing,
    pendingActions,
    notifyOnlineStatus,
    notifySyncStatus,
    notifySyncError
  };
};
