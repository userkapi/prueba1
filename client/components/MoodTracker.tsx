import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
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
  Heart,
  Smile,
  Meh,
  Frown,
  Angry,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  BarChart3,
  PlusCircle,
  Target,
  Award,
  Clock,
  Activity,
  Brain,
  Sun,
  Moon,
  Coffee,
  Droplets
} from "lucide-react";

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodLevel;
  energy: number; // 1-10
  anxiety: number; // 1-10
  sleep: number; // 1-10
  activities: string[];
  notes: string;
  triggers?: string[];
  gratitude?: string[];
}

interface MoodTrackerProps {
  compact?: boolean;
}

const MOOD_OPTIONS = [
  { value: 1, label: "Muy mal", icon: Angry, color: "text-red-500", bg: "bg-red-50" },
  { value: 2, label: "Mal", icon: Frown, color: "text-orange-500", bg: "bg-orange-50" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-50" },
  { value: 4, label: "Bien", icon: Smile, color: "text-green-500", bg: "bg-green-50" },
  { value: 5, label: "Excelente", icon: Heart, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const ACTIVITY_OPTIONS = [
  { value: "exercise", label: "Ejercicio", icon: Activity },
  { value: "meditation", label: "Meditación", icon: Brain },
  { value: "socializing", label: "Socializar", icon: Heart },
  { value: "work", label: "Trabajo", icon: Target },
  { value: "reading", label: "Lectura", icon: Coffee },
  { value: "outdoors", label: "Aire libre", icon: Sun },
  { value: "therapy", label: "Terapia", icon: Heart },
  { value: "creative", label: "Creatividad", icon: Activity },
];

export default function MoodTracker({ compact = false }: MoodTrackerProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    mood: 3,
    energy: 5,
    anxiety: 5,
    sleep: 5,
    activities: [],
    notes: "",
    triggers: [],
    gratitude: []
  });

  // Load mood entries from localStorage
  useEffect(() => {
    if (user) {
      const savedEntries = localStorage.getItem(`tioskap_mood_${user.id}`);
      if (savedEntries) {
        const parsed = JSON.parse(savedEntries);
        setMoodEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      }
    }
  }, [user]);

  // Save mood entries to localStorage
  useEffect(() => {
    if (user && moodEntries.length > 0) {
      localStorage.setItem(`tioskap_mood_${user.id}`, JSON.stringify(moodEntries));
    }
  }, [moodEntries, user]);

  const addMoodEntry = () => {
    if (!user) return;

    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: selectedDate,
      mood: currentEntry.mood as MoodLevel,
      energy: currentEntry.energy || 5,
      anxiety: currentEntry.anxiety || 5,
      sleep: currentEntry.sleep || 5,
      activities: currentEntry.activities || [],
      notes: currentEntry.notes || "",
      triggers: currentEntry.triggers || [],
      gratitude: currentEntry.gratitude || []
    };

    setMoodEntries(prev => {
      const filtered = prev.filter(entry => 
        format(entry.date, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')
      );
      return [newEntry, ...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    setIsAddingEntry(false);
    setCurrentEntry({
      mood: 3,
      energy: 5,
      anxiety: 5,
      sleep: 5,
      activities: [],
      notes: "",
      triggers: [],
      gratitude: []
    });

    addNotification({
      type: 'success',
      title: 'Estado de ánimo registrado',
      message: `Has registrado tu estado de ánimo para ${format(selectedDate, 'dd MMM', { locale: es })}`,
      priority: 'low',
      category: 'achievement',
      autoDelete: 5
    });

    // Check for streak achievement
    checkStreakAchievement();
  };

  const checkStreakAchievement = () => {
    const recentEntries = moodEntries
      .filter(entry => entry.date >= subDays(new Date(), 7))
      .length;

    if (recentEntries >= 7) {
      addNotification({
        type: 'success',
        title: '🎉 ¡Racha de 7 días!',
        message: 'Has registrado tu estado de ánimo 7 días seguidos. ¡Increíble disciplina!',
        priority: 'medium',
        category: 'achievement',
        autoDelete: 10
      });
    }
  };

  const getWeeklyAverage = () => {
    const weekStart = startOfWeek(new Date(), { locale: es });
    const weekEnd = endOfWeek(new Date(), { locale: es });
    
    const weekEntries = moodEntries.filter(entry => 
      entry.date >= weekStart && entry.date <= weekEnd
    );

    if (weekEntries.length === 0) return null;

    const avgMood = weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
    const avgEnergy = weekEntries.reduce((sum, entry) => sum + entry.energy, 0) / weekEntries.length;
    
    return { mood: avgMood, energy: avgEnergy, count: weekEntries.length };
  };

  const getTrendIcon = () => {
    const recent = moodEntries.slice(0, 7);
    if (recent.length < 2) return Meh;

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderEntries = moodEntries.slice(7, 14);
    
    if (olderEntries.length === 0) return Meh;
    
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.mood, 0) / olderEntries.length;

    return recentAvg > olderAvg ? TrendingUp : TrendingDown;
  };

  const todayEntry = moodEntries.find(entry => 
    format(entry.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const weeklyStats = getWeeklyAverage();
  const TrendIcon = getTrendIcon();

  if (compact) {
    return (
      <Card className="hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Estado de Ánimo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayEntry ? (
              <div className="flex items-center gap-3">
                {(() => {
                  const moodOption = MOOD_OPTIONS.find(opt => opt.value === todayEntry.mood);
                  const Icon = moodOption?.icon || Meh;
                  return (
                    <>
                      <div className={`p-2 rounded-full ${moodOption?.bg}`}>
                        <Icon className={`h-5 w-5 ${moodOption?.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">Hoy: {moodOption?.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Energía: {todayEntry.energy}/10
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Registrar hoy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>¿Cómo te sientes hoy?</DialogTitle>
                    <DialogDescription>
                      Registra tu estado de ánimo y energía de hoy
                    </DialogDescription>
                  </DialogHeader>
                  <MoodEntryForm 
                    entry={currentEntry}
                    onChange={setCurrentEntry}
                    onSave={addMoodEntry}
                    onCancel={() => setIsAddingEntry(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            {weeklyStats && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Esta semana</span>
                  <div className="flex items-center gap-1">
                    <TrendIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {weeklyStats.mood.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Seguimiento de Estado de Ánimo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Today's Entry */}
            <div className="space-y-3">
              <h3 className="font-semibold">Hoy</h3>
              {todayEntry ? (
                <div className="space-y-2">
                  {(() => {
                    const moodOption = MOOD_OPTIONS.find(opt => opt.value === todayEntry.mood);
                    const Icon = moodOption?.icon || Meh;
                    return (
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${moodOption?.bg}`}>
                          <Icon className={`h-6 w-6 ${moodOption?.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{moodOption?.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Energía: {todayEntry.energy}/10
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  {todayEntry.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {todayEntry.activities.map(activity => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          {ACTIVITY_OPTIONS.find(a => a.value === activity)?.label || activity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Registrar estado de ánimo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Registrar Estado de Ánimo</DialogTitle>
                      <DialogDescription>
                        Tómate un momento para reflexionar sobre cómo te sientes hoy
                      </DialogDescription>
                    </DialogHeader>
                    <MoodEntryForm 
                      entry={currentEntry}
                      onChange={setCurrentEntry}
                      onSave={addMoodEntry}
                      onCancel={() => setIsAddingEntry(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Weekly Stats */}
            {weeklyStats && (
              <div className="space-y-3">
                <h3 className="font-semibold">Esta Semana</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado promedio</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{weeklyStats.mood.toFixed(1)}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Energía promedio</span>
                    <span className="font-medium">{weeklyStats.energy.toFixed(1)}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Días registrados</span>
                    <span className="font-medium">{weeklyStats.count}/7</span>
                  </div>
                  <Progress 
                    value={(weeklyStats.count / 7) * 100} 
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            )}

            {/* Streak */}
            <div className="space-y-3">
              <h3 className="font-semibold">Progreso</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Racha actual</span>
                  <Badge variant="secondary">
                    {moodEntries.length > 0 ? `${Math.min(moodEntries.length, 7)} días` : '0 días'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Entradas totales</span>
                  <Badge variant="secondary">{moodEntries.length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Historial Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodEntries.slice(0, 7).map(entry => {
                const moodOption = MOOD_OPTIONS.find(opt => opt.value === entry.mood);
                const Icon = moodOption?.icon || Meh;
                
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className={`p-2 rounded-full ${moodOption?.bg}`}>
                      <Icon className={`h-4 w-4 ${moodOption?.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {format(entry.date, 'dd MMM', { locale: es })}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {moodOption?.label}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mood Entry Form Component
interface MoodEntryFormProps {
  entry: Partial<MoodEntry>;
  onChange: (entry: Partial<MoodEntry>) => void;
  onSave: () => void;
  onCancel: () => void;
}

function MoodEntryForm({ entry, onChange, onSave, onCancel }: MoodEntryFormProps) {
  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">¿Cómo te sientes?</h3>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map(option => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={entry.mood === option.value ? "default" : "outline"}
                className={`flex flex-col gap-2 h-auto p-3 ${
                  entry.mood === option.value ? "bg-primary text-white" : ""
                }`}
                onClick={() => onChange({ ...entry, mood: option.value as MoodLevel })}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Energy, Anxiety, Sleep */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Energía: {entry.energy}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={entry.energy || 5}
            onChange={(e) => onChange({ ...entry, energy: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Ansiedad: {entry.anxiety}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={entry.anxiety || 5}
            onChange={(e) => onChange({ ...entry, anxiety: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Sueño: {entry.sleep}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={entry.sleep || 5}
            onChange={(e) => onChange({ ...entry, sleep: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-3">
        <h3 className="font-medium">¿Qué actividades hiciste?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ACTIVITY_OPTIONS.map(activity => {
            const Icon = activity.icon;
            const isSelected = entry.activities?.includes(activity.value);
            
            return (
              <Button
                key={activity.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2 justify-start h-auto p-2"
                onClick={() => {
                  const current = entry.activities || [];
                  const updated = isSelected
                    ? current.filter(a => a !== activity.value)
                    : [...current, activity.value];
                  onChange({ ...entry, activities: updated });
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{activity.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notas (opcional)</label>
        <Textarea
          placeholder="¿Qué te hizo sentir así? ¿Algo especial que quieras recordar?"
          value={entry.notes || ""}
          onChange={(e) => onChange({ ...entry, notes: e.target.value })}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSave}>
          <Heart className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      </div>
    </div>
  );
}
