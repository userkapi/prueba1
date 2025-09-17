import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  Bell,
  BellRing,
  Heart,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  MessageSquare,
  Star,
  Target,
  Clock,
  Trash2,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";
import { useState } from "react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const getIcon = () => {
    switch (notification.category) {
      case 'reaction': return Heart;
      case 'crisis': return AlertTriangle;
      case 'system': return Info;
      case 'community': return MessageSquare;
      case 'achievement': return Star;
      case 'reminder': return Clock;
      default: return Bell;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'crisis': return 'text-red-600';
      default: return 'text-blue-500';
    }
  };

  const getPriorityBorder = () => {
    switch (notification.priority) {
      case 'critical': return 'border-l-4 border-red-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'medium': return 'border-l-4 border-blue-500';
      default: return 'border-l-2 border-gray-300';
    }
  };

  const Icon = getIcon();

  return (
    <div 
      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-primary/5' : ''
      } ${getPriorityBorder()}`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full bg-muted ${getIconColor()}`}>
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium truncate ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-2 ml-2">
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
            
            {notification.actionUrl && notification.actionText && (
              <Link to={notification.actionUrl}>
                <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                  {notification.actionText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    enablePushNotifications,
    isPermissionGranted
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'reactions' | 'crisis' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'reactions': return notification.category === 'reaction';
      case 'crisis': return notification.category === 'crisis';
      case 'system': return notification.category === 'system';
      default: return true;
    }
  });

  const categoryCounts = {
    reactions: notifications.filter(n => n.category === 'reaction' && !n.read).length,
    crisis: notifications.filter(n => n.category === 'crisis' && !n.read).length,
    system: notifications.filter(n => n.category === 'system' && !n.read).length,
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8 p-0"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Push Notification Permission */}
        {!isPermissionGranted && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Activa las notificaciones
              </span>
            </div>
            <p className="text-xs text-blue-700 mb-2">
              Recibe alertas importantes en tiempo real
            </p>
            <Button 
              size="sm" 
              onClick={enablePushNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Activar
            </Button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            Todas ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="text-xs"
          >
            No leídas ({unreadCount})
          </Button>
          <Button
            variant={filter === 'reactions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('reactions')}
            className="text-xs"
          >
            <Heart className="h-3 w-3 mr-1" />
            {categoryCounts.reactions > 0 && `(${categoryCounts.reactions})`}
          </Button>
          <Button
            variant={filter === 'crisis' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('crisis')}
            className="text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            {categoryCounts.crisis > 0 && `(${categoryCounts.crisis})`}
          </Button>
        </div>

        {unreadCount > 0 && (
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80"
            >
              Marcar todas como leídas
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {filter === 'all' 
                  ? 'No tienes notificaciones' 
                  : `No hay notificaciones ${filter === 'unread' ? 'no leídas' : `de ${filter}`}`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
