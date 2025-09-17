import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextDatabase";
import type { User, UserRole } from "@/contexts/AuthContextDatabase";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Crown, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Activity,
  Ban,
  CheckCircle,
  Clock,
  Search,
  Filter
} from "lucide-react";

interface CrisisAlert {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  severity: 'high' | 'critical';
  status: 'pending' | 'contacted' | 'resolved';
  assignedTo?: string;
  notes?: string;
}

export default function AdminPanel() {
  const { user, updateUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  // Load users and crisis alerts
  useEffect(() => {
    loadUsers();
    loadCrisisAlerts();
  }, []);

  const loadUsers = () => {
    const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
    setUsers(existingUsers.map((u: any) => ({
      ...u,
      joinedAt: new Date(u.joinedAt),
      lastLogin: new Date(u.lastLogin)
    })));
  };

  const loadCrisisAlerts = () => {
    const alerts = JSON.parse(localStorage.getItem('tioskap_crisis_alerts') || '[]');
    setCrisisAlerts(alerts.map((alert: any) => ({
      ...alert,
      timestamp: new Date(alert.timestamp)
    })));
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    
    // Update in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
    const updatedStorageUsers = existingUsers.map((u: any) => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    localStorage.setItem('tioskap_users', JSON.stringify(updatedStorageUsers));
  };

  const handleCrisisAlert = async (alertId: string, status: 'contacted' | 'resolved', notes?: string) => {
    const updatedAlerts = crisisAlerts.map(alert => 
      alert.id === alertId ? { 
        ...alert, 
        status, 
        assignedTo: user?.id,
        notes: notes || alert.notes 
      } : alert
    );
    setCrisisAlerts(updatedAlerts);
    localStorage.setItem('tioskap_crisis_alerts', JSON.stringify(updatedAlerts));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const pendingCrisisAlerts = crisisAlerts.filter(alert => alert.status === 'pending');
  const totalUsers = users.length;
  const activeUsers = users.filter(u => {
    const daysSinceLogin = Math.floor((Date.now() - u.lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLogin <= 7;
  }).length;

  // Check if user has admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-red-50 border-red-200">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Acceso Denegado</h2>
            <p className="text-red-600">No tienes permisos de administrador para acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-primary" />
          Panel de Administración
        </h1>
        <p className="text-lg text-muted-foreground">
          Gestión de usuarios, roles y alertas de crisis
        </p>
      </div>

      {/* Crisis Alerts Banner */}
      {pendingCrisisAlerts.length > 0 && (
        <Card className="bg-red-50 border-red-200 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-700">
                  ¡ALERTA DE CRISIS!
                </h3>
                <p className="text-red-600">
                  Hay {pendingCrisisAlerts.length} alerta(s) de crisis pendientes que requieren atención inmediata.
                </p>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  const element = document.getElementById('crisis-alerts');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Usuarios Totales</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">{activeUsers}</p>
            <p className="text-sm text-muted-foreground">Usuarios Activos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">{pendingCrisisAlerts.length}</p>
            <p className="text-sm text-muted-foreground">Alertas Pendientes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-500">98%</p>
            <p className="text-sm text-muted-foreground">Satisfacción</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger value="crisis" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas de Crisis
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios por nombre, email o username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="user">Usuario</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid gap-4">
            {filteredUsers.map(u => (
              <Card key={u.id} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: u.avatar }}
                      >
                        {u.display_name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{u.display_name}</h3>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={
                          u.role === 'admin' ? 'bg-red-100 text-red-800' :
                          u.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {u.role === 'admin' ? 'Administrador' :
                           u.role === 'moderator' ? 'Moderador' : 'Usuario'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Último acceso: {u.lastLogin.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <select 
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2 py-1 border rounded text-sm"
                          disabled={u.id === user.id} // Can't change own role
                        >
                          <option value="user">Usuario</option>
                          <option value="moderator">Moderador</option>
                          <option value="admin">Administrador</option>
                        </select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Crisis Alerts Tab */}
        <TabsContent value="crisis" className="space-y-6" id="crisis-alerts">
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Crisis
              </CardTitle>
              <CardDescription>
                Mensajes que contienen indicadores de riesgo suicida que requieren atención inmediata
              </CardDescription>
            </CardHeader>
          </Card>

          {crisisAlerts.map(alert => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.status === 'pending' ? 'border-l-red-500 bg-red-50/50' :
              alert.status === 'contacted' ? 'border-l-yellow-500 bg-yellow-50/50' :
              'border-l-green-500 bg-green-50/50'
            }`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          alert.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'
                        }>
                          {alert.severity === 'critical' ? 'CRÍTICO' : 'ALTO RIESGO'}
                        </Badge>
                        <Badge className={
                          alert.status === 'pending' ? 'bg-red-100 text-red-800' :
                          alert.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {alert.status === 'pending' ? 'PENDIENTE' :
                           alert.status === 'contacted' ? 'CONTACTADO' : 'RESUELTO'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold">Usuario: {alert.username}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {alert.timestamp.toLocaleString()}
                      </p>
                      
                      <div className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm italic">"{alert.message}"</p>
                      </div>
                      
                      {alert.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Notas del administrador:</strong> {alert.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {alert.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleCrisisAlert(alert.id, 'contacted', 'Usuario contactado por el equipo de crisis')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Marcar como Contactado
                      </Button>
                      <Button
                        onClick={() => handleCrisisAlert(alert.id, 'resolved', 'Crisis resuelta, usuario estable')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Resuelto
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {crisisAlerts.length === 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 text-center">
              <CardContent className="py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  No hay alertas de crisis
                </h3>
                <p className="text-muted-foreground">
                  Actualmente no hay alertas de crisis pendientes. El sistema monitorea automáticamente los mensajes.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
              <CardHeader>
                <CardTitle>Distribución de Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Administradores</span>
                    <Badge className="bg-red-100 text-red-800">
                      {users.filter(u => u.role === 'admin').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Moderadores</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {users.filter(u => u.role === 'moderator').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Usuarios</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {users.filter(u => u.role === 'user').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Usuarios activos (7 días)</span>
                    <Badge className="bg-green-100 text-green-800">{activeUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nuevos registros (7 días)</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {users.filter(u => {
                        const daysSinceJoin = Math.floor((Date.now() - u.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
                        return daysSinceJoin <= 7;
                      }).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Alertas resueltas (7 días)</span>
                    <Badge className="bg-green-100 text-green-800">
                      {crisisAlerts.filter(a => a.status === 'resolved').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
