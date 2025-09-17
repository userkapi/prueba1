import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import { format, subDays, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Calendar,
  Crown,
  Shield,
  Star,
  Heart,
  Lock,
  Globe,
  Settings,
  UserPlus,
  UserMinus,
  MoreVertical,
  Pin,
  Flag,
  Award,
  TrendingUp,
  Clock,
  Brain,
  Activity,
  BookOpen,
  Video,
  Coffee,
  Gamepad2
} from "lucide-react";

export type GroupCategory = 'mental_health' | 'anxiety' | 'depression' | 'addiction' | 'grief' | 'relationships' | 'youth' | 'general';
export type GroupPrivacy = 'public' | 'private' | 'invite_only';
export type MemberRole = 'member' | 'moderator' | 'admin' | 'leader';
export type EventType = 'chat' | 'video_call' | 'workshop' | 'meditation' | 'support_circle';

export interface GroupMember {
  userId: string;
  displayName: string;
  avatar: string;
  role: MemberRole;
  joinedAt: Date;
  lastActive: Date;
  karma: number;
  contributionScore: number;
}

export interface GroupEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startTime: Date;
  endTime: Date;
  maxParticipants?: number;
  participants: string[];
  createdBy: string;
  isRecurring: boolean;
  meetingLink?: string;
}

export interface GroupMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: Date;
  isAnonymous: boolean;
  reactions: { [key: string]: string[] };
  isModerated: boolean;
  isPinned: boolean;
}

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  privacy: GroupPrivacy;
  coverImage: string;
  createdAt: Date;
  createdBy: string;
  members: GroupMember[];
  memberCount: number;
  maxMembers: number;
  rules: string[];
  tags: string[];
  isActive: boolean;
  events: GroupEvent[];
  messages: GroupMessage[];
  lastActivity: Date;
  karma: number;
}

const GROUP_CATEGORIES = [
  { value: 'mental_health', label: 'Salud Mental General', icon: Brain, color: 'bg-blue-100 text-blue-800' },
  { value: 'anxiety', label: 'Ansiedad', icon: Heart, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'depression', label: 'Depresión', icon: Users, color: 'bg-blue-100 text-blue-800' },
  { value: 'addiction', label: 'Adicciones', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'grief', label: 'Duelo y Pérdida', icon: Heart, color: 'bg-gray-100 text-gray-800' },
  { value: 'relationships', label: 'Relaciones', icon: Users, color: 'bg-pink-100 text-pink-800' },
  { value: 'youth', label: 'Jóvenes', icon: Star, color: 'bg-green-100 text-green-800' },
  { value: 'general', label: 'Apoyo General', icon: Users, color: 'bg-purple-100 text-purple-800' }
];

const EVENT_TYPES = [
  { value: 'chat', label: 'Chat Grupal', icon: MessageCircle, description: 'Conversación de texto en tiempo real' },
  { value: 'video_call', label: 'Videollamada', icon: Video, description: 'Encuentro virtual por video' },
  { value: 'workshop', label: 'Taller', icon: BookOpen, description: 'Sesión educativa o de habilidades' },
  { value: 'meditation', label: 'Meditación', icon: Activity, description: 'Sesión de mindfulness grupal' },
  { value: 'support_circle', label: 'Círculo de Apoyo', icon: Users, description: 'Espacio de apoyo mutuo' }
];

interface CommunityGroupsProps {
  compact?: boolean;
}

