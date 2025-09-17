import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Heart,
  Smile,
  Handshake,
  Star,
  Send,
  Plus,
  MessageCircle,
  Clock,
  Shield
} from "lucide-react";

interface Story {
  id: string;
  content: string;
  timestamp: string;
  reactions: {
    heart: number;
    smile: number;
    hug: number;
    star: number;
  };
  category: string;
}

export default function Desahogos() {
  const [newStory, setNewStory] = useState("");
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);

  // Sample stories for demonstration
  const [stories] = useState<Story[]>([
    {
      id: "1",
      content: "Después de años luchando con la ansiedad, finalmente decidí buscar ayuda profesional. Hoy puedo decir que cada día se vuelve un poco más fácil. No están solos en esto.",
      timestamp: "Hace 2 horas",
      reactions: { heart: 24, smile: 8, hug: 15, star: 12 },
      category: "Superación"
    },
    {
      id: "2", 
      content: "Perdí a mi trabajo hace tres meses y me sentía perdido. Pero este tiempo me ha enseñado que mi valor no depende de mi trabajo. Estoy aprendiendo a valorarme por quien soy.",
      timestamp: "Hace 5 horas",
      reactions: { heart: 18, smile: 5, hug: 22, star: 9 },
      category: "Reflexión"
    },
    {
      id: "3",
      content: "Mi familia no entiende mi orientación sexual y me siento muy solo. Pero sé que merezco amor y respeto tal como soy. Algún día encontraré mi tribu.",
      timestamp: "Hace 1 día",
      reactions: { heart: 45, smile: 12, hug: 38, star: 20 },
      category: "Identidad"
    },
    {
      id: "4",
      content: "Hoy es mi primer día sin beber alcohol en 6 meses. Es difícil, pero estoy orgulloso de este paso. Cada día cuenta.",
      timestamp: "Hace 1 día",
      reactions: { heart: 67, smile: 23, hug: 41, star: 35 },
      category: "Recuperación"
    },
    {
      id: "5",
      content: "Mi hermana falleció hace un año y aún me cuesta aceptarlo. Pero he aprendido que está bien no estar bien todo el tiempo. El dolor es parte del amor.",
      timestamp: "Hace 2 días",
      reactions: { heart: 89, smile: 15, hug: 76, star: 42 },
      category: "Duelo"
    },
    {
      id: "6",
      content: "Empecé terapia después de años de negarlo. Mi terapeuta me ayudó a entender que pedir ayuda es un acto de valentía, no de debilidad.",
      timestamp: "Hace 3 días",
      reactions: { heart: 34, smile: 18, hug: 29, star: 25 },
      category: "Terapia"
    }
  ]);

  const reactionIcons = {
    heart: Heart,
    smile: Smile,
    hug: Handshake,
    star: Star
  };

  const categoryColors = {
    "Superación": "bg-green-100 text-green-800 border-green-200",
    "Reflexión": "bg-blue-100 text-blue-800 border-blue-200", 
    "Identidad": "bg-purple-100 text-purple-800 border-purple-200",
    "Recuperación": "bg-orange-100 text-orange-800 border-orange-200",
    "Duelo": "bg-gray-100 text-gray-800 border-gray-200",
    "Terapia": "bg-pink-100 text-pink-800 border-pink-200"
  };

  const handleReaction = (storyId: string, reactionType: string) => {
    // Here you would implement the reaction logic
    console.log(`Reacting to story ${storyId} with ${reactionType}`);
  };

  const handleSubmitStory = () => {
    if (newStory.trim()) {
      // Here you would submit the story to your backend
      console.log("Submitting story:", newStory);
      setNewStory("");
      setShowNewStoryForm(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Mural de Desahogos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Un espacio sagrado donde cada historia importa. Comparte tu experiencia de forma anónima 
          y encuentra apoyo en nuestra comunidad.
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>100% Anónimo</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>Solo Reacciones</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Sin Comentarios</span>
          </div>
        </div>
      </div>

      {/* New Story Button/Form */}
      <div className="max-w-2xl mx-auto">
        {!showNewStoryForm ? (
          <Button 
            onClick={() => setShowNewStoryForm(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Compartir Mi Historia
          </Button>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="Comparte tu historia de forma anónima. Tu experiencia puede ayudar a otros que están pasando por situaciones similares..."
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                className="min-h-32 resize-none border-warm-200 focus:border-primary"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newStory.length}/500 caracteres
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewStoryForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitStory}
                    disabled={!newStory.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stories Mural */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {stories.map((story, index) => (
          <Card 
            key={story.id}
            className={`bg-white/70 backdrop-blur-sm border-warm-200/50 hover:shadow-lg transition-all duration-300 
              ${index % 3 === 0 ? 'md:col-span-1' : ''}
              ${index % 4 === 0 ? 'lg:col-span-2' : ''}
              ${index % 5 === 0 ? 'md:row-span-2' : ''}
            `}
          >
            <CardContent className="p-6 space-y-4">
              {/* Category Badge */}
              <Badge className={categoryColors[story.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                {story.category}
              </Badge>
              
              {/* Story Content */}
              <p className="text-foreground leading-relaxed">
                {story.content}
              </p>
              
              {/* Timestamp */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{story.timestamp}</span>
              </div>
              
              {/* Reactions */}
              <div className="flex items-center justify-between pt-2 border-t border-warm-200/50">
                <div className="flex items-center gap-3">
                  {Object.entries(story.reactions).map(([type, count]) => {
                    const Icon = reactionIcons[type as keyof typeof reactionIcons];
                    return (
                      <Button
                        key={type}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(story.id, type)}
                        className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{count}</span>
                      </Button>
                    );
                  })}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {Object.values(story.reactions).reduce((a, b) => a + b, 0)} reacciones
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Cargar Más Historias
        </Button>
      </div>

      {/* Community Guidelines */}
      <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-3">Pautas de la Comunidad</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Respeta el anonimato y la privacidad de todos</li>
            <li>• Comparte con honestidad y desde el corazón</li>
            <li>• Solo se permiten reacciones positivas de apoyo</li>
            <li>• No se toleran comentarios ofensivos o discriminatorios</li>
            <li>• Este es un espacio de sanación y crecimiento mutuo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
