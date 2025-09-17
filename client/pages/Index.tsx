import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Users,
  MessageSquare,
  Bot,
  ArrowRight,
  Star,
  Lock,
  Sparkles,
  User
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Heart,
      title: "Espacio Seguro",
      description: "Comparte tus pensamientos y sentimientos en un ambiente libre de juicios"
    },
    {
      icon: Shield,
      title: "Anonimato Total",
      description: "Tu identidad está protegida. Exprésate libremente sin preocupaciones"
    },
    {
      icon: Users,
      title: "Comunidad de Apoyo",
      description: "Conecta con personas que entienden lo que estás pasando"
    },
    {
      icon: MessageSquare,
      title: "Solo Reacciones",
      description: "Un sistema de apoyo basado en reacciones positivas, sin comentarios invasivos"
    },
    {
      icon: Bot,
      title: "Asistente IA",
      description: "Kapí, tu asistente especializado en bienestar mental disponible 24/7"
    },
    {
      icon: Sparkles,
      title: "Mural de Historias",
      description: "Visualiza las experiencias compartidas como un hermoso mural de esperanza"
    }
  ];

  const testimonials = [
    {
      text: "Finalmente encontré un lugar donde puedo ser yo mismo sin miedo al juicio",
      author: "Usuario Anónimo",
      rating: 5
    },
    {
      text: "El sistema de reacciones me hace sentir apoyado sin sentirme expuesto",
      author: "Usuario Anónimo", 
      rating: 5
    },
    {
      text: "El chatbot me ha ayudado en momentos difíciles cuando más lo necesitaba",
      author: "Usuario Anónimo",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-therapeutic-100/30 to-comfort-100/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Heart className="h-3 w-3 mr-1" />
              Bienestar Mental para Todos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Tu Espacio Seguro para
              <span className="text-primary block mt-2">Sanar y Crecer</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Un lugar donde puedes compartir tus pensamientos más profundos de forma anónima, 
              recibir apoyo de la comunidad y acceder a recursos de bienestar mental las 24 horas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/desahogos">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Comenzar mi Desahogo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                  <Bot className="h-5 w-5 mr-2" />
                  Hablar con IA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Por qué elegir TIOSKAP?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hemos diseñado cada característica pensando en tu bienestar y privacidad
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-warm-200/50 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/5 via-therapeutic-50/30 to-comfort-50/20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Historias Compartidas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50,000+</div>
              <div className="text-muted-foreground">Reacciones de Apoyo</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Asistencia Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voces de Nuestra Comunidad
          </h2>
          <p className="text-lg text-muted-foreground">
            Lo que dicen quienes han encontrado apoyo aquí
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-warm-200/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{testimonial.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para comenzar tu viaje de sanación?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Únete a miles de personas que han encontrado apoyo y comprensión en nuestra comunidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cuenta">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  <User className="h-5 w-5 mr-2" />
                  Crear Cuenta Anónima
                </Button>
              </Link>
              <Link to="/desahogos">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Historias de la Comunidad
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
