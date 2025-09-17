import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { analyzeCrisisContent, createCrisisAlert, getCrisisResources } from "@/utils/crisisDetection";
import {
  Bot,
  Send,
  User,
  Heart,
  Brain,
  Lightbulb,
  Clock,
  Shield,
  Activity,
  Phone,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'suggestion' | 'normal' | 'crisis' | 'resource';
  mood?: string;
  severity?: 'low' | 'medium' | 'high' | 'crisis';
}

interface MoodEntry {
  date: string;
  mood: number; // 1-10 scale
  note?: string;
}

export default function ChatbotEnhanced() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `¡Hola ${user?.display_name ? user.display_name : 'amigo/a'}! 🌟 Soy Kapí, tu compañero de bienestar mental. Estoy aquí para escucharte, apoyarte y acompañarte en cualquier momento del día o la noche.

Me alegra mucho que hayas decidido conversar conmigo. Para comenzar, me gustaría conocerte mejor: ¿cómo te sientes en este momento en una escala del 1 al 10? Y si quieres, puedes contarme qué te trae por aquí hoy. ���`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { date: '2024-01-15', mood: 6 },
    { date: '2024-01-14', mood: 4 },
    { date: '2024-01-13', mood: 7 },
    { date: '2024-01-12', mood: 5 },
    { date: '2024-01-11', mood: 8 },
  ]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "Me siento muy ansioso y no sé cómo calmarlo", mood: "ansioso", severity: "medium" as const },
    { text: "¿Puedes enseñarme una técnica de relajación rápida?", mood: "estresado", severity: "medium" as const },
    { text: "Tengo pensamientos negativos que no se van", mood: "triste", severity: "high" as const },
    { text: "Llevo días sin poder dormir bien", mood: "inquieto", severity: "medium" as const },
    { text: "Me siento muy solo y desconectado", mood: "solo", severity: "high" as const },
    { text: "Necesito motivación para seguir adelante", mood: "desmotivado", severity: "low" as const },
    { text: "Estoy abrumado/a con tantas responsabilidades", mood: "abrumado", severity: "medium" as const },
    { text: "¿Cómo puedo manejar mejor mis emociones?", mood: "confundido", severity: "low" as const },
    { text: "Me cuesta concentrarme en mis tareas diarias", mood: "distraído", severity: "medium" as const },
    { text: "¿Podrías ayudarme con ejercicios de mindfulness?", mood: "buscando-paz", severity: "low" as const }
  ];

  const crisisKeywords = [
    'suicidio', 'matarme', 'terminar', 'no quiero vivir', 'quiero morir', 
    'acabar con todo', 'ya no puedo', 'no vale la pena', 'lastimar'
  ];

  const specializedResponses = {
    anxiety: [
      `${user?.display_name ? user.display_name : 'Mi querido/a amigo/a'}, puedo sentir la ansiedad en tus palabras y quiero que sepas que estoy aquí contigo. 🫂 La ansiedad es completamente tratable y juntos podemos encontrar técnicas que funcionen para ti. ¿Te gustaría que practiquemos un ejercicio de respiración calmante ahora mismo? Puedo guiarte paso a paso. 🌸`,
      `Entiendo que la ansiedad puede sentirse como una tormenta en tu pecho, pero recuerda: eres más resiliente de lo que imaginas. 💪 Me gustaría ayudarte a explorar qué situación específica está alimentando estos sentimientos. ¿Podrías contarme un poco más sobre lo que está pasando en tu mundo ahora mismo?`,
      `Reconocer y nombrar la ansiedad es un acto de valentía increíble. 🌟 ¿Has probado alguna vez la técnica de grounding 5-4-3-2-1? Es super efectiva para calmar la mente cuando está acelerada. Si quieres, podemos hacerla juntos ahora mismo. ¿Te animas?`
    ],
    depression: [
      `${user?.display_name ? user.display_name : 'Querido/a'}, mi corazón está contigo en este momento difícil. 💙 La depresión es real, válida y merece toda la compasión del mundo. No estás solo/a en esto. ¿Hay algo específico que haya sido el detonante de estos sentimientos últimamente? Puedes tomarte tu tiempo para responder.`,
      `Aunque ahora mismo el mundo se sienta gris, quiero recordarte que hay colores esperándote más adelante. 🌈 He acompañado a muchas personas que han encontrado su camino de vuelta a la luz. ¿Te gustaría que exploremos juntos pequeños pasos que puedes dar hoy? Incluso algo tan simple como tomar un vaso de agua puede ser un acto de amor propio.`,
      `Tus sentimientos son completamente válidos y quiero que sepas que la depresión NO es tu culpa. 🤗 Eres valioso/a exactamente como eres ahora. ¿Has pensado en la posibilidad de hablar con un profesional de la salud mental? Puedo ayudarte a encontrar opciones accesibles si te interesa.`
    ],
    stress: [
      `Puedo percibir la tensión en tus palabras y entiendo lo abrumador que puede ser el estrés. 😮‍💨 Tu mente y tu cuerpo están pidiendo un respiro. ¿Qué te parece si hacemos juntos un pequeño inventario de las principales fuentes de tu estrés? A veces ponerle nombre a las cosas las hace menos intimidantes.`,
      `El estrés puede ser como llevar una mochila demasiado pesada. 🎒 La buena noticia es que hay muchas técnicas comprobadas que pueden ayudarte a aligerar esa carga. ¿Te llama más la atención aprender sobre mindfulness, técnicas de relajación muscular, o prefieres algo más activo como ejercicios de movimiento consciente?`,
      `Reconocer cuando el estrés se vuelve demasiado es una señal de sabiduría emocional. 🧠✨ Me pregunto... ¿qué estrategias de autocuidado has probado antes? Y más importante: ¿cuáles te han funcionado mejor? Podemos construir sobre lo que ya conoces que te hace bien.`
    ]
  };

  const breathingExercises = [
    { name: "Respiración 4-7-8", inhale: 4, hold: 7, exhale: 8, description: "Calma la ansiedad" },
    { name: "Respiración Cuadrada", inhale: 4, hold: 4, exhale: 4, description: "Reduce el estrés" },
    { name: "Respiración Profunda", inhale: 6, hold: 2, exhale: 6, description: "Relajación general" }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          if (breathingPhase === 'inhale' && newCount >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newCount >= 4) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newCount >= 4) {
            setBreathingPhase('inhale');
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const detectCrisis = (message: string): boolean => {
    return crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const detectMoodAndSeverity = (message: string): { mood: string; severity: 'low' | 'medium' | 'high' | 'crisis' } => {
    const anxietyWords = ['ansioso', 'ansiedad', 'nervioso', 'preocupado'];
    const depressionWords = ['triste', 'deprimido', 'vacío', 'sin esperanza'];
    const stressWords = ['estresado', 'abrumado', 'tensión', 'presión'];
    
    if (detectCrisis(message)) {
      return { mood: 'crisis', severity: 'crisis' };
    }
    
    if (anxietyWords.some(word => message.toLowerCase().includes(word))) {
      return { mood: 'anxiety', severity: 'medium' };
    }
    
    if (depressionWords.some(word => message.toLowerCase().includes(word))) {
      return { mood: 'depression', severity: 'high' };
    }
    
    if (stressWords.some(word => message.toLowerCase().includes(word))) {
      return { mood: 'stress', severity: 'medium' };
    }
    
    return { mood: 'general', severity: 'low' };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Advanced crisis detection
    const crisisAnalysis = analyzeCrisisContent(currentMessage);

    // Create crisis alert if needed
    if (crisisAnalysis.requiresAlert && user) {
      await createCrisisAlert(
        user.id,
        user.display_name || user.username || 'Usuario Anónimo',
        currentMessage,
        crisisAnalysis
      );
    }

    // Legacy analysis for mood detection
    const analysis = detectMoodAndSeverity(currentMessage);
    
    setTimeout(() => {
      let botResponse = '';
      let messageType: 'normal' | 'crisis' | 'resource' = 'normal';
      
      if (crisisAnalysis.severity === 'critical' || crisisAnalysis.severity === 'high') {
        const resources = getCrisisResources();
        botResponse = `Entiendo que estás pasando por un momento muy difícil y valoro mucho tu confianza al compartir esto conmigo. Tu vida tiene valor y hay personas especializadas que pueden ayudarte inmediatamente.\n\n🚨 **RECURSOS DE EMERGENCIA:**\n📞 ${resources.emergency[0].name}: ${resources.emergency[0].phone}\n📞 ${resources.emergency[1].name}: ${resources.emergency[1].phone}\n\nHe notificado a nuestro equipo de crisis para que puedan ofrecerte apoyo adicional. ¿Te gustaría que te ayude a conectarte con estos recursos ahora mismo?`;
        messageType = 'crisis';
      } else if (analysis.mood in specializedResponses) {
        const responses = specializedResponses[analysis.mood as keyof typeof specializedResponses];
        botResponse = responses[Math.floor(Math.random() * responses.length)];
        messageType = 'resource';
      } else {
        // Enhanced empathetic responses
        const defaultResponses = [
          `Gracias por confiar en mí y compartir esto. 🤗 Tu valentía al expresar lo que sientes no pasa desapercibida. ¿Te gustaría contarme un poco más sobre las emociones que están surgiendo? Estoy aquí para escucharte con toda mi atención.`,
          `Puedo sentir la importancia de lo que me estás compartiendo. 💫 Es hermoso cuando alguien puede expresar sus sentimientos auténticos. ¿Hay algo específico en tu corazón o mente que te esté inquietando en este momento?`,
          `${user?.display_name ? user.display_name : 'Mi querido/a amigo/a'}, realmente aprecio que hayas elegido abrirte conmigo. 🌱 Tu confianza significa mucho. ¿Te llamaría la atención explorar juntos algunas estrategias personalizadas que podrían resonar contigo?`,
          `Lo que sientes es completamente válido y natural. 🌙 Los altibajos emocionales son parte de la experiencia humana. ¿Qué intuyes que podría traerte un poquito de alivio o bienestar en este momento? A veces la respuesta ya está dentro de nosotros.`,
          `Estoy notando la honestidad en tus palabras y me conmueve. 💙 Cada persona tiene su propio ritmo de sanación. ¿Hay algún momento del día en que te sientes más en paz contigo mismo/a? Me gustaría conocer más sobre esos espacios de calma que tienes.`
        ];
        botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: messageType,
        mood: analysis.mood,
        severity: analysis.severity
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: { text: string; mood: string; severity: 'low' | 'medium' | 'high' }) => {
    setInputMessage(suggestion.text);
  };

  const updateMood = (mood: number) => {
    setCurrentMood(mood);
    const today = new Date().toISOString().split('T')[0];
    setMoodHistory(prev => [
      { date: today, mood },
      ...prev.filter(entry => entry.date !== today)
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="h-4 w-4 text-red-500" />;
    if (mood <= 6) return <Meh className="h-4 w-4 text-yellow-500" />;
    return <Smile className="h-4 w-4 text-green-500" />;
  };

  const startBreathingExercise = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const stopBreathingExercise = () => {
    setIsBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Enhanced Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center glass-effect">
            <Bot className="h-8 w-8 text-primary animate-pulse-soft" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2 animate-slide-up">
          Asistente de Bienestar Mental Avanzado
        </h1>
        <p className="text-muted-foreground animate-slide-up">
          IA especializada en salud mental con detección de crisis y recursos personalizados
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Confidencial</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>24/7 Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Detección de Crisis</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
            <CardHeader className="border-b border-warm-200/50">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Chat de Apoyo Avanzado
                <Badge className="ml-auto bg-green-100 text-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  En línea
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Chat Messages */}
              <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-white ml-12'
                            : message.type === 'crisis' 
                            ? 'bg-red-100 border border-red-300 text-red-800 mr-12'
                            : message.type === 'resource'
                            ? 'bg-blue-100 border border-blue-300 text-blue-800 mr-12'
                            : 'bg-gray-100 text-foreground mr-12'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'bot' && (
                            <Bot className={`h-4 w-4 mt-1 ${
                              message.type === 'crisis' ? 'text-red-600' : 
                              message.type === 'resource' ? 'text-blue-600' : 'text-primary'
                            }`} />
                          )}
                          {message.sender === 'user' && (
                            <User className="h-4 w-4 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.type === 'crisis' && (
                      <div className="mt-2 p-3 bg-red-50 rounded border border-red-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
                          <AlertTriangle className="h-4 w-4" />
                          <span>RECURSOS DE EMERGENCIA</span>
                        </div>
                        <div className="space-y-1 text-xs text-red-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>Línea Nacional: 113</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>Emergencias: 911</span>
                          </div>
                        </div>
                      </div>
                    )}
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-scale-in">
                      <div className="bg-gray-100 text-foreground px-4 py-2 rounded-lg mr-12">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Suggestions */}
              <div className="p-4 border-t border-warm-200/50 bg-gray-50/50">
                <p className="text-sm text-muted-foreground mb-2">Sugerencias especializadas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`text-xs hover:bg-primary/5 hover:border-primary/20 hover-lift ${
                        suggestion.severity === 'high' ? 'border-red-200 text-red-700' :
                        suggestion.severity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-green-200 text-green-700'
                      }`}
                    >
                      {suggestion.severity === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-warm-200/50">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Comparte lo que sientes... Estoy aquí para escucharte"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary hover:bg-primary/90 hover-lift"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Tools */}
        <div className="space-y-6">
          {/* Mood Tracker */}
          <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" />
                Seguimiento del Ánimo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">¿Cómo te sientes hoy?</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getMoodIcon(currentMood)}
                  <span className="text-lg font-semibold">{currentMood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => updateMood(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Historial (últimos 5 días):</p>
                {moodHistory.slice(0, 5).map((entry, index) => (
                  <div key={entry.date} className="flex items-center justify-between text-xs">
                    <span>{entry.date}</span>
                    <div className="flex items-center gap-1">
                      {getMoodIcon(entry.mood)}
                      <span>{entry.mood}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Breathing Exercise */}
          <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5" />
                Ejercicio de Respiración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isBreathingActive ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Practica respiración consciente para reducir la ansiedad y el estrés.
                  </p>
                  <Button 
                    onClick={startBreathingExercise}
                    className="w-full bg-blue-500 hover:bg-blue-600 hover-lift"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Comenzar Respiración 4-4-4
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full border-4 transition-all duration-1000 ${
                    breathingPhase === 'inhale' ? 'border-blue-500 scale-110' :
                    breathingPhase === 'hold' ? 'border-yellow-500 scale-100' :
                    'border-green-500 scale-90'
                  }`} />
                  
                  <div>
                    <p className="text-lg font-semibold capitalize">{breathingPhase}</p>
                    <p className="text-sm text-muted-foreground">
                      {breathingPhase === 'inhale' ? 'Inhala profundamente' :
                       breathingPhase === 'hold' ? 'Mantén la respiración' :
                       'Exhala lentamente'}
                    </p>
                    <p className="text-xs text-muted-foreground">{breathingCount + 1}/4</p>
                  </div>
                  
                  <Button 
                    onClick={stopBreathingExercise}
                    variant="outline"
                    className="hover-lift"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="bg-red-50 border-red-200 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                <Phone className="h-5 w-5" />
                Recursos de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="font-semibold text-red-700">Crisis de Salud Mental:</p>
                <p className="text-red-600">📞 Línea Nacional: 113</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-red-700">Emergencias Generales:</p>
                <p className="text-red-600">📞 Servicios de Emergencia: 911</p>
              </div>
              <p className="text-xs text-red-600">
                Si sientes que estás en peligro inmediato, no dudes en contactar estos servicios.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
