import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationCenter from "@/components/NotificationCenter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Home,
  Users,
  Heart,
  Store,
  Settings,
  Bot,
  User,
  Coffee,
  Twitter,
  TrendingUp,
  HelpCircle,
  Crown,
  Moon,
  Sun,
  Monitor,
  BarChart3,
  BookOpen,
  Shield,
  GraduationCap,
  LogOut,
  UserPlus,
  LogIn,
  Bell,
  ChevronDown
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) => location.pathname === path;

  // Dynamic menu based on authentication status
  const menuItems = isAuthenticated ? [
    { name: t('nav.home'), path: "/", icon: Home },
    { name: t('nav.about'), path: "/nosotros", icon: Users },
    { name: t('nav.stories'), path: "/desahogos", icon: Heart },
    { name: t('nav.resources'), path: "/recursos", icon: BookOpen },
    { name: t('nav.professionals'), path: "/profesionales", icon: GraduationCap },
    { name: t('nav.chatbot'), path: "/chatbot", icon: Bot },
    { name: t('nav.dashboard'), path: "/dashboard", icon: BarChart3 },
    { name: t('nav.coffee'), path: "/coffee", icon: Coffee },
  ] : [
    { name: t('nav.home'), path: "/", icon: Home },
    { name: t('nav.about'), path: "/nosotros", icon: Users },
    { name: t('nav.stories'), path: "/desahogos", icon: Heart },
    { name: t('nav.resources'), path: "/recursos", icon: BookOpen },
    { name: t('nav.chatbot'), path: "/chatbot", icon: Bot },
    { name: t('nav.register'), path: "/auth", icon: UserPlus },
    { name: t('nav.coffee'), path: "/coffee", icon: Coffee },
  ];

  const footerItems = [
    { name: t('nav.follow'), path: "/siguenos", icon: Twitter },
    { name: t('nav.trajectory'), path: "/historia", icon: TrendingUp },
    { name: t('nav.help'), path: "/ayuda", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-50/30 to-therapeutic-50/20">
      {/* Compact Dynamic Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-warm-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 lg:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Compact Logo */}
            <Link to="/" className="flex items-center space-x-1.5 group">
              <Crown className="h-6 w-6 lg:h-7 lg:w-7 text-primary fill-primary/20 group-hover:fill-primary/50 transition-all duration-300 group-hover:scale-110" />
              <span className="text-lg lg:text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">TIOSKAP</span>
            </Link>

            {/* Compact Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0.5">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActiveItem = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 h-9 transition-all duration-300 group hover:scale-105 ${
                        isActiveItem
                          ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
                          : "text-foreground hover:text-primary hover:bg-warm-100/80"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className={`h-3.5 w-3.5 transition-transform duration-300 ${isActiveItem ? 'text-white' : 'group-hover:scale-110'}`} />
                      <span className="text-xs font-medium hidden xl:inline transition-all duration-300">{item.name}</span>
                      {isActiveItem && (
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Compact User Controls */}
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Compact Theme & Language */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-warm-100/80 transition-all duration-300 hover:scale-110"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : theme === 'light' ? (
                    <Moon className="h-3.5 w-3.5" />
                  ) : (
                    <Monitor className="h-3.5 w-3.5" />
                  )}
                </Button>
                <div className="scale-90">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Compact Notifications */}
              {isAuthenticated && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-warm-100/80 transition-all duration-300 hover:scale-110"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 shadow-lg animate-bounce">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <NotificationCenter />
                  </PopoverContent>
                </Popover>
              )}

              {/* Compact User Authentication */}
              {isLoading ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 animate-pulse"></div>
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 flex items-center gap-1.5 px-2 hover:bg-warm-100/80 transition-all duration-300 hover:scale-105 group">
                      <Avatar className="h-6 w-6 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                        <AvatarFallback
                          style={{ backgroundColor: user.avatar_color }}
                          className="text-white text-xs font-bold"
                        >
                          {user.display_name?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-xs font-medium text-foreground leading-tight">
                          {user.display_name?.slice(0, 12)}{user.display_name?.length > 12 ? '...' : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={user.is_anonymous ? "secondary" : "default"}
                            className="text-xs h-3 px-1"
                          >
                            {user.is_anonymous ? "Anón" : user.role}
                          </Badge>
                          {user.subscription_type !== 'free' && (
                            <Crown className="h-2.5 w-2.5 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground hidden lg:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 shadow-xl border-warm-200/50">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.display_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email || "Usuario anónimo"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="group">
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <BarChart3 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="group">
                      <Link to="/seguridad" className="flex items-center gap-2">
                        <Settings className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild className="group">
                        <Link to="/admin" className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Panel Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 group"
                    >
                      <LogOut className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1">
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-muted-foreground hover:text-primary hover:bg-warm-100/80 transition-all duration-300 hover:scale-105"
                    >
                      <LogIn className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs hidden sm:inline">Ingresar</span>
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="h-8 px-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Registro</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Compact Mobile Navigation */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-warm-200/60 px-3 py-2 shadow-sm">
        <div className="grid grid-cols-4 gap-1.5">
          {menuItems.slice(0, isAuthenticated ? 8 : 7).map((item, index) => {
            const Icon = item.icon;
            const isActiveItem = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full flex flex-col items-center space-y-1 h-auto py-2.5 transition-all duration-300 group ${
                    isActiveItem
                      ? "bg-gradient-to-b from-primary to-primary/80 text-white shadow-lg scale-105"
                      : "text-foreground hover:text-primary hover:bg-warm-100/80 hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 25}ms` }}
                >
                  <Icon className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isActiveItem ? 'text-white' : 'group-hover:scale-110'
                  }`} />
                  <span className="text-xs font-medium leading-tight">{item.name.split(' ')[0]}</span>
                  {isActiveItem && (
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  )}
                </Button>
              </Link>
            );
          })}
          {/* Compact mobile user profile */}
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex flex-col items-center space-y-1 h-auto py-2.5 text-foreground hover:text-primary hover:bg-warm-100/80 hover:scale-105 transition-all duration-300 group"
                >
                  <Avatar className="h-3.5 w-3.5 ring-1 ring-primary/30 group-hover:ring-primary/50 transition-all">
                    <AvatarFallback
                      style={{ backgroundColor: user.avatar_color }}
                      className="text-white text-xs font-bold"
                    >
                      {user.display_name?.slice(0, 1).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 shadow-xl border-warm-200/50">
                <DropdownMenuLabel className="text-xs">
                  {user.display_name?.slice(0, 20)}{user.display_name?.length > 20 ? '...' : ''}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="group">
                  <Link to="/dashboard" className="text-sm">
                    <BarChart3 className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group">
                  <Link to="/seguridad" className="text-sm">
                    <Settings className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 text-sm group"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-warm-200/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            {footerItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-foreground hover:text-primary hover:bg-warm-100 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-warm-200/50">
            <p className="text-sm text-muted-foreground">
              © 2024 TIOSKAP - Espacio seguro para el bienestar mental
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
