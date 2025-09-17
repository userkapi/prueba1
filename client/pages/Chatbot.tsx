import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  User, 
  Heart, 
  Brain,
  Lightbulb,
  Clock,
  Shield
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'suggestion' | 'normal';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hola, soy tu asistente de bienestar mental. Estoy aquí para escucharte y apoyarte las 24 horas del día. ¿Cómo te sientes hoy?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "Me siento ansioso",
    "Necesito hablar de mis emociones", 
    "¿Cómo puedo manejar el estrés?",
    "Tengo problemas para dormir",
    "Me siento solo",
    "¿Qué son las técnicas de respiración?"
  ];

  const botResponses = {
    "me siento ansioso": "Entiendo que te sientes ansioso. La ansiedad es una experiencia muy común. ¿Te gustaría que te enseñe una técnica de respiración que puede ayudarte a sentirte más calmado?",
    "necesito hablar de mis emociones": "Es muy valiente de tu parte querer hablar sobre tus emociones. Soy todo oídos. ¿Hay alguna emoción en particular que te esté afectando hoy?",
    "¿cómo puedo manejar el estrés?": "El manejo del estrés es fundamental para nuestro bienestar. Algunas técnicas efectivas incluyen: respiración profunda, ejercicio regular, meditación y establecer límites saludables. ¿Te gustaría que profundicemos en alguna de estas?",
    "tengo problemas para dormir": "Los problemas de sueño pueden afectar mucho nuestro bienestar. Algunos consejos incluyen: mantener horarios regulares, evitar pantallas antes de dormir, y crear un ambiente relajante. ¿Has notado qué podría estar interfiriendo con tu sueño?",
    "me siento solo": "La soledad puede ser muy dolorosa. Quiero que sepas que no estás realmente solo - estoy aquí contigo y hay una comunidad que se preocupa. ¿Te gustaría hablar sobre lo que te hace sentir solo?",
    "¿qué son las técnicas de respiración?": "Las técnicas de respiración son herramientas poderosas para calmar la mente. Una simple es la respiración 4-7-8: inhala por 4 segundos, mantén por 7, exhala por 8. ¿Te gustaría probar conmigo?"
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    // Simple keyword matching for demonstration
    for (const [key, response] of Object.entries(botResponses)) {
      if (userInput.includes(key.toLowerCase())) {
        return response;
      }
    }

    // Default responses
    const defaultResponses = [
      "Gracias por compartir eso conmigo. ¿Puedes contarme más sobre cómo te hace sentir?",
      "Entiendo lo que me dices. Es importante que puedas expresar lo que sientes. ¿Hay algo específico que te preocupa?",
      "Aprecio tu confianza al hablar conmigo. ¿Te gustaría explorar algunas estrategias que podrían ayudarte?",
      "Es normal sentirse así a veces. ¿Qué crees que podría ayudarte a sentirte mejor en este momento?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Asistente de Bienestar Mental
        </h1>
        <p className="text-muted-foreground">
          Un espacio seguro para conversar sobre tu bienestar mental, disponible 24/7
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
            <Heart className="h-4 w-4" />
            <span>Apoyo Inmediato</span>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
        <CardHeader className="border-b border-warm-200/50">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Chat de Apoyo
            <Badge className="ml-auto bg-green-100 text-green-800">En línea</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Chat Messages */}
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-white ml-12'
                        : 'bg-gray-100 text-foreground mr-12'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 mt-1 text-primary" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
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
                <div className="flex justify-start">
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
            <p className="text-sm text-muted-foreground mb-2">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs hover:bg-primary/5 hover:border-primary/20"
                >
                  {suggestion}
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
                placeholder="Escribe tu mensaje aquí..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Técnicas de Relajación</h3>
            <p className="text-sm text-muted-foreground">
              Aprende ejercicios de respiración y mindfulness
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Recursos de Ayuda</h3>
            <p className="text-sm text-muted-foreground">
              Accede a información sobre salud mental
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Crisis Support</h3>
            <p className="text-sm text-muted-foreground">
              Ayuda inmediata en situaciones de crisis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Nota importante:</strong> Kapí proporciona apoyo general y no reemplaza la atención médica profesional. 
            Si estás experimentando una crisis de salud mental, por favor contacta a servicios de emergencia o a un profesional de la salud mental.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