export default function CommunityGroups({ compact = false }: CommunityGroupsProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SupportGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<GroupCategory | 'all'>('all');

  // Load groups from localStorage
  useEffect(() => {
    const savedGroups = localStorage.getItem('tioskap_groups');
    if (savedGroups) {
      const parsed = JSON.parse(savedGroups);
      setGroups(parsed.map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt),
        lastActivity: new Date(group.lastActivity),
        members: group.members.map((m: any) => ({
          ...m,
          joinedAt: new Date(m.joinedAt),
          lastActive: new Date(m.lastActive)
        })),
        events: group.events.map((e: any) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime)
        })),
        messages: group.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      })));
    } else {
      // Initialize with sample groups
      initializeSampleGroups();
    }
  }, []);

  // Filter my groups
  useEffect(() => {
    if (user) {
      setMyGroups(groups.filter(group => 
        group.members.some(member => member.userId === user.id)
      ));
    }
  }, [groups, user]);

  const initializeSampleGroups = () => {
    const sampleGroups: SupportGroup[] = [
      {
        id: 'group_1',
        name: 'Apoyo para Ansiedad',
        description: 'Un espacio seguro para compartir experiencias y estrategias para manejar la ansiedad',
        category: 'anxiety',
        privacy: 'public',
        coverImage: '#FEF3C7',
        createdAt: subDays(new Date(), 30),
        createdBy: 'system',
        members: [],
        memberCount: 24,
        maxMembers: 50,
        rules: [
          'Respeta a todos los miembros',
          'Mantén la confidencialidad',
          'No discriminación',
          'Comparte con responsabilidad'
        ],
        tags: ['ansiedad', 'apoyo', 'estrategias'],
        isActive: true,
        events: [],
        messages: [],
        lastActivity: new Date(),
        karma: 85
      },
      {
        id: 'group_2',
        name: 'Jóvenes Unidos',
        description: 'Comunidad para jóvenes que buscan apoyo en salud mental',
        category: 'youth',
        privacy: 'public',
        coverImage: '#DCFCE7',
        createdAt: subDays(new Date(), 15),
        createdBy: 'system',
        members: [],
        memberCount: 18,
        maxMembers: 30,
        rules: [
          'Edad entre 16-25 años',
          'Respeto mutuo',
          'Sin bullying',
          'Apoyo constructivo'
        ],
        tags: ['jóvenes', 'universidad', 'adolescencia'],
        isActive: true,
        events: [],
        messages: [],
        lastActivity: new Date(),
        karma: 92
      },
      {
        id: 'group_3',
        name: 'Superando la Depresión',
        description: 'Grupo de apoyo para personas que enfrentan episodios depresivos',
        category: 'depression',
        privacy: 'private',
        coverImage: '#E0F2FE',
        createdAt: subDays(new Date(), 45),
        createdBy: 'system',
        members: [],
        memberCount: 31,
        maxMembers: 40,
        rules: [
          'Ambiente libre de juicios',
          'Comparte solo lo que te sientas cómodo',
          'Apoya sin dar consejos médicos',
          'Busca ayuda profesional cuando sea necesario'
        ],
        tags: ['depresión', 'recuperación', 'terapia'],
        isActive: true,
        events: [],
        messages: [],
        lastActivity: new Date(),
        karma: 78
      }
    ];

    setGroups(sampleGroups);
    localStorage.setItem('tioskap_groups', JSON.stringify(sampleGroups));
  };

  const createGroup = (groupData: Partial<SupportGroup>) => {
    if (!user) return;

    const newGroup: SupportGroup = {
      id: `group_${Date.now()}`,
      name: groupData.name || '',
      description: groupData.description || '',
      category: groupData.category || 'general',
      privacy: groupData.privacy || 'public',
      coverImage: groupData.coverImage || '#F3F4F6',
      createdAt: new Date(),
      createdBy: user.id,
      members: [{
        userId: user.id,
        displayName: user.display_name,
        avatar: user.avatar_color,
        role: 'leader',
        joinedAt: new Date(),
        lastActive: new Date(),
        karma: 0,
        contributionScore: 0
      }],
      memberCount: 1,
      maxMembers: groupData.maxMembers || 50,
      rules: groupData.rules || [],
      tags: groupData.tags || [],
      isActive: true,
      events: [],
      messages: [],
      lastActivity: new Date(),
      karma: 0
    };

    setGroups(prev => [newGroup, ...prev]);
    setIsCreatingGroup(false);

    addNotification({
      type: 'success',
      title: '🎉 Grupo creado',
      message: `Tu grupo "${newGroup.name}" ha sido creado exitosamente`,
      priority: 'medium',
      category: 'achievement',
      autoDelete: 5
    });
  };

  const joinGroup = (groupId: string) => {
    if (!user) return;

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const isAlreadyMember = group.members.some(member => member.userId === user.id);
        if (isAlreadyMember) return group;

        const newMember: GroupMember = {
          userId: user.id,
          displayName: user.display_name,
          avatar: user.avatar_color,
          role: 'member',
          joinedAt: new Date(),
          lastActive: new Date(),
          karma: 0,
          contributionScore: 0
        };

        return {
          ...group,
          members: [...group.members, newMember],
          memberCount: group.memberCount + 1,
          lastActivity: new Date()
        };
      }
      return group;
    }));

    addNotification({
      type: 'success',
      title: '✅ Te uniste al grupo',
      message: 'Ahora eres miembro del grupo. ¡Bienvenido!',
      priority: 'medium',
      category: 'community',
      autoDelete: 5
    });
  };

  const leaveGroup = (groupId: string) => {
    if (!user) return;

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.userId !== user.id),
          memberCount: Math.max(0, group.memberCount - 1),
          lastActivity: new Date()
        };
      }
      return group;
    }));

    addNotification({
      type: 'info',
      title: 'Saliste del grupo',
      message: 'Ya no eres miembro del grupo',
      priority: 'low',
      category: 'community',
      autoDelete: 3
    });
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || group.category === filterCategory;
    
    return matchesSearch && matchesCategory && group.isActive;
  });

  if (compact) {
    return (
      <Card className="hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Grupos de Apoyo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Mis grupos: {myGroups.length}</span>
              <span>Disponibles: {filteredGroups.length}</span>
            </div>

            {myGroups.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Grupos activos:</h4>
                {myGroups.slice(0, 2).map(group => (
                  <div key={group.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: group.coverImage }}
                    >
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.memberCount} miembros</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear grupo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Grupo de Apoyo</DialogTitle>
                  <DialogDescription>
                    Crea un espacio seguro para que otros puedan encontrar apoyo
                  </DialogDescription>
                </DialogHeader>
                <GroupCreationForm onSubmit={createGroup} onCancel={() => setIsCreatingGroup(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Grupos de Apoyo</h2>
          <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Grupo de Apoyo</DialogTitle>
                <DialogDescription>
                  Crea un espacio seguro para que otros puedan encontrar apoyo
                </DialogDescription>
              </DialogHeader>
              <GroupCreationForm onSubmit={createGroup} onCancel={() => setIsCreatingGroup(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar grupos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {GROUP_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList>
          <TabsTrigger value="discover">Descubrir</TabsTrigger>
          <TabsTrigger value="my-groups">
            Mis Grupos ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                user={user}
                onJoin={() => joinGroup(group.id)}
                onLeave={() => leaveGroup(group.id)}
                onView={() => setSelectedGroup(group)}
              />
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron grupos</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta con otros términos de búsqueda o crea tu propio grupo
                </p>
                <Button onClick={() => setIsCreatingGroup(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear mi primer grupo
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Groups Tab */}
        <TabsContent value="my-groups">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                user={user}
                isMember={true}
                onLeave={() => leaveGroup(group.id)}
                onView={() => setSelectedGroup(group)}
              />
            ))}
          </div>
          
          {myGroups.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No estás en ningún grupo</h3>
                <p className="text-muted-foreground mb-4">
                  Únete a un grupo existente o crea uno nuevo para comenzar a conectar
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setIsCreatingGroup(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <EventsSection groups={myGroups} user={user} />
        </TabsContent>
      </Tabs>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <GroupDetailModal
          group={selectedGroup}
          user={user}
          onClose={() => setSelectedGroup(null)}
          onJoin={() => joinGroup(selectedGroup.id)}
          onLeave={() => leaveGroup(selectedGroup.id)}
        />
      )}
    </div>
  );
}

// Group Card Component
interface GroupCardProps {
  group: SupportGroup;
  user: any;
  isMember?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onView?: () => void;
}

function GroupCard({ group, user, isMember, onJoin, onLeave, onView }: GroupCardProps) {
  const category = GROUP_CATEGORIES.find(c => c.value === group.category);
  const isUserMember = group.members.some(member => member.userId === user?.id);
  const userRole = group.members.find(member => member.userId === user?.id)?.role;

  return (
    <Card className="hover-lift cursor-pointer transition-all duration-200" onClick={onView}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: group.coverImage }}
              >
                {group.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold line-clamp-1">{group.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={category?.color}>{category?.label}</Badge>
                  {group.privacy === 'private' && <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
            </div>
          </div>
          
          {userRole && (
            <Badge variant="secondary" className="text-xs">
              {userRole === 'leader' ? '👑' : userRole === 'moderator' ? '🛡️' : '👤'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.memberCount}/{group.maxMembers} miembros
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {group.karma} karma
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Última actividad: {format(group.lastActivity, 'dd MMM', { locale: es })}
            </div>
            
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isUserMember ? (
                <Button variant="outline" size="sm" onClick={onLeave}>
                  <UserMinus className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              ) : (
                <Button size="sm" onClick={onJoin}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Unirse
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Group Creation Form Component
interface GroupCreationFormProps {
  onSubmit: (groupData: Partial<SupportGroup>) => void;
  onCancel: () => void;
}

function GroupCreationForm({ onSubmit, onCancel }: GroupCreationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general' as GroupCategory,
    privacy: 'public' as GroupPrivacy,
    maxMembers: 50,
    rules: ['Respeta a todos los miembros', 'Mantén la confidencialidad'],
    tags: [] as string[],
    coverImage: '#8B5CF6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Nombre del grupo</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ej: Apoyo para Ansiedad"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe el propósito y ambiente de tu grupo..."
          rows={3}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={formData.category} onValueChange={(value: GroupCategory) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GROUP_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Privacidad</Label>
          <Select value={formData.privacy} onValueChange={(value: GroupPrivacy) => setFormData(prev => ({ ...prev, privacy: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Público
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Privado
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Número máximo de miembros: {formData.maxMembers}</Label>
        <input
          type="range"
          min="10"
          max="100"
          value={formData.maxMembers}
          onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Color del grupo</Label>
        <div className="flex gap-2">
          {['#8B5CF6', '#059669', '#DC2626', '#D97706', '#2563EB', '#7C3AED'].map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${formData.coverImage === color ? 'border-gray-900' : 'border-gray-300'}`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData(prev => ({ ...prev, coverImage: color }))}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Crear Grupo
        </Button>
      </div>
    </form>
  );
}

// Group Detail Modal Component
interface GroupDetailModalProps {
  group: SupportGroup;
  user: any;
  onClose: () => void;
  onJoin: () => void;
  onLeave: () => void;
}

function GroupDetailModal({ group, user, onClose, onJoin, onLeave }: GroupDetailModalProps) {
  const isUserMember = group.members.some(member => member.userId === user?.id);
  const userRole = group.members.find(member => member.userId === user?.id)?.role;
  const category = GROUP_CATEGORIES.find(c => c.value === group.category);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: group.coverImage }}
            >
              {group.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{group.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {group.description}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={category?.color}>{category?.label}</Badge>
                {group.privacy === 'private' && (
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Privado
                  </Badge>
                )}
                <Badge variant="outline">
                  {group.memberCount}/{group.maxMembers} miembros
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="members">Miembros</TabsTrigger>
            {isUserMember && <TabsTrigger value="chat">Chat</TabsTrigger>}
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Reglas del grupo</h4>
                  <ul className="space-y-1">
                    {group.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Estadísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Miembros activos</span>
                      <span>{group.memberCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Karma del grupo</span>
                      <span>{group.karma}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Creado el</span>
                      <span>{format(group.createdAt, 'dd MMM yyyy', { locale: es })}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {isUserMember ? (
                    <div className="space-y-2">
                      <Button variant="outline" onClick={onLeave} className="w-full">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Salir del grupo
                      </Button>
                      {userRole && (
                        <Badge className="w-full justify-center">
                          Tu rol: {userRole === 'leader' ? 'Líder' : userRole === 'moderator' ? 'Moderador' : 'Miembro'}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Button onClick={onJoin} className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Unirse al grupo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-4">
              <h4 className="font-semibold">Miembros ({group.memberCount})</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {group.members.map(member => (
                  <div key={member.userId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarFallback style={{ backgroundColor: member.avatar }}>
                        {member.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.displayName}</span>
                        {member.role === 'leader' && <Crown className="h-4 w-4 text-amber-500" />}
                        {member.role === 'moderator' && <Shield className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Se unió {format(member.joinedAt, 'dd MMM', { locale: es })} • {member.karma} karma
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            {isUserMember ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Chat del grupo</h4>
                <p className="text-muted-foreground">
                  El chat estará disponible próximamente. Mientras tanto, puedes participar en los eventos del grupo.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Únete para acceder al chat</h4>
                <p className="text-muted-foreground mb-4">
                  Necesitas ser miembro del grupo para participar en las conversaciones
                </p>
                <Button onClick={onJoin}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Unirse al grupo
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Próximos eventos</h4>
              <p className="text-muted-foreground">
                No hay eventos programados. Los líderes del grupo pueden crear eventos para la comunidad.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Events Section Component
interface EventsSectionProps {
  groups: SupportGroup[];
  user: any;
}

function EventsSection({ groups, user }: EventsSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sistema de eventos en desarrollo</h3>
          <p className="text-muted-foreground">
            Próximamente podrás crear y participar en eventos grupales como talleres, 
            meditaciones grupales, videollamadas y círculos de apoyo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
