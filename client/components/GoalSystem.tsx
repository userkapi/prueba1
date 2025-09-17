import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import { format, addDays, addWeeks, addMonths, differenceInDays, isAfter, isBefore } from "date-fns";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Star,
  Flame,
  BookOpen,
  Heart,
  Brain,
  Activity,
  Users,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Flag
} from "lucide-react";

export type GoalCategory = 'mental_health' | 'social' | 'personal' | 'health' | 'learning' | 'creative';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';
export type GoalDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  difficulty: GoalDifficulty;
  status: GoalStatus;
  progress: number; // 0-100
  milestones: Milestone[];
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
  notes: string[];
  tags: string[];
  isPublic: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
  points: number;
}

interface GoalSystemProps {
  compact?: boolean;
}

const GOAL_CATEGORIES = [
  { 
    value: 'mental_health', 
    label: 'Salud Mental', 
    icon: Brain, 
    color: 'bg-blue-100 text-blue-800',
    description: 'Meditación, terapia, mindfulness'
  },
  { 
    value: 'social', 
    label: 'Social', 
    icon: Users, 
    color: 'bg-green-100 text-green-800',
    description: 'Relaciones, comunicación, apoyo'
  },
  { 
    value: 'personal', 
    label: 'Personal', 
    icon: Star, 
    color: 'bg-purple-100 text-purple-800',
    description: 'Autoestima, confianza, crecimiento'
  },
  { 
    value: 'health', 
    label: 'Salud Física', 
    icon: Activity, 
    color: 'bg-red-100 text-red-800',
    description: 'Ejercicio, nutrición, sueño'
  },
  { 
    value: 'learning', 
    label: 'Aprendizaje', 
    icon: BookOpen, 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Nuevas habilidades, conocimiento'
  },
  { 
    value: 'creative', 
    label: 'Creatividad', 
    icon: Heart, 
    color: 'bg-pink-100 text-pink-800',
    description: 'Arte, escritura, expresión'
  }
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Fácil', color: 'bg-green-100 text-green-800', points: 10 },
  { value: 'medium', label: 'Medio', color: 'bg-yellow-100 text-yellow-800', points: 25 },
  { value: 'hard', label: 'Difícil', color: 'bg-orange-100 text-orange-800', points: 50 },
  { value: 'expert', label: 'Experto', color: 'bg-red-100 text-red-800', points: 100 },
];

const GOAL_TEMPLATES = [
  {
    title: "Meditación diaria",
    description: "Practicar mindfulness 10 minutos cada día",
    category: 'mental_health' as GoalCategory,
    difficulty: 'easy' as GoalDifficulty,
    milestones: [
      { title: "Primera semana", description: "7 días consecutivos", points: 5 },
      { title: "Primer mes", description: "30 días de práctica", points: 15 },
      { title: "Hábito establecido", description: "90 días consecutivos", points: 30 }
    ]
  },
  {
    title: "Conectar con amigos",
    description: "Mantener contacto regular con amistades",
    category: 'social' as GoalCategory,
    difficulty: 'medium' as GoalDifficulty,
    milestones: [
      { title: "Contactar 3 amigos", description: "Llamar o escribir a 3 amigos", points: 10 },
      { title: "Planificar encuentro", description: "Organizar una reunión social", points: 15 },
      { title: "Rutina social", description: "Contacto semanal establecido", points: 25 }
    ]
  },
  {
    title: "Escribir un diario",
    description: "Reflexionar por escrito sobre mis emociones",
    category: 'personal' as GoalCategory,
    difficulty: 'easy' as GoalDifficulty,
    milestones: [
      { title: "Primera entrada", description: "Escribir mi primera reflexión", points: 5 },
      { title: "Una semana", description: "7 días de escritura", points: 10 },
      { title: "Hábito de escritura", description: "30 días consecutivos", points: 20 }
    ]
  }
];

