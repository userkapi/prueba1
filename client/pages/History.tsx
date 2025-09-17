import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  Calendar,
  Crown,
  Heart,
  Users,
  Globe,
  Award,
  Zap,
  Shield,
  Brain,
  Target,
  Star,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Rocket
} from "lucide-react";

interface TimelineEvent {
  year: string;
  month: string;
  title: string;
  description: string;
  impact: string;
  type: 'milestone' | 'crisis' | 'achievement' | 'expansion';
  icon: React.ComponentType<any>;
  stats?: {
    users?: string;
    interventions?: string;
    countries?: string;
    professionals?: string;
  };
}

export default function History() {
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2019",
      month: "Diciembre",
      title: "La Crisis que lo Cambió Todo",
      description: "Las estadísticas de suicidio en nuestra región alcanzaron niveles críticos: 15.3 por cada 100,000 habitantes, muy por encima del promedio mundial. La pérdida de varios jóvenes en nuestra comunidad nos motivó a actuar.",
      impact: "Reconocimiento de la necesidad urgente de una solución innovadora",
      type: "crisis",
      icon: AlertTriangle,
      stats: {
        users: "Crisis identificada",
        interventions: "0 recursos disponibles",
        countries: "Problema local",
        professionals: "Acceso limitado"
      }
    },
    {
      year: "2020",
      month: "Marzo",
      title: "Nacimiento de TIOSKAP",
      description: "Durante la pandemia, cuando el aislamiento agravó los problemas de salud mental, la Dra. Ana María Rodríguez fundó TIOSKAP. La idea: un espacio seguro y anónimo donde las personas pudieran compartir sus luchas sin miedo al juicio.",
      impact: "Primera plataforma de apoyo psicológico anónimo en línea",
      type: "milestone",
      icon: Crown,
      stats: {
        users: "100 usuarios beta",
        interventions: "Primera crisis intervenida",
        countries: "1 país",
        professionals: "3 voluntarios"
      }
    },
    {
      year: "2020",
      month: "Agosto",
      title: "Primeras Vidas Salvadas",
      description: "Logramos nuestra primera intervención exitosa de crisis suicida. Un usuario compartió sus pensamientos de autolesión, la comunidad respondió con apoyo, y nuestro equipo de crisis actuó inmediatamente. Esta persona hoy es un miembro activo de nuestra comunidad.",
      impact: "Validación del modelo de apoyo comunitario + intervención profesional",
      type: "achievement",
      icon: Heart,
      stats: {
        users: "500 usuarios",
        interventions: "12 crisis intervenidas",
        countries: "1 país",
        professionals: "8 voluntarios"
      }
    },
    {
      year: "2021",
      month: "Enero",
      title: "Sistema de Detección IA",
      description: "Implementamos inteligencia artificial para detectar automáticamente mensajes con riesgo suicida. Esto nos permitió identificar y responder a crisis que podrían haber pasado desapercibidas, reduciendo el tiempo de respuesta de horas a minutos.",
      impact: "Prevención proactiva de suicidios con tecnología",
      type: "milestone",
      icon: Brain,
      stats: {
        users: "2,500 usuarios",
        interventions: "89 crisis intervenidas",
        countries: "3 países",
        professionals: "25 profesionales"
      }
    },
    {
      year: "2021",
      month: "Junio",
      title: "Expansión Internacional",
      description: "TIOSKAP cruzó fronteras. Usuarios de México, Colombia y España comenzaron a usar nuestra plataforma. Implementamos soporte multiidioma y adaptamos nuestros recursos a diferentes culturas y sistemas de salud.",
      impact: "Red de apoyo sin fronteras geográficas",
      type: "expansion",
      icon: Globe,
      stats: {
        users: "8,000 usuarios",
        interventions: "234 crisis intervenidas",
        countries: "8 países",
        professionals: "67 profesionales"
      }
    },
    {
      year: "2022",
      month: "Marzo",
      title: "Reconocimiento de la OMS",
      description: "La Organización Mundial de la Salud reconoció a TIOSKAP como 'Innovación Destacada en Prevención del Suicidio'. Nuestro modelo de apoyo anónimo + detección IA + intervención profesional se convirtió en referencia internacional.",
      impact: "Validación científica y reconocimiento global",
      type: "achievement",
      icon: Award,
      stats: {
        users: "25,000 usuarios",
        interventions: "567 crisis intervenidas",
        countries: "15 países",
        professionals: "120 profesionales"
      }
    },
    {
      year: "2022",
      month: "Octubre",
      title: "Consultorio Virtual",
      description: "Lanzamos nuestro servicio de consultas profesionales, conectando usuarios con psicólogos y psiquiatras certificados. Por primera vez, el apoyo comunitario se complementó con atención clínica profesional accesible.",
      impact: "Integración completa: comunidad + profesionales + tecnología",
      type: "milestone",
      icon: Users,
      stats: {
        users: "40,000 usuarios",
        interventions: "892 crisis intervenidas",
        countries: "18 países",
        professionals: "200+ profesionales"
      }
    },
    {
      year: "2023",
      month: "Febrero",
      title: "Algoritmo de Bienestar",
      description: "Desarrollamos un sistema de seguimiento del estado de ánimo que predice crisis antes de que ocurran. Usando datos anónimos de la comunidad, podemos identificar patrones y ofrecer apoyo preventivo personalizado.",
      impact: "Prevención predictiva de crisis de salud mental",
      type: "milestone",
      icon: TrendingUp,
      stats: {
        users: "65,000 usuarios",
        interventions: "1,200+ crisis intervenidas",
        countries: "22 países",
        professionals: "350+ profesionales"
      }
    },
    {
      year: "2023",
      month: "Septiembre",
      title: "Impacto de 50,000 Vidas",
      description: "Alcanzamos un hito histórico: 50,000 personas han encontrado apoyo significativo en TIOSKAP. Nuestras estadísticas muestran que el 94% de los usuarios reportan mejora en su bienestar mental después de usar la plataforma.",
      impact: "Evidencia científica del impacto en salud mental global",
      type: "achievement",
      icon: Star,
      stats: {
        users: "85,000 usuarios activos",
        interventions: "1,500+ crisis intervenidas",
        countries: "28 países",
        professionals: "450+ profesionales"
      }
    },
    {
      year: "2024",
      month: "Enero",
      title: "TIOSKAP 2.0 - El Futuro",
      description: "Lanzamos la versión más avanzada de TIOSKAP con IA de última generación, realidad virtual para terapia, blockchain para privacidad total, y una red global de más de 500 profesionales disponibles 24/7. Nuestro objetivo: llegar a 1 millón de vidas para 2025.",
      impact: "La plataforma de salud mental más avanzada del mundo",
      type: "milestone",
      icon: Rocket,
      stats: {
        users: "120,000+ usuarios",
        interventions: "2,000+ crisis intervenidas",
        countries: "35+ países",
        professionals: "500+ profesionales"
      }
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      case 'achievement': return 'bg-green-100 text-green-800 border-green-200';
      case 'expansion': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'milestone': return 'Hito Importante';
      case 'crisis': return 'Crisis/Necesidad';
      case 'achievement': return 'Logro';
      case 'expansion': return 'Expansión';
      default: return type;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-therapeutic-100/30 to-comfort-100/20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Nuestra <span className="text-primary">Trayectoria</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Desde una crisis comunitaria hasta una red global de esperanza: 
              la evolución de TIOSKAP y nuestro impacto en el mundo
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>2020 - 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>120,000+ Vidas Impactadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>35+ Países</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4">
        <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              De la Crisis a la Esperanza
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TIOSKAP nació como respuesta directa al alto índice de suicidios en nuestra comunidad. 
              Lo que comenzó como una necesidad urgente local se transformó en una misión global: 
              <strong className="text-primary"> asegurar que ninguna persona tenga que enfrentar 
              sus momentos más oscuros en soledad.</strong>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Línea de Tiempo de Nuestra Evolución
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada momento ha sido crucial en nuestro camino hacia salvar vidas
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-300 via-blue-300 to-green-300 rounded-full"></div>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={index} className="relative flex items-start gap-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                    event.type === 'crisis' ? 'bg-red-100 border-4 border-red-300' :
                    event.type === 'achievement' ? 'bg-green-100 border-4 border-green-300' :
                    event.type === 'expansion' ? 'bg-purple-100 border-4 border-purple-300' :
                    'bg-blue-100 border-4 border-blue-300'
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      event.type === 'crisis' ? 'text-red-600' :
                      event.type === 'achievement' ? 'text-green-600' :
                      event.type === 'expansion' ? 'text-purple-600' :
                      'text-blue-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getTypeColor(event.type)}>
                              {getTypeLabel(event.type)}
                            </Badge>
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              {event.month} {event.year}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-primary">
                          <Zap className="h-4 w-4 inline mr-2" />
                          Impacto: {event.impact}
                        </p>
                      </div>

                      {event.stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-semibold text-blue-600">{event.stats.users}</div>
                            <div className="text-xs text-muted-foreground">Usuarios</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-semibold text-red-600">{event.stats.interventions}</div>
                            <div className="text-xs text-muted-foreground">Intervenciones</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-semibold text-purple-600">{event.stats.countries}</div>
                            <div className="text-xs text-muted-foreground">Países</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-semibold text-green-600">{event.stats.professionals}</div>
                            <div className="text-xs text-muted-foreground">Profesionales</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Impact */}
      <section className="bg-gradient-to-r from-primary/5 via-therapeutic-50/30 to-comfort-50/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestro Impacto Actual
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cifras que representan vidas salvadas y esperanza restaurada
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">120,000+</div>
                <div className="text-sm text-muted-foreground">Usuarios activos que han encontrado apoyo</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">2,000+</div>
                <div className="text-sm text-muted-foreground">Crisis suicidas intervenidas exitosamente</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">35+</div>
                <div className="text-sm text-muted-foreground">Países donde operamos activamente</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Profesionales certificados en la red</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 hover-lift max-w-4xl mx-auto">
          <CardContent className="text-center py-16">
            <Rocket className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              El Futuro de TIOSKAP
            </h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Nuestra trayectoria apenas comienza. Para 2025, nuestro objetivo es llegar a 1 millón de personas, 
              estar presentes en 50 países, y haber desarrollado la tecnología más avanzada para la prevención 
              del suicidio y el bienestar mental global.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-sm opacity-80">Usuarios para 2025</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-80">Países objetivo</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-80">Suicidios prevenibles</div>
              </div>
            </div>
            <p className="text-sm opacity-80 mt-6 max-w-2xl mx-auto">
              Porque creemos que cada vida tiene valor, cada historia merece ser escuchada, 
              y cada persona merece una segunda oportunidad.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
