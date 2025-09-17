import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Clock,
  Heart,
  Brain,
  Leaf,
  Moon,
  Sun,
  BookOpen,
  Save,
  Calendar,
  Target,
  Waves,
  Wind,
  Mountain,
  Sparkles
} from "lucide-react";

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'breathing' | 'mindfulness' | 'sleep' | 'anxiety' | 'stress';
  audioUrl?: string;
  script: string[];
}

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  benefits: string[];
}

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  title: string;
  content: string;
  gratitude?: string[];
  goals?: string[];
}

export default function SelfHelpResources() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingExercise | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);

  const [journalEntry, setJournalEntry] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [currentMood, setCurrentMood] = useState(5);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [goals, setGoals] = useState<string[]>(['', '', '']);
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 8,
      title: 'Un día de reflexión',
      content: 'Hoy me tomé un tiempo para meditar y realmente sentí una diferencia en mi estado de ánimo. La práctica de mindfulness me está ayudando mucho.',
      gratitude: ['Mi familia', 'Un nuevo día', 'Mi salud'],
      goals: ['Meditar 20 minutos', 'Caminar en la naturaleza', 'Escribir en mi diario']
    }
  ]);

  const meditations: Meditation[] = [
    {
      id: '1',
      title: 'Respiración Consciente',
      description: 'Una práctica básica de mindfulness centrada en la respiración',
      duration: 10,
      category: 'breathing',
      script: [
        'Encuentra una posición cómoda y cierra los ojos suavemente.',
        'Lleva tu atención a tu respiración natural.',
        'No trates de cambiar nada, solo observa.',
        'Siente el aire entrando por tu nariz.',
        'Nota la pausa natural entre inhalar y exhalar.',
        'Cuando tu mente divague, vuelve gentilmente a la respiración.',
        'Continúa observando tu respiración con curiosidad y amabilidad.'
      ]
    },
    {
      id: '2',
      title: 'Escaneo Corporal',
      description: 'Relajación profunda a través de la conciencia corporal',
      duration: 15,
      category: 'mindfulness',
      script: [
        'Acuéstate cómodamente y cierra los ojos.',
        'Comienza enfocándote en los dedos de tus pies.',
        'Nota cualquier sensación sin juzgar.',
        'Mueve lentamente tu atención hacia tus tobillos.',
        'Continúa subiendo por tus piernas, pelvis, abdomen.',
        'Observa tus brazos, hombros, cuello y cabeza.',
        'Siente todo tu cuerpo como una unidad completa.'
      ]
    },
    {
      id: '3',
      title: 'Meditación para el Sueño',
      description: 'Relajación profunda para preparar el descanso',
      duration: 20,
      category: 'sleep',
      script: [
        'Prepárate para el descanso en tu cama.',
        'Toma tres respiraciones profundas y lentas.',
        'Imagina una luz cálida y dorada rodeándote.',
        'Siente cómo se relajan tus músculos uno por uno.',
        'Permite que los pensamientos del día se desvanezcan.',
        'Visualiza un lugar seguro y tranquilo.',
        'Entrégate al descanso profundo y reparador.'
      ]
    }
  ];

  const breathingExercises: BreathingExercise[] = [
    {
      id: '1',
      name: 'Respiración 4-7-8',
      description: 'Técnica calmante desarrollada por el Dr. Andrew Weil',
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 4,
      benefits: ['Reduce ansiedad', 'Mejora el sueño', 'Calma la mente']
    },
    {
      id: '2',
      name: 'Respiración Cuadrada',
      description: 'También conocida como respiración de caja',
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 6,
      benefits: ['Reduce estrés', 'Mejora concentración', 'Equilibra el sistema nervioso']
    },
    {
      id: '3',
      name: 'Respiración Triangular',
      description: 'Técnica energizante para la mañana',
      inhale: 6,
      hold: 2,
      exhale: 6,
      cycles: 5,
      benefits: ['Aumenta energía', 'Mejora el estado de ánimo', 'Aumenta la concentración']
    }
  ];

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (breathingActive && selectedBreathing) {
      intervalRef.current = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          const currentEx = selectedBreathing;
          
          if (breathingPhase === 'inhale' && newCount >= currentEx.inhale) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newCount >= currentEx.hold) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newCount >= currentEx.exhale) {
            setCurrentCycle(prev => {
              const newCycle = prev + 1;
              if (newCycle >= currentEx.cycles) {
                setBreathingActive(false);
                return 0;
              }
              setBreathingPhase('inhale');
              return newCycle;
            });
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [breathingActive, breathingPhase, selectedBreathing]);

  const startMeditation = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const startBreathing = (exercise: BreathingExercise) => {
    setSelectedBreathing(exercise);
    setBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
    setCurrentCycle(0);
  };

  const saveJournalEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      title: journalTitle || 'Entrada del diario',
      content: journalEntry,
      gratitude: gratitudeItems.filter(item => item.trim()),
      goals: goals.filter(goal => goal.trim())
    };
    
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalEntry('');
    setJournalTitle('');
    setCurrentMood(5);
    setGratitudeItems(['', '', '']);
    setGoals(['', '', '']);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breathing': return <Wind className="h-4 w-4" />;
      case 'mindfulness': return <Brain className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'anxiety': return <Heart className="h-4 w-4" />;
      case 'stress': return <Leaf className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'bg-blue-100 text-blue-800';
      case 'mindfulness': return 'bg-purple-100 text-purple-800';
      case 'sleep': return 'bg-indigo-100 text-indigo-800';
      case 'anxiety': return 'bg-red-100 text-red-800';
      case 'stress': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Recursos de Autoayuda
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Herramientas prácticas para tu bienestar mental: meditaciones guiadas, ejercicios de respiración y espacio para reflexión personal
        </p>
      </div>

      <Tabs defaultValue="meditations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="meditations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Meditaciones
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Respiración
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Diario
          </TabsTrigger>
        </TabsList>

        {/* Meditations Tab */}
        <TabsContent value="meditations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Meditation List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Meditaciones Disponibles</h3>
              {meditations.map(meditation => (
                <Card key={meditation.id} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{meditation.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{meditation.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(meditation.category)}>
                            {getCategoryIcon(meditation.category)}
                            <span className="ml-1 capitalize">{meditation.category}</span>
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {meditation.duration} min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startMeditation(meditation)}
                      className="w-full bg-primary hover:bg-primary/90 hover-lift"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Meditación
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meditation Player */}
            <div className="space-y-4">
              {selectedMeditation ? (
                <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {selectedMeditation.title}
                    </CardTitle>
                    <CardDescription>{selectedMeditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Visualization */}
                    <div className="flex justify-center">
                      <div className={`w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-2000 ${
                        isPlaying ? 'scale-110 shadow-lg animate-pulse-soft' : 'scale-100'
                      }`}>
                        <div className={`w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-1000 ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}>
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentTime(0)}
                        className="hover-lift"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-primary hover:bg-primary/90 hover-lift"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover-lift"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Script */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <h4 className="font-semibold text-foreground">Guía de la meditación:</h4>
                      {selectedMeditation.script.map((instruction, index) => (
                        <p key={index} className="leading-relaxed">• {instruction}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 text-center">
                  <CardContent className="p-8">
                    <Mountain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecciona una meditación para comenzar tu práctica
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Breathing Exercises Tab */}
        <TabsContent value="breathing" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Exercise List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ejercicios de Respiración</h3>
              {breathingExercises.map(exercise => (
                <Card key={exercise.id} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Patrón:</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Inhalar {exercise.inhale}s</span>
                        <span>•</span>
                        <span>Mantener {exercise.hold}s</span>
                        <span>•</span>
                        <span>Exhalar {exercise.exhale}s</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exercise.cycles} ciclos completos
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Beneficios:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startBreathing(exercise)}
                      disabled={breathingActive}
                      className="w-full bg-blue-500 hover:bg-blue-600 hover-lift"
                    >
                      <Wind className="h-4 w-4 mr-2" />
                      Comenzar Ejercicio
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Breathing Guide */}
            <div className="space-y-4">
              {selectedBreathing && breathingActive ? (
                <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wind className="h-5 w-5" />
                      {selectedBreathing.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-center">
                    {/* Visual Guide */}
                    <div className="flex justify-center">
                      <div className={`w-40 h-40 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
                        breathingPhase === 'inhale' ? 'border-blue-500 scale-110 bg-blue-50' :
                        breathingPhase === 'hold' ? 'border-yellow-500 scale-100 bg-yellow-50' :
                        'border-green-500 scale-90 bg-green-50'
                      }`}>
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${
                            breathingPhase === 'inhale' ? 'text-blue-600' :
                            breathingPhase === 'hold' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {breathingCount + 1}
                          </div>
                          <div className={`text-sm font-medium ${
                            breathingPhase === 'inhale' ? 'text-blue-600' :
                            breathingPhase === 'hold' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {breathingPhase === 'inhale' ? 'INHALA' :
                             breathingPhase === 'hold' ? 'MANTÉN' : 'EXHALA'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        {breathingPhase === 'inhale' ? 'Inhala profundamente por la nariz' :
                         breathingPhase === 'hold' ? 'Mantén la respiración' :
                         'Exhala lentamente por la boca'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ciclo {currentCycle + 1} de {selectedBreathing.cycles}
                      </p>
                    </div>

                    <Button 
                      onClick={() => setBreathingActive(false)}
                      variant="outline"
                      className="hover-lift"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 text-center">
                  <CardContent className="p-8">
                    <Waves className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecciona un ejercicio de respiración para comenzar
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* New Entry */}
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Nueva Entrada del Diario
                </CardTitle>
                <CardDescription>
                  Reflexiona sobre tu día y establece intenciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Tracker */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    ¿Cómo te sientes hoy? ({currentMood}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Muy mal</span>
                    <span>Excelente</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Título (opcional)</label>
                  <input
                    type="text"
                    placeholder="Dale un título a tu entrada..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {/* Main Content */}
                <div>
                  <label className="text-sm font-medium mb-2 block">¿Qué hay en tu mente?</label>
                  <Textarea
                    placeholder="Escribe sobre tu día, tus pensamientos, sentimientos o cualquier cosa que quieras recordar..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                {/* Gratitude */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tres cosas por las que estoy agradecido:</label>
                  {gratitudeItems.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Gratitud ${index + 1}`}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...gratitudeItems];
                        newItems[index] = e.target.value;
                        setGratitudeItems(newItems);
                      }}
                      className="w-full px-3 py-2 border rounded-md mb-2"
                    />
                  ))}
                </div>

                {/* Goals */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Intenciones para mañana:</label>
                  {goals.map((goal, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Intención ${index + 1}`}
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...goals];
                        newGoals[index] = e.target.value;
                        setGoals(newGoals);
                      }}
                      className="w-full px-3 py-2 border rounded-md mb-2"
                    />
                  ))}
                </div>

                <Button 
                  onClick={saveJournalEntry}
                  disabled={!journalEntry.trim()}
                  className="w-full bg-primary hover:bg-primary/90 hover-lift"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Entrada
                </Button>
              </CardContent>
            </Card>

            {/* Previous Entries */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Entradas Anteriores</h3>
              {journalEntries.map(entry => (
                <Card key={entry.id} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{entry.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {entry.mood}/10
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.date}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {entry.content}
                    </p>
                    
                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700 mb-1">Gratitud:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.gratitude.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.goals && entry.goals.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-purple-700 mb-1">Intenciones:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.goals.map((goal, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
