import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  Shield,
  Users,
  Bot,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Crown,
  Sparkles,
  Target,
  Clock,
  X,
  Play,
  MessageSquare,
  BarChart3,
  Settings,
  BookOpen
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  targetSelector?: string;
  action?: () => void;
}

interface OnboardingTourProps {
  onComplete?: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    shareAnonymously: true,
    receiveReminders: true,
    enableCrisisAlerts: false,
    joinCommunity: true,
    darkMode: false
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a TIOSKAP!',
      description: 'Tu espacio seguro para sanar y crecer',
      icon: Crown,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Crown className="h-12 w-12 text-primary fill-primary/20" />
          </div>
          <h3 className="text-xl font-bold">¡Hola, {user?.display_name}!</h3>
          <p className="text-muted-foreground">
            Estamos emocionados de tenerte aquí. TIOSKAP es más que una plataforma, 
            es tu compañero en el viaje hacia el bienestar mental.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">100% Confidencial</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Siempre Seguro</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Personaliza tu experiencia',
      description: 'Configuremos TIOSKAP según tus necesidades',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Configura tus preferencias:</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={preferences.shareAnonymously}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, shareAnonymously: checked as boolean }))
                }
              />
              <label htmlFor="anonymous" className="text-sm">
                Compartir historias de forma anónima por defecto
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminders"
                checked={preferences.receiveReminders}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, receiveReminders: checked as boolean }))
                }
              />
              <label htmlFor="reminders" className="text-sm">
                Recibir recordatorios de bienestar
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crisis"
                checked={preferences.enableCrisisAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, enableCrisisAlerts: checked as boolean }))
                }
              />
              <label htmlFor="crisis" className="text-sm">
                Activar alertas de crisis (solo para moderadores)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="community"
                checked={preferences.joinCommunity}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, joinCommunity: checked as boolean }))
                }
              />
              <label htmlFor="community" className="text-sm">
                Unirme a grupos de apoyo automáticamente
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Descubre las funcionalidades',
      description: 'Conoce todo lo que puedes hacer en TIOSKAP',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Principales funcionalidades:</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-medium">Desahogos</p>
                <p className="text-sm text-muted-foreground">Comparte tus experiencias de forma anónima</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Bot className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Kapí IA</p>
                <p className="text-sm text-muted-foreground">Tu asistente de bienestar mental 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">Comunidad</p>
                <p className="text-sm text-muted-foreground">Conecta con personas que te entienden</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-500" />
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">Rastrea tu progreso emocional</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'navigation',
      title: 'Navegación principal',
      description: 'Aprende a moverte por la plataforma',
      icon: Target,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Menú principal:</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Desahogos</p>
              <p className="text-xs text-muted-foreground">Historias de la comunidad</p>
            </div>
            
            <div className="p-3 border rounded-lg text-center">
              <Bot className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Kapí</p>
              <p className="text-xs text-muted-foreground">Asistente IA</p>
            </div>
            
            <div className="p-3 border rounded-lg text-center">
              <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Recursos</p>
              <p className="text-xs text-muted-foreground">Herramientas de bienestar</p>
            </div>
            
            <div className="p-3 border rounded-lg text-center">
              <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Dashboard</p>
              <p className="text-xs text-muted-foreground">Tu progreso personal</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Usa el menú en la parte superior para navegar rápidamente 
              entre secciones. En móvil, encontrarás las opciones principales en la parte inferior.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'safety',
      title: 'Tu seguridad es prioritaria',
      description: 'Conoce nuestras medidas de protección',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Medidas de seguridad:</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Anonimato garantizado</p>
                <p className="text-sm text-muted-foreground">
                  Tus historias son completamente anónimas. Nadie puede identificarte.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Datos encriptados</p>
                <p className="text-sm text-muted-foreground">
                  Toda tu información está protegida con encriptación de nivel militar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Detección de crisis</p>
                <p className="text-sm text-muted-foreground">
                  Nuestro sistema detecta situaciones de riesgo y ofrece ayuda inmediata.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>🚨 En caso de emergencia:</strong> Si sientes que puedes lastimarte, 
              contacta inmediatamente a emergencias (911) o usa nuestro botón de crisis con Kapí.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'first-steps',
      title: '¡Primeros pasos!',
      description: 'Sugerencias para empezar tu viaje',
      icon: Play,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Te recomendamos empezar con:</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/chatbot';
              }}
            >
              <Bot className="h-6 w-6 mr-3 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Habla con nuestro chatbot</p>
                <p className="text-sm text-muted-foreground">Una forma segura de comenzar</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/desahogos';
              }}
            >
              <MessageSquare className="h-6 w-6 mr-3 text-purple-500" />
              <div className="text-left">
                <p className="font-medium">Lee historias de otros</p>
                <p className="text-sm text-muted-foreground">Encuentra inspiración y conexión</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/recursos';
              }}
            >
              <BookOpen className="h-6 w-6 mr-3 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Explora recursos</p>
                <p className="text-sm text-muted-foreground">Herramientas para tu bienestar</p>
              </div>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-therapeutic-100/30 rounded-lg">
            <p className="text-sm text-center">
              🌟 <strong>Recuerda:</strong> Tu bienestar es un viaje, no un destino. 
              Estamos aquí para acompañarte en cada paso.
            </p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (user && !user.preferences?.onboardingCompleted) {
      setIsOpen(true);
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsOpen(false);
    
    // Update user preferences
    if (user) {
      await updateUser({
        preferences: {
          ...user.preferences,
          onboardingCompleted: true,
          ...preferences
        }
      });
    }

    // Add welcome notification
    addNotification({
      type: 'success',
      title: '¡Bienvenido a la comunidad!',
      message: 'Has completado la configuración inicial. ¡Estás listo para comenzar tu viaje de bienestar!',
      priority: 'medium',
      category: 'achievement',
      autoDelete: 10
    });

    onComplete?.();
  };

  const handleSkip = () => {
    setIsOpen(false);
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          onboardingCompleted: true
        }
      });
    }
    onComplete?.();
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <currentStepData.icon className="h-5 w-5 text-primary" />
              {currentStepData.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px] py-4">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Saltar tour
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick Tour Component for existing users
export function QuickTour() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            Tour rápido
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Conoce las funcionalidades principales</p>
        </TooltipContent>
      </Tooltip>
      
      {isOpen && (
        <OnboardingTour onComplete={() => setIsOpen(false)} />
      )}
    </TooltipProvider>
  );
}
