import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { 
  GraduationCap,
  Calendar,
  Clock,
  Star,
  Video,
  MessageSquare,
  Phone,
  CreditCard,
  Shield,
  CheckCircle,
  User,
  Award,
  Heart,
  Zap,
  Users
} from "lucide-react";

interface Professional {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviews: number;
  price: {
    video: number;
    chat: number;
    phone: number;
  };
  availability: string[];
  languages: string[];
  image: string;
  verified: boolean;
  description: string;
}

interface Appointment {
  id: string;
  professionalId: string;
  userId: string;
  date: Date;
  type: 'video' | 'chat' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
}

export default function ProfessionalConsultation() {
  const { user, isAuthenticated } = useAuth();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedService, setSelectedService] = useState<'video' | 'chat' | 'phone'>('video');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');

  const professionals: Professional[] = [
    {
      id: 'prof1',
      name: 'Dra. María González',
      title: 'Psicóloga Clínica',
      specialties: ['Ansiedad', 'Depresión', 'Terapia Cognitiva'],
      experience: 12,
      rating: 4.9,
      reviews: 156,
      price: { video: 75, chat: 50, phone: 60 },
      availability: ['Lun-Vie 9:00-18:00'],
      languages: ['Español', 'Inglés'],
      image: '#FF6B6B',
      verified: true,
      description: 'Especialista en trastornos de ansiedad y depresión con enfoque en terapia cognitivo-conductual. Más de 12 años de experiencia ayudando a pacientes a superar sus desafíos emocionales.'
    },
    {
      id: 'prof2',
      name: 'Dr. Carlos Ruiz',
      title: 'Psiquiatra',
      specialties: ['Trastornos del Estado de Ánimo', 'Medicación', 'Crisis'],
      experience: 18,
      rating: 4.8,
      reviews: 203,
      price: { video: 120, chat: 80, phone: 100 },
      availability: ['Lun-Sab 10:00-20:00'],
      languages: ['Español'],
      image: '#4ECDC4',
      verified: true,
      description: 'Psiquiatra especializado en trastornos del estado de ánimo y manejo de crisis. Enfoque integral combinando terapia y medicación cuando es necesario.'
    },
    {
      id: 'prof3',
      name: 'Lic. Ana Pérez',
      title: 'Terapeuta de Pareja',
      specialties: ['Terapia de Pareja', 'Relaciones', 'Comunicación'],
      experience: 8,
      rating: 4.7,
      reviews: 89,
      price: { video: 85, chat: 60, phone: 70 },
      availability: ['Mar-Sab 14:00-21:00'],
      languages: ['Español', 'Portugués'],
      image: '#96CEB4',
      verified: true,
      description: 'Especialista en terapia de pareja y relaciones interpersonales. Ayuda a parejas a mejorar la comunicación y resolver conflictos de manera constructiva.'
    },
    {
      id: 'prof4',
      name: 'Dr. Roberto Silva',
      title: 'Psicólogo Infantil',
      specialties: ['Psicología Infantil', 'Adolescentes', 'Familia'],
      experience: 15,
      rating: 4.9,
      reviews: 124,
      price: { video: 80, chat: 55, phone: 65 },
      availability: ['Lun-Vie 15:00-19:00'],
      languages: ['Español', 'Inglés'],
      image: '#DDA0DD',
      verified: true,
      description: 'Psicólogo especializado en niños y adolescentes. Experto en terapia familiar y manejo de problemas de conducta y emocionales en menores.'
    }
  ];

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar una consulta');
      return;
    }

    if (!selectedProfessional || !appointmentDate || !appointmentTime) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Simulate payment processing
    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      professionalId: selectedProfessional.id,
      userId: user!.id,
      date: new Date(`${appointmentDate} ${appointmentTime}`),
      type: selectedService,
      status: 'pending',
      price: selectedProfessional.price[selectedService],
      notes: consultationNotes
    };

    // Save appointment (in real app, send to server)
    const existingAppointments = JSON.parse(localStorage.getItem('tioskap_appointments') || '[]');
    existingAppointments.push(appointment);
    localStorage.setItem('tioskap_appointments', JSON.stringify(existingAppointments));

    alert('¡Consulta reservada exitosamente! Recibirás un email de confirmación.');
    
    // Reset form
    setSelectedProfessional(null);
    setAppointmentDate('');
    setAppointmentTime('');
    setConsultationNotes('');
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          Consulta con Profesionales
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conecta con psicólogos y psiquiatras certificados para recibir atención personalizada y profesional
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
          <CardContent className="p-6">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Profesionales Verificados</h3>
            <p className="text-sm text-muted-foreground">Todos nuestros profesionales están certificados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
          <CardContent className="p-6">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Horarios Flexibles</h3>
            <p className="text-sm text-muted-foreground">Encuentra citas que se adapten a tu agenda</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
          <CardContent className="p-6">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold">Atención Personalizada</h3>
            <p className="text-sm text-muted-foreground">Tratamiento adaptado a tus necesidades</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift text-center">
          <CardContent className="p-6">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Resultados Comprobados</h3>
            <p className="text-sm text-muted-foreground">95% de satisfacción de nuestros usuarios</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professionals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="professionals" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Profesionales
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservar Cita
          </TabsTrigger>
          <TabsTrigger value="my-appointments" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Mis Citas
          </TabsTrigger>
        </TabsList>

        {/* Professionals List */}
        <TabsContent value="professionals" className="space-y-6">
          <div className="grid gap-6">
            {professionals.map(prof => (
              <Card key={prof.id} className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: prof.image }}
                    >
                      {prof.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{prof.name}</h3>
                            {prof.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{prof.title}</p>
                          <p className="text-sm text-muted-foreground">{prof.experience} años de experiencia</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{prof.rating}</span>
                            <span className="text-sm text-muted-foreground">({prof.reviews} reseñas)</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Desde ${prof.price.chat}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {prof.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {prof.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Disponible: {prof.availability.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Idiomas: {prof.languages.join(', ')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProfessional(prof)}
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setSelectedProfessional(prof);
                              // Switch to booking tab
                              const bookingTab = document.querySelector('[value="booking"]') as HTMLButtonElement;
                              bookingTab?.click();
                            }}
                          >
                            Reservar Cita
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Booking Tab */}
        <TabsContent value="booking" className="space-y-6">
          {selectedProfessional ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Professional Summary */}
              <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
                <CardHeader>
                  <CardTitle>Profesional Seleccionado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: selectedProfessional.image }}
                    >
                      {selectedProfessional.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedProfessional.name}</h3>
                      <p className="text-muted-foreground">{selectedProfessional.title}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedProfessional.rating} ({selectedProfessional.reviews} reseñas)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Servicios y Precios:</h4>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span>Videollamada</span>
                        </div>
                        <span className="font-semibold">${selectedProfessional.price.video}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Chat</span>
                        </div>
                        <span className="font-semibold">${selectedProfessional.price.chat}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Llamada telefónica</span>
                        </div>
                        <span className="font-semibold">${selectedProfessional.price.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form */}
              <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50">
                <CardHeader>
                  <CardTitle>Reservar Consulta</CardTitle>
                  <CardDescription>Completa los detalles de tu cita</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de consulta</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['video', 'chat', 'phone'] as const).map(type => (
                        <Button
                          key={type}
                          variant={selectedService === type ? "default" : "outline"}
                          onClick={() => setSelectedService(type)}
                          className="flex items-center gap-2"
                        >
                          {getServiceIcon(type)}
                          <span className="capitalize">{type === 'video' ? 'Video' : type === 'chat' ? 'Chat' : 'Teléfono'}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fecha</label>
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hora</label>
                      <select 
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">Seleccionar hora</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Notas adicionales (opcional)
                    </label>
                    <Textarea
                      placeholder="Describe brevemente el motivo de la consulta o cualquier información que consideres relevante..."
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">Total a pagar:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${selectedProfessional.price[selectedService]}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Método de pago</label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={paymentMethod === 'card' ? "default" : "outline"}
                            onClick={() => setPaymentMethod('card')}
                            className="flex items-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Tarjeta
                          </Button>
                          <Button
                            variant={paymentMethod === 'paypal' ? "default" : "outline"}
                            onClick={() => setPaymentMethod('paypal')}
                            className="flex items-center gap-2"
                          >
                            PayPal
                          </Button>
                          <Button
                            variant={paymentMethod === 'bank' ? "default" : "outline"}
                            onClick={() => setPaymentMethod('bank')}
                            className="flex items-center gap-2"
                          >
                            Banco
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleBookAppointment}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                        disabled={!isAuthenticated}
                      >
                        {!isAuthenticated ? (
                          'Inicia sesión para reservar'
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Confirmar y Pagar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 text-center">
              <CardContent className="py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona un Profesional</h3>
                <p className="text-muted-foreground mb-4">
                  Primero elige un profesional de la lista para reservar una consulta
                </p>
                <Button 
                  onClick={() => {
                    const profTab = document.querySelector('[value="professionals"]') as HTMLButtonElement;
                    profTab?.click();
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Ver Profesionales
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Appointments Tab */}
        <TabsContent value="my-appointments" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 text-center">
            <CardContent className="py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mis Citas</h3>
              <p className="text-muted-foreground">
                {!isAuthenticated 
                  ? 'Inicia sesión para ver tus citas programadas'
                  : 'Aquí aparecerán tus citas cuando reserves una consulta'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
