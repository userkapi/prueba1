// Crisis detection utilities
export interface CrisisKeywords {
  critical: string[];
  high: string[];
  medium: string[];
}

export const crisisKeywords: CrisisKeywords = {
  critical: [
    // Suicidal ideation - Spanish
    'me quiero matar',
    'quiero matarme',
    'voy a suicidarme',
    'me voy a suicidar',
    'quiero morir',
    'no quiero vivir',
    'mejor muerto',
    'acabar con todo',
    'terminar con todo',
    'quitarme la vida',
    'ya no aguanto',
    'no vale la pena vivir',
    'prefiero estar muerto',
    'se acabó todo',
    
    // Suicidal ideation - English
    'want to kill myself',
    'going to kill myself',
    'want to die',
    'better off dead',
    'end it all',
    'take my life',
    'commit suicide',
    'not worth living',
    'can\'t go on',
    'rather be dead',
    
    // Self-harm indicators
    'me voy a lastimar',
    'quiero lastimarme',
    'voy a hacerme daño',
    'cortarme',
    'hurt myself',
    'harm myself',
    'cut myself'
  ],
  
  high: [
    // Depression and hopelessness - Spanish
    'no hay esperanza',
    'todo está perdido',
    'soy una carga',
    'nadie me quiere',
    'estoy solo',
    'no sirvo para nada',
    'soy un fracaso',
    'ya no puedo más',
    'estoy cansado de vivir',
    'no tiene sentido',
    
    // Depression and hopelessness - English
    'no hope',
    'nothing matters',
    'I\'m a burden',
    'nobody loves me',
    'completely alone',
    'worthless',
    'total failure',
    'can\'t take it',
    'tired of living',
    'no point',
    
    // Substance abuse indicators
    'demasiado alcohol',
    'muchas drogas',
    'pastillas para dormir',
    'too much alcohol',
    'too many drugs',
    'sleeping pills'
  ],
  
  medium: [
    // General distress - Spanish
    'muy deprimido',
    'muy triste',
    'sin energía',
    'no duermo',
    'no como',
    'me siento vacío',
    'todo mal',
    'no puedo seguir',
    
    // General distress - English
    'very depressed',
    'extremely sad',
    'no energy',
    'can\'t sleep',
    'can\'t eat',
    'feel empty',
    'everything wrong',
    'can\'t continue'
  ]
};

export interface CrisisAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
  requiresAlert: boolean;
  recommendedAction: string;
}

export function analyzeCrisisContent(message: string): CrisisAnalysis {
  const lowerMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  // Check for critical keywords
  for (const keyword of crisisKeywords.critical) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
      severity = 'critical';
    }
  }
  
  // Check for high severity keywords (only if not already critical)
  if (severity !== 'critical') {
    for (const keyword of crisisKeywords.high) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
        severity = 'high';
      }
    }
  }
  
  // Check for medium severity keywords (only if not already high or critical)
  if (severity !== 'critical' && severity !== 'high') {
    for (const keyword of crisisKeywords.medium) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
        severity = 'medium';
      }
    }
  }
  
  const requiresAlert = severity === 'critical' || severity === 'high';
  
  let recommendedAction = '';
  switch (severity) {
    case 'critical':
      recommendedAction = 'Contacto inmediato con servicios de emergencia. Monitoreo continuo del usuario.';
      break;
    case 'high':
      recommendedAction = 'Contacto urgente con el usuario. Derivación a profesional de salud mental.';
      break;
    case 'medium':
      recommendedAction = 'Seguimiento cercano. Ofrecer recursos de apoyo.';
      break;
    default:
      recommendedAction = 'Monitoreo normal. Continuar con apoyo empático.';
  }
  
  return {
    severity,
    keywords: foundKeywords,
    requiresAlert,
    recommendedAction
  };
}

export async function createCrisisAlert(
  userId: string, 
  username: string, 
  message: string, 
  analysis: CrisisAnalysis
): Promise<void> {
  const alertId = `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const alert = {
    id: alertId,
    userId,
    username,
    message,
    timestamp: new Date(),
    severity: analysis.severity === 'critical' ? 'critical' : 'high',
    status: 'pending',
    keywords: analysis.keywords,
    recommendedAction: analysis.recommendedAction
  };
  
  // Save to localStorage (in a real app, this would be sent to the server)
  const existingAlerts = JSON.parse(localStorage.getItem('tioskap_crisis_alerts') || '[]');
  existingAlerts.push(alert);
  localStorage.setItem('tioskap_crisis_alerts', JSON.stringify(existingAlerts));
  
  // In a real application, you would also:
  // - Send immediate notification to administrators
  // - Log the alert in server-side database
  // - Trigger automated response protocols
  // - Send SMS/email alerts to crisis response team
  
  console.log('🚨 CRISIS ALERT CREATED:', alert);
}

export function getCrisisResources(): { emergency: any[]; support: any[] } {
  return {
    emergency: [
      {
        name: 'Línea Nacional de Prevención del Suicidio',
        phone: '113',
        available: '24/7',
        description: 'Atención inmediata para crisis suicidas'
      },
      {
        name: 'Servicios de Emergencia',
        phone: '911',
        available: '24/7',
        description: 'Para emergencias médicas o de seguridad'
      },
      {
        name: 'Cruz Roja',
        phone: '132',
        available: '24/7',
        description: 'Primeros auxilios psicológicos'
      }
    ],
    support: [
      {
        name: 'Línea de Escucha',
        phone: '106',
        available: '24/7',
        description: 'Apoyo emocional y contención'
      },
      {
        name: 'Centro de Asistencia al Suicida',
        phone: '(011) 5275-1135',
        available: 'Lun-Vie 10-20hs',
        description: 'Asesoramiento especializado'
      }
    ]
  };
}
