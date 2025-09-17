import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import DatabaseTest from "@/components/DatabaseTest";
import UserWelcome from "@/components/UserWelcome";
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
  User,
  Zap,
  Brain,
  TrendingUp,
  UserPlus,
  LogIn,
  Crown
} from "lucide-react";

export default function IndexEnhanced() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [typedText, setTypedText] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);
  const fullText = t('home.hero.subtitle');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Heart,
      title: t('features.safe.title'),
      description: t('features.safe.desc'),
      color: "from-red-400 to-pink-400"
    },
    {
      icon: Shield,
      title: t('features.anonymous.title'),
      description: t('features.anonymous.desc'),
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.desc'),
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: MessageSquare,
      title: t('features.reactions.title'),
      description: t('features.reactions.desc'),
      color: "from-purple-400 to-violet-400"
    },
    {
      icon: Bot,
      title: t('features.ai.title'),
      description: t('features.ai.desc'),
      color: "from-orange-400 to-yellow-400"
    },
    {
      icon: Sparkles,
      title: t('features.mural.title'),
      description: t('features.mural.desc'),
      color: "from-indigo-400 to-purple-400"
    }
  ];

  const testimonials = [
    {
      text: "Finalmente encontré un lugar donde puedo ser yo mismo sin miedo al juicio",
      author: "Usuario Anónimo",
      rating: 5,
      avatar: "🌟"
    },
    {
      text: "El sistema de reacciones me hace sentir apoyado sin sentirme expuesto",
      author: "Usuario Anónimo", 
      rating: 5,
      avatar: "💙"
    },
    {
      text: "El chatbot me ha ayudado en momentos difíciles cuando más lo necesitaba",
      author: "Usuario Anónimo",
      rating: 5,
      avatar: "🌈"
    }
  ];

  const FloatingParticle = ({ delay = 0 }) => (
    <div 
      className={`absolute w-2 h-2 bg-primary/20 rounded-full animate-float`}
      style={{ 
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    />
  );

  return (
    <div className="space-y-16 pb-16 relative overflow-hidden">
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.5} />
      ))}
      
      {/* Conditional Hero Section */}
      {isAuthenticated && user ? (
        /* Welcome Section for Authenticated Users */
        <section className="container mx-auto px-4 py-12">
          <UserWelcome />
        </section>
      ) : (
        /* Hero Section for Non-Authenticated Users */
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-therapeutic-100/30 to-comfort-100/20 animate-shimmer" />
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover-lift">
                <Heart className="h-3 w-3 mr-1 animate-pulse-soft" />
                {t('home.hero.badge')}
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="animate-typewriter inline-block">
                  {t('home.hero.title')} {typedText}
                </span>
                <span className="text-primary block mt-2 animate-slide-up">
                  {typedText.length >= fullText.length && "✨"}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                {t('home.hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                <Link to="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg hover-lift group gradient-border">
                    <UserPlus className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    {t('button.create_account')}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/desahogos">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover-lift glass-effect">
                    <Heart className="h-5 w-5 mr-2" />
                    {t('button.view_stories')}
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-primary hover-lift">
                    <Bot className="h-5 w-5 mr-2" />
                    {t('button.try_ai')}
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Features Showcase */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('welcome.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('welcome.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === currentFeature;
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-lg transition-all duration-500 border-warm-200/50 bg-white/50 backdrop-blur-sm hover-lift ${
                  isActive ? 'ring-2 ring-primary/50 scale-105' : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 bg-gradient-to-r ${feature.color} ${
                    isActive ? 'animate-pulse' : 'group-hover:scale-110'
                  }`}>
                    <Icon className={`h-6 w-6 text-white ${isActive ? 'animate-bounce' : ''}`} />
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

      {/* Animated Stats Section */}
      <section className="bg-gradient-to-r from-primary/5 via-therapeutic-50/30 to-comfort-50/20 animate-shimmer">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2 hover-lift">
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                <TrendingUp className="h-8 w-8 mr-2 animate-bounce" />
                10,000+
              </div>
              <div className="text-muted-foreground">{t('stats.stories')}</div>
            </div>
            <div className="space-y-2 hover-lift">
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                <Heart className="h-8 w-8 mr-2 animate-pulse-soft" />
                50,000+
              </div>
              <div className="text-muted-foreground">{t('stats.reactions')}</div>
            </div>
            <div className="space-y-2 hover-lift">
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                <Brain className="h-8 w-8 mr-2 animate-float" />
                24/7
              </div>
              <div className="text-muted-foreground">{t('stats.available')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('testimonials.voices')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials.what_they_say')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift glass-effect">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary animate-pulse-soft" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">{testimonial.avatar}</span>
                  </div>
                  <span className="text-sm font-medium">{testimonial.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section - Conditional */}
      <section className="container mx-auto px-4">
        {isAuthenticated && user ? (
          <Card className="bg-gradient-to-r from-therapeutic-100 to-comfort-100 border-0 hover-lift">
            <CardContent className="text-center py-12">
              <Crown className="h-12 w-12 mx-auto mb-4 text-primary fill-primary/20" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {t('welcome.auth_title').replace('{name}', user.display_name || '')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('welcome.auth_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chatbot">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Bot className="h-5 w-5 mr-2" />
                    {t('button.talk_with_ai')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/recursos">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {t('button.explore_resources')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 hover-lift glass-effect">
            <CardContent className="text-center py-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
                {t('welcome.ready_title')}
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto animate-fade-in">
                {t('welcome.ready_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 hover-lift">
                    <UserPlus className="h-5 w-5 mr-2" />
                    {t('button.create_account')}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover-lift">
                    <LogIn className="h-5 w-5 mr-2" />
                    {t('button.already_have_account')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Database Connection Test */}
      <section className="container mx-auto px-4 py-8">
        <DatabaseTest />
      </section>
    </div>
  );
}
