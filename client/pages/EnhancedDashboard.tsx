import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import { useOffline } from "@/contexts/OfflineContext";
import MoodTracker from "@/components/MoodTracker";
import GoalSystem from "@/components/GoalSystem";
import CommunityGroups from "@/components/CommunityGroups";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import UserWelcome from "@/components/UserWelcome";
import { format, subDays, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart3,
  Heart,
  Users,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Settings,
  Palette,
  Eye,
  Bell,
  Wifi,
  WifiOff,
  Activity,
  Brain,
  Star,
  Crown,
  Shield,
  Clock,
  MessageSquare,
  BookOpen,
  Sparkles
} from "lucide-react";

export default function EnhancedDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const { isOnline, pendingActions } = useOffline();
  const [selectedTab, setSelectedTab] = useState("overview");

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <UserWelcome />
      </div>
    );
  }

  // Calculate user stats
  const recentNotifications = notifications.filter(n => 
    n.timestamp >= subDays(new Date(), 7)
  ).length;

  const userLevel = Math.floor(user.login_streak / 7) + 1;
  const nextLevelProgress = ((user.login_streak % 7) / 7) * 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: user.avatar_color }}
            >
              {user.display_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                ¡Hola, {user.display_name}! 👋
              </h1>
              <p className="text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: es })}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.is_anonymous ? "secondary" : "default"}>
                  {user.is_anonymous ? "Anónimo" : user.role}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Nivel {userLevel}
                </Badge>
                {!isOnline && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <WifiOff className="h-3 w-3" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden md:flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Racha: {user.login_streak} días
          </Badge>
          {pendingActions.length > 0 && (
            <Badge variant="secondary">
              {pendingActions.length} acciones pendientes
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Historias</p>
                <p className="text-2xl font-bold">{user.stories_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Reacciones</p>
                <p className="text-2xl font-bold">{user.reactions_received}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Notificaciones</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nivel</p>
                <p className="text-2xl font-bold">{userLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso al siguiente nivel</span>
            <span className="text-sm text-muted-foreground">
              {user.login_streak % 7}/7 días
            </span>
          </div>
          <Progress value={nextLevelProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Ánimo</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Metas</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Grupos</span>
          </TabsTrigger>
          <TabsTrigger value="customization" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Temas</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mood Tracker Compact */}
            <MoodTracker compact />
            
            {/* Goals Compact */}
            <GoalSystem compact />
            
            {/* Community Groups Compact */}
            <CommunityGroups compact />
            
            {/* Recent Activity */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.timestamp, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay actividad reciente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/desahogos">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nueva historia
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/chatbot">
                      <Heart className="h-4 w-4 mr-2" />
                      Hablar con IA
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/recursos">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explorar recursos
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Score */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Puntuación de Bienestar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((user.login_streak * 10 + user.reactions_received * 2) / 10)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basado en tu actividad y consistencia
                  </p>
                  <Progress 
                    value={Math.min(((user.login_streak * 10 + user.reactions_received * 2) / 10) * 2, 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mood Tab */}
        <TabsContent value="mood">
          <MoodTracker />
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals">
          <GoalSystem />
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community">
          <CommunityGroups />
        </TabsContent>

        {/* Customization Tab */}
        <TabsContent value="customization">
          <div className="space-y-6">
            <ThemeCustomizer />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <AccessibilityPanel />
            
            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Información Personal</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Nombre: {user.display_name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Email: {user.email || "Usuario anónimo"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Miembro desde: {format(new Date(user.created_at), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Preferencias</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Idioma: {user.language === 'es' ? 'Español' : 'English'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tema: {user.theme || 'auto'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones: {user.notifications_email ? 'Activadas' : 'Desactivadas'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/seguridad">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración avanzada
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
