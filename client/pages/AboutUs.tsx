import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Target,
  Shield,
  Crown,
  Lightbulb,
  Globe,
  Award,
  TrendingUp,
  Handshake,
  Brain,
  Star,
  CheckCircle,
  ArrowRight,
  Clock
} from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Psicólogo Jose Matamoros",
      role: "Fundador & CEO",
      description: "Psicólogo clínico con 15 años de experiencia en prevención del suicidio",
      image: "#FF6B6B"
    },
    {
      name: "Ing. Carlos Mendoza",
      role: "CTO & Co-fundador",
      description: "Experto en tecnología de salud mental y sistemas de detección de crisis",
      image: "#4ECDC4"
    },
    {
      name: "Dra. Sofia Valencia",
      role: "Directora Clínica",
      description: "Especialista en terapia digital y bienestar mental comunitario",
      image: "#96CEB4"
    },
    {
      name: "Lic. Roberto Silva",
      role: "Director de Operaciones",
      description: "Coordinador de respuesta a crisis y gestión de comunidad",
      image: "#DDA0DD"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compasión",
      description: "Cada persona que llega a nosotros recibe empatía genuina y apoyo incondicional"
    },
    {
      icon: Shield,
      title: "Privacidad",
      description: "Protegemos celosamente la privacidad y anonimato de nuestra comunidad"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Creemos en el poder sanador de la conexión humana y el apoyo mutuo"
    },
    {
      icon: Target,
      title: "Propósito",
      description: "Nuestro único objetivo es salvar vidas y fomentar el bienestar mental"
    },
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Utilizamos tecnología de vanguardia para crear soluciones de salud mental efectivas"
    },
    {
      icon: Globe,
      title: "Accesibilidad",
      description: "Hacemos que el apoyo en salud mental sea accesible para todos, sin barreras"
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Vidas impactadas positivamente" },
    { number: "1,200+", label: "Crisis de suicidio intervenidas" },
    { number: "98%", label: "Tasa de satisfacción de usuarios" },
    { number: "24/7", label: "Disponibilidad de apoyo" },
    { number: "15+", label: "Países donde operamos" },
    { number: "200+", label: "Profesionales certificados" }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-therapeutic-100/30 to-comfort-100/20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-16 w-16 text-primary fill-primary/20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Sobre <span className="text-primary">TIOSKAP</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Nacimos con una misión clara: crear un espacio seguro donde cada persona pueda encontrar 
              apoyo, comprensión y herramientas para superar sus momentos más difíciles.
            </p>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Salvando vidas desde 2020
            </Badge>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Una historia de esperanza nacida de la necesidad
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
            <CardContent className="p-8 space-y-6">
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  <strong className="text-foreground">TIOSKAP nació en 2020</strong> como respuesta a una crisis silenciosa 
                  que afectaba a nuestra comunidad. Las estadísticas de suicidio habían alcanzado niveles alarmantes, 
                  especialmente entre jóvenes y adultos jóvenes, y nos dimos cuenta de que las opciones de apoyo 
                  tradicionales no estaban llegando a quienes más lo necesitaban.
                </p>
                
                <p>
                  Nuestro fundador, <strong className="text-foreground">Psicólogo Jose Matamoros</strong>, había perdido
                  a un familiar cercano por suicidio y experimentó de primera mano las barreras que impedían acceder a
                  ayuda: el estigma, la falta de confidencialidad, los costos elevados y la escasez de recursos inmediatos.
                </p>
                
                <p>
                  <strong className="text-primary">La idea era simple pero revolucionaria:</strong> crear una plataforma 
                  donde las personas pudieran compartir sus luchas de forma completamente anónima, recibir apoyo inmediato 
                  de una comunidad que realmente entendiera su dolor, y acceder a recursos profesionales cuando fuera necesario.
                </p>
                
                <p>
                  Lo que comenzó como un proyecto local se convirtió rápidamente en un movimiento global. En nuestros 
                  primeros seis meses, logramos intervenir en más de 100 crisis de suicidio, y desde entonces no hemos 
                  parado de crecer y mejorar.
                </p>
                
                <p className="text-primary font-semibold">
                  Cada historia compartida, cada reacción de apoyo, cada vida salvada nos recuerda por qué existimos: 
                  porque <em>cada persona merece ser escuchada, valorada y apoyada en sus momentos más oscuros.</em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gradient-to-r from-primary/5 via-therapeutic-50/30 to-comfort-50/20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-primary" />
                  Nuestra Misión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Salvar vidas</strong> proporcionando un espacio seguro, anónimo y 
                  accesible donde cualquier persona que esté luchando con pensamientos suicidas o crisis emocionales 
                  pueda encontrar apoyo inmediato, comprensión genuina y recursos profesionales.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Prevención activa del suicidio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Apoyo emocional inmediato 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Comunidad de apoyo sin juicios</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-primary" />
                  Nuestra Visión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Un mundo</strong> donde ninguna persona se sienta sola en sus 
                  momentos más difíciles, donde el apoyo en salud mental sea tan accesible como buscar información 
                  en internet, y donde cada vida sea valorada y protegida.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Erradicar el estigma de la salud mental</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Hacer la ayuda psicológica universalmente accesible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Crear una red global de apoyo mutuo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestros Valores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Los principios que guían cada decisión que tomamos
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gradient-to-r from-primary/5 via-therapeutic-50/30 to-comfort-50/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profesionales dedicados que trabajan incansablemente para hacer de TIOSKAP un lugar más seguro
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                    style={{ backgroundColor: member.image }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Impacto
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Números que reflejan vidas transformadas y esperanza restaurada
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                <div className="text-sm text-muted-foreground">{achievement.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Commitment */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 hover-lift">
          <CardContent className="text-center py-16">
            <Award className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestro Compromiso Contigo
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nos comprometemos a estar aquí para ti en tus momentos más difíciles, a proteger tu privacidad 
              como si fuera la nuestra, y a nunca rendernos en nuestra misión de salvar vidas y fomentar el bienestar mental.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <Shield className="h-8 w-8 mx-auto opacity-90" />
                <h3 className="font-semibold">100% Confidencial</h3>
                <p className="text-sm opacity-80">Tu privacidad es sagrada para nosotros</p>
              </div>
              <div className="space-y-2">
                <Clock className="h-8 w-8 mx-auto opacity-90" />
                <h3 className="font-semibold">Siempre Disponible</h3>
                <p className="text-sm opacity-80">24/7, 365 días del año</p>
              </div>
              <div className="space-y-2">
                <Heart className="h-8 w-8 mx-auto opacity-90" />
                <h3 className="font-semibold">Sin Juicios</h3>
                <p className="text-sm opacity-80">Un espacio seguro para ser tú mismo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ¿Quieres ser parte de nuestra misión?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Únete a nuestra comunidad y ayúdanos a crear un mundo donde nadie tenga que enfrentar 
            sus luchas en soledad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 hover-lift">
              <Users className="h-4 w-4 mr-2" />
              Únete a la Comunidad
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 hover-lift">
              <Handshake className="h-4 w-4 mr-2" />
              Conviértete en Voluntario
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