export default function GoalSystem({ compact = false }: GoalSystemProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Load goals from localStorage
  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem(`tioskap_goals_${user.id}`);
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        setGoals(parsed.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt),
          targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
          milestones: goal.milestones.map((m: any) => ({
            ...m,
            completedAt: m.completedAt ? new Date(m.completedAt) : undefined
          }))
        })));
      }
    }
  }, [user]);

  // Save goals to localStorage
  useEffect(() => {
    if (user && goals.length > 0) {
      localStorage.setItem(`tioskap_goals_${user.id}`, JSON.stringify(goals));
    }
  }, [goals, user]);

  const createGoalFromTemplate = (template: any) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title: template.title,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      status: 'active',
      progress: 0,
      milestones: template.milestones.map((m: any, index: number) => ({
        id: `milestone_${Date.now()}_${index}`,
        title: m.title,
        description: m.description,
        completed: false,
        order: index,
        points: m.points
      })),
      targetDate: addMonths(new Date(), 3), // Default 3 months
      createdAt: new Date(),
      updatedAt: new Date(),
      reminderFrequency: 'weekly',
      notes: [],
      tags: [],
      isPublic: false
    };

    setGoals(prev => [newGoal, ...prev]);
    setIsCreatingGoal(false);

    addNotification({
      type: 'success',
      title: '🎯 Meta creada',
      message: `Has creado la meta: ${template.title}`,
      priority: 'medium',
      category: 'achievement',
      autoDelete: 5
    });
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              completed: !m.completed,
              completedAt: !m.completed ? new Date() : undefined
            };
          }
          return m;
        });

        const completedMilestones = updatedMilestones.filter(m => m.completed).length;
        const progress = (completedMilestones / updatedMilestones.length) * 100;
        const newStatus = progress === 100 ? 'completed' : 'active';

        // Notification for milestone completion
        if (!goal.milestones.find(m => m.id === milestoneId)?.completed) {
          const milestone = updatedMilestones.find(m => m.id === milestoneId);
          if (milestone) {
            addNotification({
              type: 'success',
              title: '🎉 ¡Hito completado!',
              message: `Has completado: ${milestone.title} (+${milestone.points} puntos)`,
              priority: 'medium',
              category: 'achievement',
              autoDelete: 8
            });
          }
        }

        // Notification for goal completion
        if (newStatus === 'completed' && goal.status !== 'completed') {
          addNotification({
            type: 'success',
            title: '🏆 ¡Meta completada!',
            message: `¡Felicidades! Has completado: ${goal.title}`,
            priority: 'high',
            category: 'achievement',
            autoDelete: 10
          });
        }

        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          status: newStatus,
          updatedAt: new Date()
        };
      }
      return goal;
    }));
  };

  const updateGoalStatus = (goalId: string, status: GoalStatus) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, status, updatedAt: new Date() }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    addNotification({
      type: 'info',
      title: 'Meta eliminada',
      message: 'La meta ha sido eliminada permanentemente',
      priority: 'low',
      category: 'system',
      autoDelete: 3
    });
  };

  const filteredGoals = goals.filter(goal => {
    switch (filter) {
      case 'active': return goal.status === 'active';
      case 'completed': return goal.status === 'completed';
      default: return true;
    }
  });

  const totalPoints = goals.reduce((sum, goal) => {
    return sum + goal.milestones
      .filter(m => m.completed)
      .reduce((mSum, m) => mSum + m.points, 0);
  }, 0);

  const activeGoalsCount = goals.filter(g => g.status === 'active').length;
  const completedGoalsCount = goals.filter(g => g.status === 'completed').length;

  if (compact) {
    return (
      <Card className="hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Mis Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Activas: {activeGoalsCount}</span>
              <span>Completadas: {completedGoalsCount}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{totalPoints} puntos</span>
            </div>

            {activeGoalsCount > 0 && (
              <div className="space-y-2">
                {goals.filter(g => g.status === 'active').slice(0, 2).map(goal => (
                  <div key={goal.id} className="p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{goal.title}</span>
                      <Badge className={DIFFICULTY_LEVELS.find(d => d.value === goal.difficulty)?.color}>
                        {DIFFICULTY_LEVELS.find(d => d.value === goal.difficulty)?.label}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-1" />
                    <span className="text-xs text-muted-foreground">{Math.round(goal.progress)}% completado</span>
                  </div>
                ))}
              </div>
            )}

            <Dialog open={isCreatingGoal} onOpenChange={setIsCreatingGoal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Meta</DialogTitle>
                  <DialogDescription>
                    Elige una plantilla o crea una meta personalizada
                  </DialogDescription>
                </DialogHeader>
                <GoalTemplateSelector onSelect={createGoalFromTemplate} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Metas Activas</p>
                <p className="text-2xl font-bold">{activeGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold">{completedGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Puntos Total</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Racha</p>
                <p className="text-2xl font-bold">
                  {goals.filter(g => g.progress > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Activas
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completadas
          </Button>
        </div>

        <Dialog open={isCreatingGoal} onOpenChange={setIsCreatingGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Meta</DialogTitle>
              <DialogDescription>
                Elige una plantilla o crea una meta personalizada
              </DialogDescription>
            </DialogHeader>
            <GoalTemplateSelector onSelect={createGoalFromTemplate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay metas {filter !== 'all' ? filter : ''}</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? '¡Comienza creando tu primera meta de bienestar!'
                  : `No tienes metas ${filter} en este momento.`
                }
              </p>
              <Button onClick={() => setIsCreatingGoal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              onUpdateStatus={updateGoalStatus}
              onDelete={deleteGoal}
              onEdit={() => setSelectedGoal(goal)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Goal Card Component
interface GoalCardProps {
  goal: Goal;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateStatus: (goalId: string, status: GoalStatus) => void;
  onDelete: (goalId: string) => void;
  onEdit: () => void;
}

function GoalCard({ goal, onToggleMilestone, onUpdateStatus, onDelete, onEdit }: GoalCardProps) {
  const category = GOAL_CATEGORIES.find(c => c.value === goal.category);
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === goal.difficulty);
  const CategoryIcon = category?.icon || Target;
  
  const daysLeft = goal.targetDate ? differenceInDays(goal.targetDate, new Date()) : null;
  const isOverdue = goal.targetDate && isAfter(new Date(), goal.targetDate);

  return (
    <Card className="hover-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CategoryIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{goal.title}</h3>
              <Badge className={difficulty?.color}>
                {difficulty?.label}
              </Badge>
              <Badge className={category?.color}>
                {category?.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(goal.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso: {Math.round(goal.progress)}%</span>
              {goal.targetDate && (
                <span className={isOverdue ? 'text-red-500' : daysLeft && daysLeft < 7 ? 'text-orange-500' : ''}>
                  {isOverdue ? 'Vencida' : daysLeft !== null ? `${daysLeft} días restantes` : ''}
                </span>
              )}
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Hitos:</h4>
            {goal.milestones.map(milestone => (
              <div key={milestone.id} className="flex items-center gap-3 p-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                >
                  {milestone.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{milestone.points}
                </Badge>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2 border-t">
            <div className="flex gap-2">
              {goal.status === 'active' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(goal.id, 'paused')}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              )}
              {goal.status === 'paused' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(goal.id, 'active')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </Button>
              )}
              {goal.status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(goal.id, 'active')}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reactivar
                </Button>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Creada {format(goal.createdAt, 'dd MMM', { locale: es })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Goal Template Selector Component
interface GoalTemplateSelectorProps {
  onSelect: (template: any) => void;
}

function GoalTemplateSelector({ onSelect }: GoalTemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Plantillas Recomendadas</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {GOAL_TEMPLATES.map((template, index) => {
            const category = GOAL_CATEGORIES.find(c => c.value === template.category);
            const difficulty = DIFFICULTY_LEVELS.find(d => d.value === template.difficulty);
            const CategoryIcon = category?.icon || Target;
            
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => onSelect(template)}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{template.title}</h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={category?.color}>{category?.label}</Badge>
                      <Badge className={difficulty?.color}>{difficulty?.label}</Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {template.milestones.length} hitos • {template.milestones.reduce((sum: number, m: any) => sum + m.points, 0)} puntos
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Crear meta personalizada
        </Button>
      </div>
    </div>
  );
}
