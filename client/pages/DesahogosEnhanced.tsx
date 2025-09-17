import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContextDatabase";
import { db } from "../lib/database";
import {
  Heart,
  Smile,
  Handshake,
  Star,
  Send,
  Plus,
  MessageCircle,
  Clock,
  Shield,
  Filter,
  Search,
  TrendingUp,
  Sparkles,
  Award,
  Target
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
  mood: string;
  userReacted?: string[];
  user_id?: string;
  username?: string;
  display_name?: string;
  avatar_color?: string;
  reactions_count?: number;
  created_at?: string;
}

interface AnimatedReaction {
  id: string;
  type: string;
  x: number;
  y: number;
}

export default function DesahogosEnhanced() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [newStory, setNewStory] = useState("");
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedMood, setSelectedMood] = useState("Todos");
  const [animatedReactions, setAnimatedReactions] = useState<AnimatedReaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stories from database
  const [stories, setStories] = useState<Story[]>([]);

  // Load stories from database
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);
        const dbStories = await db.getStories({ limit: 50 });

        // Transform database stories to component format
        const transformedStories = dbStories.map(story => ({
          id: story.id,
          content: story.content,
          timestamp: formatTimestamp(story.created_at),
          reactions: {
            heart: Math.floor(story.reactions_count * 0.4) || 0,
            smile: Math.floor(story.reactions_count * 0.2) || 0,
            hug: Math.floor(story.reactions_count * 0.3) || 0,
            star: Math.floor(story.reactions_count * 0.1) || 0
          },
          category: story.category || "Reflexión",
          mood: mapMoodToText(story.mood || 3),
          userReacted: [],
          user_id: story.user_id,
          username: story.username,
          display_name: story.display_name,
          avatar_color: story.avatar_color,
          reactions_count: story.reactions_count || 0,
          created_at: story.created_at
        }));

        setStories(transformedStories);
      } catch (error) {
        console.error('Error loading stories:', error);
        // Keep empty array if database fails
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  // Helper functions
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace menos de una hora";
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES');
  };

  const mapMoodToText = (mood: number): string => {
    const moodMap = {
      1: "Melancólico",
      2: "Reflexivo",
      3: "Equilibrado",
      4: "Esperanzado",
      5: "Optimista"
    };
    return moodMap[mood as keyof typeof moodMap] || "Equilibrado";
  };

  const reactionIcons = {
    heart: Heart,
    smile: Smile, 
    hug: Handshake,
    star: Star
  };

  const reactionColors = {
    heart: "text-red-500",
    smile: "text-yellow-500",
    hug: "text-blue-500", 
    star: "text-purple-500"
  };

  const categories = ["Todos", "Superación", "Reflexión", "Identidad", "Recuperación", "Duelo", "Terapia"];
  const moods = ["Todos", "Esperanzado", "Resiliente", "Determinado", "Orgulloso", "Melancólico", "Valiente"];

  const categoryColors = {
    "Superación": "bg-green-100 text-green-800 border-green-200",
    "Reflexi��n": "bg-blue-100 text-blue-800 border-blue-200", 
    "Identidad": "bg-purple-100 text-purple-800 border-purple-200",
    "Recuperación": "bg-orange-100 text-orange-800 border-orange-200",
    "Duelo": "bg-gray-100 text-gray-800 border-gray-200",
    "Terapia": "bg-pink-100 text-pink-800 border-pink-200"
  };

  const moodColors = {
    "Esperanzado": "bg-yellow-50 border-yellow-200",
    "Resiliente": "bg-green-50 border-green-200",
    "Determinado": "bg-blue-50 border-blue-200",
    "Orgulloso": "bg-purple-50 border-purple-200",
    "Melancólico": "bg-gray-50 border-gray-200",
    "Valiente": "bg-red-50 border-red-200"
  };

  // Filter stories based on search and filters
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || story.category === selectedCategory;
    const matchesMood = selectedMood === "Todos" || story.mood === selectedMood;
    return matchesSearch && matchesCategory && matchesMood;
  });

  const handleReaction = (storyId: string, reactionType: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      const newReaction: AnimatedReaction = {
        id: Date.now().toString(),
        type: reactionType,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top
      };
      
      setAnimatedReactions(prev => [...prev, newReaction]);
      
      // Update story reactions
      setStories(prev => prev.map(story => {
        if (story.id === storyId) {
          const wasReacted = story.userReacted?.includes(reactionType);
          return {
            ...story,
            reactions: {
              ...story.reactions,
              [reactionType]: wasReacted 
                ? story.reactions[reactionType as keyof typeof story.reactions] - 1
                : story.reactions[reactionType as keyof typeof story.reactions] + 1
            },
            userReacted: wasReacted 
              ? story.userReacted?.filter(r => r !== reactionType) || []
              : [...(story.userReacted || []), reactionType]
          };
        }
        return story;
      }));
      
      // Remove animation after completion
      setTimeout(() => {
        setAnimatedReactions(prev => prev.filter(r => r.id !== newReaction.id));
      }, 1000);
    }
  };

  const handleSubmitStory = async () => {
    if (!newStory.trim() || !user || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create story in database
      const storyData = {
        user_id: user.id,
        content: newStory.trim(),
        mood: 4, // Default to "Esperanzado" (4)
        category: "Reflexión",
        tags: [],
        is_anonymous: true
      };

      const createdStory = await db.createStory(storyData);

      // Transform to component format and add to local state
      const newStoryObj: Story = {
        id: createdStory.id,
        content: createdStory.content,
        timestamp: "Ahora",
        reactions: { heart: 0, smile: 0, hug: 0, star: 0 },
        category: createdStory.category,
        mood: mapMoodToText(createdStory.mood),
        userReacted: [],
        user_id: createdStory.user_id,
        reactions_count: 0,
        created_at: createdStory.created_at
      };

      setStories(prev => [newStoryObj, ...prev]);
      setNewStory("");
      setShowNewStoryForm(false);

      // Update user stats
      if (user && updateUser) {
        try {
          await updateUser({
            stories_count: (user.stories_count || 0) + 1,
            karma_points: (user.karma_points || 0) + 10 // Reward for sharing story
          });
        } catch (error) {
          console.error('Error updating user stats:', error);
        }
      }

    } catch (error) {
      console.error('Error creating story:', error);
      // Fallback: add to local state only
      const fallbackStoryObj: Story = {
        id: `local_${Date.now()}`,
        content: newStory.trim(),
        timestamp: "Ahora",
        reactions: { heart: 0, smile: 0, hug: 0, star: 0 },
        category: "Reflexión",
        mood: "Esperanzado",
        userReacted: []
      };

      setStories(prev => [fallbackStoryObj, ...prev]);
      setNewStory("");
      setShowNewStoryForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedReactions(prev => prev.filter(r => Date.now() - parseInt(r.id) < 1000));
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 relative" ref={containerRef}>
      {/* Animated Reactions Overlay */}
      {animatedReactions.map(reaction => {
        const Icon = reactionIcons[reaction.type as keyof typeof reactionIcons];
        return (
          <div
            key={reaction.id}
            className="fixed pointer-events-none z-50 reaction-bounce"
            style={{
              left: reaction.x,
              top: reaction.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Icon className={`h-8 w-8 ${reactionColors[reaction.type as keyof typeof reactionColors]}`} />
          </div>
        );
      })}

      {/* Enhanced Header with Stats */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-up">
          Mural de Desahogos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
          Un espacio sagrado donde cada historia importa. Comparte tu experiencia de forma anónima 
          y encuentra apoyo en nuestra comunidad.
        </p>
        
        {/* User Progress */}
        {user && (
          <div className="flex items-center justify-center gap-6 text-sm animate-scale-in">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
              <Target className="h-4 w-4 text-primary" />
              <span>Racha: {user.login_streak || 0} días</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 text-yellow-600" />
              <span>Nivel {Math.floor((user.karma_points || 0) / 100) + 1}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span>{user.stories_count || 0} historias</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground animate-slide-up">
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

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar historias por contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <select 
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Story Button/Form */}
      <div className="max-w-2xl mx-auto">
        {!isAuthenticated ? (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6 text-center">
              <p className="text-yellow-800">Inicia sesión para compartir tu historia</p>
            </CardContent>
          </Card>
        ) : !showNewStoryForm ? (
          <Button
            onClick={() => setShowNewStoryForm(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg hover-lift gradient-border"
          >
            <Plus className="h-5 w-5 mr-2" />
            Compartir Mi Historia
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 glass-effect animate-scale-in">
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
                    className="hover-lift"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitStory}
                    disabled={!newStory.trim() || !isAuthenticated || isSubmitting}
                    className="bg-primary hover:bg-primary/90 hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Compartir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Stories Mural */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando historias...</p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No se encontraron historias</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {filteredStories.map((story, index) => (
          <Card 
            key={story.id}
            className={`bg-white/70 backdrop-blur-sm border-warm-200/50 hover:shadow-lg transition-all duration-300 hover-lift glass-effect animate-slide-up
              ${index % 3 === 0 ? 'md:col-span-1' : ''}
              ${index % 4 === 0 ? 'lg:col-span-2' : ''}
              ${index % 5 === 0 ? 'md:row-span-2' : ''}
              ${moodColors[story.mood as keyof typeof moodColors] || ''}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6 space-y-4">
              {/* Category and Mood Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={categoryColors[story.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                  {story.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {story.mood}
                </Badge>
              </div>
              
              {/* Story Content */}
              <p className="text-foreground leading-relaxed">
                {story.content}
              </p>
              
              {/* Timestamp */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{story.timestamp}</span>
              </div>
              
              {/* Enhanced Reactions */}
              <div className="flex items-center justify-between pt-2 border-t border-warm-200/50">
                <div className="flex items-center gap-1">
                  {Object.entries(story.reactions).map(([type, count]) => {
                    const Icon = reactionIcons[type as keyof typeof reactionIcons];
                    const isReacted = story.userReacted?.includes(type);
                    return (
                      <Button
                        key={type}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleReaction(story.id, type, e)}
                        className={`flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all hover-lift ${
                          isReacted ? 'bg-primary/20 text-primary' : ''
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isReacted ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-medium">{count}</span>
                      </Button>
                    );
                  })}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{Object.values(story.reactions).reduce((a, b) => a + b, 0)} reacciones</span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center animate-fade-in">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 hover-lift">
          Cargar Más Historias
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Enhanced Community Guidelines */}
      <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20 glass-effect hover-lift">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pautas de la Comunidad
          </h3>
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
