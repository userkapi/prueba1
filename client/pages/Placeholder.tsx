import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  page: string;
}

export default function Placeholder({ page }: PlaceholderProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-foreground">
              {page} - En Desarrollo
            </CardTitle>
            <CardDescription className="text-lg">
              Esta sección está siendo construida con mucho amor y cuidado para ofrecerte 
              la mejor experiencia de bienestar mental.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <Heart className="h-4 w-4 inline mr-2 text-primary" />
                Estamos trabajando para que pronto puedas acceder a todas las funcionalidades 
                que te ayudarán en tu proceso de sanación y crecimiento personal.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
              
              <Link to="/desahogos">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <Heart className="h-4 w-4 mr-2" />
                  Ver Desahogos
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground">
              ¿Tienes sugerencias para esta sección? Contáctanos a través del chatbot o 
              en la sección de ayuda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
