import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navigation
    'nav.home': 'INICIO',
    'nav.about': 'NOSOTROS', 
    'nav.stories': 'DESAHOGOS',
    'nav.store': 'TIENDA',
    'nav.settings': 'AJUSTES',
    'nav.chatbot': 'KAPÍ',
    'nav.account': 'CUENTA',
    'nav.coffee': 'BUY MY COFFEE',
    'nav.follow': 'SIGUENOS',
    'nav.history': 'HISTORIA',
    'nav.help': 'AYUDA',
    'nav.resources': 'RECURSOS',
    'nav.professionals': 'PROFESIONALES',
    'nav.dashboard': 'DASHBOARD',
    'nav.register': 'REGISTRARSE',
    'nav.trajectory': 'TRAYECTORIA',

    // Homepage
    'home.hero.badge': 'Bienestar Mental para Todos',
    'home.hero.title': 'Tu Espacio Seguro para',
    'home.hero.subtitle': 'Sanar y Crecer',
    'home.hero.description': 'Un lugar donde puedes compartir tus pensamientos más profundos de forma anónima, recibir apoyo de la comunidad y acceder a recursos de bienestar mental las 24 horas.',
    'home.hero.cta1': 'Comenzar mi Desahogo',
    'home.hero.cta2': 'Hablar con IA',

    // Features
    'features.title': '¿Por qué elegir TIOSKAP?',
    'features.subtitle': 'Hemos diseñado cada característica pensando en tu bienestar y privacidad',
    'features.safe.title': 'Espacio Seguro',
    'features.safe.desc': 'Comparte tus pensamientos y sentimientos en un ambiente libre de juicios',
    'features.anonymous.title': 'Anonimato Total',
    'features.anonymous.desc': 'Tu identidad está protegida. Exprésate libremente sin preocupaciones',
    'features.community.title': 'Comunidad de Apoyo',
    'features.community.desc': 'Conecta con personas que entienden lo que estás pasando',
    'features.reactions.title': 'Solo Reacciones',
    'features.reactions.desc': 'Un sistema de apoyo basado en reacciones positivas, sin comentarios invasivos',
    'features.ai.title': 'Asistente IA',
    'features.ai.desc': 'Kapí, tu asistente de bienestar mental disponible 24/7',
    'features.mural.title': 'Mural de Historias',
    'features.mural.desc': 'Visualiza las experiencias compartidas como un hermoso mural de esperanza',

    // Stats
    'stats.stories': 'Historias Compartidas',
    'stats.reactions': 'Reacciones de Apoyo',
    'stats.available': 'Asistencia Disponible',

    // Testimonials
    'testimonials.title': 'Voces de Nuestra Comunidad',
    'testimonials.subtitle': 'Lo que dicen quienes han encontrado apoyo aquí',

    // Desahogos
    'stories.title': 'Mural de Desahogos',
    'stories.subtitle': 'Un espacio sagrado donde cada historia importa. Comparte tu experiencia de forma anónima y encuentra apoyo en nuestra comunidad.',
    'stories.share': 'Compartir Mi Historia',
    'stories.placeholder': 'Comparte tu historia de forma anónima. Tu experiencia puede ayudar a otros que están pasando por situaciones similares...',
    'stories.submit': 'Compartir',
    'stories.cancel': 'Cancelar',
    'stories.guidelines': 'Pautas de la Comunidad',

    // Kapí
    'chatbot.title': 'Kapí - Tu Asistente de Bienestar',
    'chatbot.subtitle': 'Un espacio seguro para conversar con Kapí sobre tu bienestar mental, disponible 24/7',
    'chatbot.placeholder': 'Escribe tu mensaje aquí...',
    'chatbot.suggestions': 'Sugerencias rápidas:',

    // Buttons and Actions
    'button.create_account': 'Crear Cuenta Gratis',
    'button.view_stories': 'Ver Historias',
    'button.try_ai': 'Probar IA',
    'button.talk_with_ai': 'Hablar con IA',
    'button.explore_resources': 'Explorar Recursos',
    'button.already_have_account': 'Ya tengo cuenta',

    // Welcome Section
    'welcome.title': '¿Por qué elegir TIOSKAP?',
    'welcome.subtitle': 'Hemos diseñado cada característica pensando en tu bienestar y privacidad',
    'welcome.auth_title': 'Tu bienestar es nuestra prioridad, {name}',
    'welcome.auth_subtitle': 'Cada paso que das hacia tu sanación es valioso. Estamos aquí para acompañarte.',
    'welcome.ready_title': '¿Listo para comenzar tu viaje de sanación?',
    'welcome.ready_subtitle': 'Únete a miles de personas que han encontrado apoyo y comprensión en nuestra comunidad',

    // Testimonials
    'testimonials.voices': 'Voces de Nuestra Comunidad',
    'testimonials.what_they_say': 'Lo que dicen quienes han encontrado apoyo aquí',

    // Common
    'common.anonymous': 'Anónimo',
    'common.confidential': 'Confidencial',
    'common.reactions_only': 'Solo Reacciones',
    'common.no_comments': 'Sin Comentarios',
    'common.online': 'En línea',
    'common.loading': 'Cargando...',
  },
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.about': 'ABOUT US',
    'nav.stories': 'STORIES',
    'nav.store': 'STORE',
    'nav.settings': 'SETTINGS',
    'nav.chatbot': 'KAPÍ',
    'nav.account': 'ACCOUNT',
    'nav.coffee': 'BUY MY COFFEE',
    'nav.follow': 'FOLLOW US',
    'nav.history': 'HISTORY',
    'nav.help': 'HELP',
    'nav.resources': 'RESOURCES',
    'nav.professionals': 'PROFESSIONALS',
    'nav.dashboard': 'DASHBOARD',
    'nav.register': 'REGISTER',
    'nav.trajectory': 'TRAJECTORY',

    // Homepage
    'home.hero.badge': 'Mental Wellness for Everyone',
    'home.hero.title': 'Your Safe Space to',
    'home.hero.subtitle': 'Heal and Grow',
    'home.hero.description': 'A place where you can share your deepest thoughts anonymously, receive community support and access mental wellness resources 24/7.',
    'home.hero.cta1': 'Share My Story',
    'home.hero.cta2': 'Talk to AI',

    // Features
    'features.title': 'Why choose TIOSKAP?',
    'features.subtitle': 'We have designed every feature with your wellbeing and privacy in mind',
    'features.safe.title': 'Safe Space',
    'features.safe.desc': 'Share your thoughts and feelings in a judgment-free environment',
    'features.anonymous.title': 'Complete Anonymity',
    'features.anonymous.desc': 'Your identity is protected. Express yourself freely without worries',
    'features.community.title': 'Support Community',
    'features.community.desc': 'Connect with people who understand what you are going through',
    'features.reactions.title': 'Reactions Only',
    'features.reactions.desc': 'A support system based on positive reactions, without invasive comments',
    'features.ai.title': 'AI Assistant',
    'features.ai.desc': 'Kapí, your mental wellness assistant available 24/7',
    'features.mural.title': 'Stories Mural',
    'features.mural.desc': 'Visualize shared experiences as a beautiful mural of hope',

    // Stats
    'stats.stories': 'Stories Shared',
    'stats.reactions': 'Support Reactions',
    'stats.available': 'Assistance Available',

    // Testimonials
    'testimonials.title': 'Voices from Our Community',
    'testimonials.subtitle': 'What those who have found support here say',

    // Desahogos
    'stories.title': 'Stories Mural',
    'stories.subtitle': 'A sacred space where every story matters. Share your experience anonymously and find support in our community.',
    'stories.share': 'Share My Story',
    'stories.placeholder': 'Share your story anonymously. Your experience can help others going through similar situations...',
    'stories.submit': 'Share',
    'stories.cancel': 'Cancel',
    'stories.guidelines': 'Community Guidelines',

    // Kapí
    'chatbot.title': 'Kapí - Your Wellness Assistant',
    'chatbot.subtitle': 'A safe space to talk with Kapí about your mental wellness, available 24/7',
    'chatbot.placeholder': 'Type your message here...',
    'chatbot.suggestions': 'Quick suggestions:',

    // Buttons and Actions
    'button.create_account': 'Create Free Account',
    'button.view_stories': 'View Stories',
    'button.try_ai': 'Try AI',
    'button.talk_with_ai': 'Talk with AI',
    'button.explore_resources': 'Explore Resources',
    'button.already_have_account': 'I already have an account',

    // Welcome Section
    'welcome.title': 'Why choose TIOSKAP?',
    'welcome.subtitle': 'We have designed every feature with your wellbeing and privacy in mind',
    'welcome.auth_title': 'Your wellbeing is our priority, {name}',
    'welcome.auth_subtitle': 'Every step you take towards your healing is valuable. We are here to accompany you.',
    'welcome.ready_title': 'Ready to start your healing journey?',
    'welcome.ready_subtitle': 'Join thousands of people who have found support and understanding in our community',

    // Testimonials
    'testimonials.voices': 'Voices from Our Community',
    'testimonials.what_they_say': 'What those who have found support here say',

    // Common
    'common.anonymous': 'Anonymous',
    'common.confidential': 'Confidential',
    'common.reactions_only': 'Reactions Only',
    'common.no_comments': 'No Comments',
    'common.online': 'Online',
    'common.loading': 'Loading...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
