import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { 
  Heart, 
  Shield, 
  Users, 
  Bot,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserWelcome() {
  const { user } = useAuth();

  if (!user) return null;

  const quickActions = [
    {
      title: "Comparte tu primera historia",
      description: "Únete a nuestra comunidad compartiendo de forma anónima",
      icon: Heart,
      link: "/desahogos",
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Habla con Kapí",
      description: "Tu asistente IA disponible 24/7 para apoyo emocional",
      icon: Bot,
      link: "/chatbot",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Explora recursos",
      description: "Encuentra herramientas y ejercicios de bienestar",
      icon: Sparkles,
      link: "/recursos",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Anónimo",
      description: "Tu privacidad está protegida"
    },
    {
      icon: Users,
      title: "Comunidad Supportive",
      description: "Miles de personas que te entienden"
    },
    {
      icon: CheckCircle,
      title: "Sin Juicios",
      description: "Espacio seguro para expresarte"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary/5 via-therapeutic-100/30 to-comfort-100/20 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary fill-primary/20" />
                <h2 className="text-2xl font-bold text-foreground">
                  ¡Bienvenido a TIOSKAP, {user.display_name}!
                </h2>
              </div>
              <p className="text-muted-foreground">
                Tu espacio seguro para sanar y crecer. Aquí estás protegido y nunca solo.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Cuenta Verificada
                </Badge>
                {user.is_anonymous && (
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Modo Anónimo
                  </Badge>
                )}
                <Badge variant="outline" className="border-amber-200 text-amber-700">
                  <Crown className="h-3 w-3 mr-1" />
                  {user.subscription_type === 'free' ? 'Plan Gratuito' : `Plan ${user.subscription_type}`}
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" 
                   style={{ backgroundColor: user.avatar_color }}>
                {user.display_name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Primeros pasos recomendados</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover-lift transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} border`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{action.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                    <Link to={action.link}>
                      <Button variant="outline" size="sm" className="w-full group">
                        Comenzar
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Overview */}
      <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">¿Por qué elegiste bien?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
