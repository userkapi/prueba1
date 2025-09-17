import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Calendar, 
  Heart, 
  Activity, 
  Target, 
  Award,
  Sparkles,
  Brain,
  Smile,
  Frown,
  Meh,
  CheckCircle,
  Trophy,
  Zap,
  Moon,
  Sun,
  BarChart3,
  LineChart
} from "lucide-react";

interface MoodData {
  date: string;
  mood: number;
  note?: string;
  activities?: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  target?: number;
}

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  streak: number;
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([
    { date: '2024-01-15', mood: 8, activities: ['meditation', 'exercise'] },
    { date: '2024-01-14', mood: 6, activities: ['journaling'] },
    { date: '2024-01-13', mood: 7, activities: ['breathing', 'reading'] },
    { date: '2024-01-12', mood: 5, activities: ['meditation'] },
    { date: '2024-01-11', mood: 9, activities: ['exercise', 'social'] },
    { date: '2024-01-10', mood: 4, activities: ['rest'] },
    { date: '2024-01-09', mood: 7, activities: ['meditation', 'journaling'] }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primera Historia',
      description: 'Compartiste tu primera historia',
      icon: '📖',
      unlocked: true,
      unlockedDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Semana de Apoyo',
      description: 'Diste reacciones de apoyo 7 días seguidos',
      icon: '❤️',
      unlocked: true,
      unlockedDate: '2024-01-12'
    },
    {
      id: '3',
      title: 'Meditador Dedicado',
      description: 'Completa 10 sesiones de meditación',
      icon: '🧘',
      unlocked: false,
      progress: 7,
      target: 10
    },
    {
      id: '4',
      title: 'Estrella Brillante',
      description: 'Mantén un estado de ánimo positivo por 5 días',
      icon: '⭐',
      unlocked: false,
      progress: 3,
      target: 5
    },
    {
      id: '5',
      title: 'Guerrero Resiliente',
      description: 'Supera 30 días de seguimiento',
      icon: '🛡️',
      unlocked: false,
      progress: 15,
      target: 30
    }
  ]);

  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoal[]>([
    {
      id: '1',
      title: 'Meditación Diaria',
      description: 'Medita al menos 10 minutos al día',
      type: 'daily',
      target: 1,
      current: 0,
      streak: 5
    },
    {
      id: '2',
      title: 'Registro de Ánimo',
      description: 'Registra tu estado de ánimo diariamente',
      type: 'daily',
      target: 1,
      current: 1,
      streak: 12
    },
    {
      id: '3',
      title: 'Apoyo Comunitario',
      description: 'Da 5 reacciones de apoyo por semana',
      type: 'weekly',
      target: 5,
      current: 3,
      streak: 2
    }
  ]);

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="h-4 w-4 text-red-500" />;
    if (mood <= 6) return <Meh className="h-4 w-4 text-yellow-500" />;
    return <Smile className="h-4 w-4 text-green-500" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'bg-red-100 text-red-800';
    if (mood <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const calculateAverageMood = () => {
    const recent = moodHistory.slice(0, 7);
    const average = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    return Math.round(average * 10) / 10;
  };

  const getCurrentStreak = () => {
    let streak = 0;
    for (let i = 0; i < moodHistory.length; i++) {
      if (moodHistory[i].mood >= 6) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Dashboard de Bienestar
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sigue tu progreso, celebra tus logros y mantén tus metas de bienestar mental
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{calculateAverageMood()}</p>
            <p className="text-sm text-muted-foreground">Promedio Semanal</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">{getCurrentStreak()}</p>
            <p className="text-sm text-muted-foreground">Días Positivos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-500">{unlockedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Logros Desbloqueados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">156</p>
            <p className="text-sm text-muted-foreground">Reacciones Dadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-effect">
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Ánimo
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Metas
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Logros
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Mood Tracking Tab */}
        <TabsContent value="mood" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Seguimiento del Estado de Ánimo
              </CardTitle>
              <CardDescription>
                Tu progreso emocional en los últimos días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodHistory.slice(0, 7).map((entry, index) => (
                  <div key={entry.date} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover-lift">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{entry.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {entry.activities && (
                        <div className="flex gap-1">
                          {entry.activities.map(activity => (
                            <Badge key={activity} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <Badge className={getMoodColor(entry.mood)}>
                          {entry.mood}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-4">
            {wellnessGoals.map(goal => (
              <Card key={goal.id} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    <Badge className={goal.current >= goal.target ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {goal.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progreso: {goal.current}/{goal.target}</span>
                      <span className="text-sm flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Racha: {goal.streak} días
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {goal.current >= goal.target && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">¡Meta completada!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Unlocked Achievements */}
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Logros Desbloqueados ({unlockedAchievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover-lift">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                      <p className="text-sm text-yellow-600">{achievement.description}</p>
                      {achievement.unlockedDate && (
                        <p className="text-xs text-yellow-500">Desbloqueado: {achievement.unlockedDate}</p>
                      )}
                    </div>
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Achievements */}
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                En Progreso ({progressAchievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressAchievements.map(achievement => (
                  <div key={achievement.id} className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl opacity-50">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800">{achievement.title}</h4>
                        <p className="text-sm text-blue-600">{achievement.description}</p>
                      </div>
                    </div>
                    
                    {achievement.progress && achievement.target && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>Progreso: {achievement.progress}/{achievement.target}</span>
                          <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Patrones de Bienestar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Tendencia Positiva</h4>
                  <p className="text-sm text-green-600">
                    Tu estado de ánimo ha mejorado un 23% en las últimas dos semanas.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Mejor Día</h4>
                  <p className="text-sm text-blue-600">
                    Los martes tienden a ser tus días más positivos.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Actividades Efectivas</h4>
                  <p className="text-sm text-purple-600">
                    La meditación y el ejercicio mejoran tu ánimo en un 40%.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Mantén tu Rutina</h4>
                  <p className="text-sm text-yellow-600">
                    Tu rutina de meditación matutina está funcionando muy bien.
                  </p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800">Nuevo Objetivo</h4>
                  <p className="text-sm text-orange-600">
                    Considera agregar ejercicio de respiración por las tardes.
                  </p>
                </div>
                
                <div className="p-3 bg-pink-50 rounded-lg">
                  <h4 className="font-semibold text-pink-800">Conexión Social</h4>
                  <p className="text-sm text-pink-600">
                    Interactuar más en la comunidad podría mejorar tu bienestar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
