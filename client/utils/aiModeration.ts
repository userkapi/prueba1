// AI-powered content moderation system for TIOSKAP
// Detects inappropriate content, spam, crisis situations, and toxic behavior

export interface ModerationResult {
  isApproved: boolean;
  confidence: number;
  flags: ModerationFlag[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: ModerationAction;
  explanation: string;
  autoModerated: boolean;
}

export interface ModerationFlag {
  type: FlagType;
  confidence: number;
  evidence: string[];
  description: string;
}

export type FlagType = 
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'self_harm'
  | 'suicide_ideation'
  | 'violence'
  | 'adult_content'
  | 'misinformation'
  | 'off_topic'
  | 'excessive_caps'
  | 'repeated_content'
  | 'fake_profile'
  | 'solicitation';

export type ModerationAction = 
  | 'approve'
  | 'flag_for_review'
  | 'auto_hide'
  | 'auto_remove'
  | 'escalate_crisis'
  | 'require_edit'
  | 'warn_user'
  | 'suspend_user';

interface ModerationConfig {
  enabled: boolean;
  autoModerationEnabled: boolean;
  strictMode: boolean;
  crisisDetectionEnabled: boolean;
  allowAnonymous: boolean;
  flagThresholds: {
    [key in FlagType]: number;
  };
  actionThresholds: {
    autoHide: number;
    autoRemove: number;
    escalateCrisis: number;
    requireReview: number;
  };
}

const DEFAULT_CONFIG: ModerationConfig = {
  enabled: true,
  autoModerationEnabled: true,
  strictMode: false,
  crisisDetectionEnabled: true,
  allowAnonymous: true,
  flagThresholds: {
    spam: 0.7,
    harassment: 0.6,
    hate_speech: 0.5,
    self_harm: 0.4,
    suicide_ideation: 0.3,
    violence: 0.6,
    adult_content: 0.8,
    misinformation: 0.7,
    off_topic: 0.8,
    excessive_caps: 0.9,
    repeated_content: 0.8,
    fake_profile: 0.7,
    solicitation: 0.6
  },
  actionThresholds: {
    autoHide: 0.8,
    autoRemove: 0.9,
    escalateCrisis: 0.4,
    requireReview: 0.6
  }
};

// Crisis keywords with different severity levels
const CRISIS_KEYWORDS = {
  critical: [
    'suicidarme', 'matarme', 'acabar con todo', 'no quiero vivir', 'quiero morir',
    'plan de suicidio', 'pastillas para morir', 'manera de suicidarme',
    'hora de despedirme', 'última vez', 'no aguanto más'
  ],
  high: [
    'suicidio', 'autolesión', 'cortarme', 'lastimarme', 'hacerme daño',
    'no sirvo para nada', 'soy una carga', 'todos estarían mejor sin mí',
    'no hay esperanza', 'no hay salida', 'estoy perdido'
  ],
  medium: [
    'deprimido', 'desesperado', 'sin salida', 'no puedo más', 'agotado',
    'vacío', 'solo', 'abandonado', 'inútil', 'fracaso'
  ]
};

// Toxic content patterns
const TOXIC_PATTERNS = {
  harassment: [
    /eres un(a)?\s+(idiota|estúpid[oa]|imbécil)/gi,
    /vete a la mierda/gi,
    /nadie te quiere/gi,
    /deberías morirte/gi,
    /no sirves para nada/gi
  ],
  hate_speech: [
    /palabras de odio por raza/gi,
    /palabras de odio por género/gi,
    /palabras de odio por orientación/gi,
    /palabras de odio por religión/gi
  ],
  spam: [
    /compra ahora/gi,
    /visita mi perfil/gi,
    /gana dinero fácil/gi,
    /click aquí/gi,
    /(www\.|http)/gi
  ]
};

// Caps detection
const EXCESSIVE_CAPS_THRESHOLD = 0.7; // 70% of text in caps

export class AIModerationSystem {
  private config: ModerationConfig;
  private userHistory: Map<string, UserModerationHistory> = new Map();

  constructor(config: Partial<ModerationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async moderateContent(
    content: string, 
    userId: string, 
    contentType: 'story' | 'comment' | 'message' | 'profile' = 'story'
  ): Promise<ModerationResult> {
    if (!this.config.enabled) {
      return {
        isApproved: true,
        confidence: 1,
        flags: [],
        severity: 'low',
        suggestedAction: 'approve',
        explanation: 'Moderation disabled',
        autoModerated: false
      };
    }

    const flags = await this.analyzeContent(content, userId, contentType);
    const severity = this.calculateSeverity(flags);
    const action = this.determineAction(flags, severity);
    const confidence = this.calculateConfidence(flags);

    const result: ModerationResult = {
      isApproved: action === 'approve',
      confidence,
      flags,
      severity,
      suggestedAction: action,
      explanation: this.generateExplanation(flags, action),
      autoModerated: this.config.autoModerationEnabled && confidence > 0.8
    };

    // Update user history
    this.updateUserHistory(userId, result);

    // Log for analytics
    this.logModerationEvent(userId, contentType, result);

    return result;
  }

  private async analyzeContent(
    content: string,
    userId: string,
    contentType: string
  ): Promise<ModerationFlag[]> {
    const flags: ModerationFlag[] = [];
    const lowerContent = content.toLowerCase();

    // Crisis detection
    if (this.config.crisisDetectionEnabled) {
      const crisisFlags = this.detectCrisis(content);
      flags.push(...crisisFlags);
    }

    // Spam detection
    const spamFlag = this.detectSpam(content, userId);
    if (spamFlag) flags.push(spamFlag);

    // Toxic content detection
    const toxicFlags = this.detectToxicContent(content);
    flags.push(...toxicFlags);

    // Caps detection
    const capsFlag = this.detectExcessiveCaps(content);
    if (capsFlag) flags.push(capsFlag);

    // Repeated content detection
    const repeatedFlag = this.detectRepeatedContent(content, userId);
    if (repeatedFlag) flags.push(repeatedFlag);

    // Off-topic detection (basic implementation)
    const offTopicFlag = this.detectOffTopic(content, contentType);
    if (offTopicFlag) flags.push(offTopicFlag);

    return flags.filter(flag => flag.confidence >= this.config.flagThresholds[flag.type]);
  }

  private detectCrisis(content: string): ModerationFlag[] {
    const flags: ModerationFlag[] = [];
    const lowerContent = content.toLowerCase();

    // Check for critical crisis keywords
    const criticalMatches = CRISIS_KEYWORDS.critical.filter(keyword => 
      lowerContent.includes(keyword)
    );

    if (criticalMatches.length > 0) {
      flags.push({
        type: 'suicide_ideation',
        confidence: 0.95,
        evidence: criticalMatches,
        description: 'Contenido indica ideación suicida inmediata - requiere intervención urgente'
      });
    }

    // Check for high-risk keywords
    const highMatches = CRISIS_KEYWORDS.high.filter(keyword => 
      lowerContent.includes(keyword)
    );

    if (highMatches.length > 0) {
      const confidence = Math.min(0.9, 0.5 + (highMatches.length * 0.1));
      flags.push({
        type: 'self_harm',
        confidence,
        evidence: highMatches,
        description: 'Contenido sugiere riesgo de autolesión - requiere revisión'
      });
    }

    // Check for medium-risk keywords (multiple matches increase confidence)
    const mediumMatches = CRISIS_KEYWORDS.medium.filter(keyword => 
      lowerContent.includes(keyword)
    );

    if (mediumMatches.length >= 3) {
      flags.push({
        type: 'self_harm',
        confidence: 0.4 + (mediumMatches.length * 0.05),
        evidence: mediumMatches,
        description: 'Múltiples indicadores de angustia emocional'
      });
    }

    return flags;
  }

  private detectSpam(content: string, userId: string): ModerationFlag | null {
    let spamScore = 0;
    const evidence: string[] = [];

    // Check for spam patterns
    for (const pattern of TOXIC_PATTERNS.spam) {
      if (pattern.test(content)) {
        spamScore += 0.3;
        evidence.push(`Patrón de spam detectado: ${pattern.source}`);
      }
    }

    // Check for excessive links
    const linkCount = (content.match(/(http|www\.)/gi) || []).length;
    if (linkCount > 2) {
      spamScore += linkCount * 0.2;
      evidence.push(`Múltiples enlaces detectados: ${linkCount}`);
    }

    // Check for repeated characters
    if (/(.)\1{4,}/.test(content)) {
      spamScore += 0.2;
      evidence.push('Caracteres repetidos excesivamente');
    }

    // Check user history for spam patterns
    const userHistory = this.userHistory.get(userId);
    if (userHistory && userHistory.recentSpamFlags > 2) {
      spamScore += 0.3;
      evidence.push('Historial reciente de spam');
    }

    if (spamScore >= 0.5) {
      return {
        type: 'spam',
        confidence: Math.min(spamScore, 1),
        evidence,
        description: 'Contenido identificado como posible spam'
      };
    }

    return null;
  }

  private detectToxicContent(content: string): ModerationFlag[] {
    const flags: ModerationFlag[] = [];

    // Check for harassment patterns
    const harassmentMatches: string[] = [];
    for (const pattern of TOXIC_PATTERNS.harassment) {
      const matches = content.match(pattern);
      if (matches) {
        harassmentMatches.push(...matches);
      }
    }

    if (harassmentMatches.length > 0) {
      flags.push({
        type: 'harassment',
        confidence: Math.min(0.9, 0.5 + (harassmentMatches.length * 0.2)),
        evidence: harassmentMatches,
        description: 'Contenido contiene lenguaje de acoso o intimidación'
      });
    }

    // Check for hate speech patterns
    const hateSpeechMatches: string[] = [];
    for (const pattern of TOXIC_PATTERNS.hate_speech) {
      const matches = content.match(pattern);
      if (matches) {
        hateSpeechMatches.push(...matches);
      }
    }

    if (hateSpeechMatches.length > 0) {
      flags.push({
        type: 'hate_speech',
        confidence: 0.85,
        evidence: hateSpeechMatches,
        description: 'Contenido contiene discurso de odio'
      });
    }

    return flags;
  }

  private detectExcessiveCaps(content: string): ModerationFlag | null {
    const letters = content.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    if (letters.length < 10) return null; // Too short to analyze

    const capsCount = (content.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length;
    const capsRatio = capsCount / letters.length;

    if (capsRatio >= EXCESSIVE_CAPS_THRESHOLD) {
      return {
        type: 'excessive_caps',
        confidence: Math.min(capsRatio, 1),
        evidence: [`${Math.round(capsRatio * 100)}% del texto en mayúsculas`],
        description: 'Uso excesivo de mayúsculas (puede interpretarse como gritos)'
      };
    }

    return null;
  }

  private detectRepeatedContent(content: string, userId: string): ModerationFlag | null {
    const userHistory = this.userHistory.get(userId);
    if (!userHistory) return null;

    const similarContent = userHistory.recentContent.find(historical => 
      this.calculateTextSimilarity(content, historical) > 0.8
    );

    if (similarContent) {
      return {
        type: 'repeated_content',
        confidence: 0.9,
        evidence: ['Contenido muy similar a publicación anterior'],
        description: 'Usuario ha publicado contenido muy similar recientemente'
      };
    }

    return null;
  }

  private detectOffTopic(content: string, contentType: string): ModerationFlag | null {
    // Basic off-topic detection - can be enhanced with ML
    const mentalHealthKeywords = [
      'ansiedad', 'depresión', 'estrés', 'terapia', 'bienestar', 'emociones',
      'sentimientos', 'apoyo', 'ayuda', 'salud mental', 'psicología'
    ];

    const lowerContent = content.toLowerCase();
    const hasRelevantKeywords = mentalHealthKeywords.some(keyword => 
      lowerContent.includes(keyword)
    );

    // Check for clearly off-topic content
    const offTopicIndicators = [
      'compra', 'venta', 'precio', 'oferta', 'descuento', 'promoción',
      'política', 'partido', 'elecciones', 'gobierno',
      'deportes', 'fútbol', 'partido', 'equipo'
    ];

    const hasOffTopicContent = offTopicIndicators.some(indicator => 
      lowerContent.includes(indicator)
    );

    if (hasOffTopicContent && !hasRelevantKeywords && content.length > 50) {
      return {
        type: 'off_topic',
        confidence: 0.7,
        evidence: ['Contenido no relacionado con salud mental'],
        description: 'El contenido parece no estar relacionado con el tema del grupo'
      };
    }

    return null;
  }

  private calculateSeverity(flags: ModerationFlag[]): ModerationResult['severity'] {
    if (flags.length === 0) return 'low';

    const hasCriticalFlags = flags.some(flag => 
      ['suicide_ideation', 'self_harm', 'violence'].includes(flag.type) && flag.confidence > 0.7
    );

    if (hasCriticalFlags) return 'critical';

    const hasHighFlags = flags.some(flag => 
      ['harassment', 'hate_speech'].includes(flag.type) && flag.confidence > 0.6
    );

    if (hasHighFlags) return 'high';

    const hasMediumFlags = flags.some(flag => flag.confidence > 0.5);
    return hasMediumFlags ? 'medium' : 'low';
  }

  private determineAction(flags: ModerationFlag[], severity: ModerationResult['severity']): ModerationAction {
    if (flags.length === 0) return 'approve';

    // Crisis content always escalates
    const hasCrisisContent = flags.some(flag => 
      ['suicide_ideation', 'self_harm'].includes(flag.type)
    );

    if (hasCrisisContent) return 'escalate_crisis';

    // Calculate overall confidence
    const maxConfidence = Math.max(...flags.map(f => f.confidence));

    if (maxConfidence >= this.config.actionThresholds.autoRemove) {
      return 'auto_remove';
    }

    if (maxConfidence >= this.config.actionThresholds.autoHide) {
      return 'auto_hide';
    }

    if (maxConfidence >= this.config.actionThresholds.requireReview) {
      return 'flag_for_review';
    }

    if (severity === 'medium' || severity === 'high') {
      return 'warn_user';
    }

    return 'approve';
  }

  private calculateConfidence(flags: ModerationFlag[]): number {
    if (flags.length === 0) return 1; // High confidence in approval

    // Calculate weighted confidence based on flag types and their individual confidences
    let totalWeight = 0;
    let weightedSum = 0;

    for (const flag of flags) {
      const weight = this.getFlagWeight(flag.type);
      totalWeight += weight;
      weightedSum += flag.confidence * weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private getFlagWeight(flagType: FlagType): number {
    const weights: Record<FlagType, number> = {
      'suicide_ideation': 3.0,
      'self_harm': 2.5,
      'violence': 2.0,
      'harassment': 1.8,
      'hate_speech': 1.8,
      'spam': 1.0,
      'adult_content': 1.5,
      'misinformation': 1.3,
      'off_topic': 0.5,
      'excessive_caps': 0.3,
      'repeated_content': 0.8,
      'fake_profile': 1.2,
      'solicitation': 1.0
    };

    return weights[flagType] || 1.0;
  }

  private generateExplanation(flags: ModerationFlag[], action: ModerationAction): string {
    if (flags.length === 0) {
      return 'Contenido aprobado sin problemas detectados';
    }

    const flagDescriptions = flags.map(flag => flag.description).join('; ');
    
    const actionExplanations: Record<ModerationAction, string> = {
      'approve': 'Contenido aprobado con alertas menores',
      'flag_for_review': 'Contenido marcado para revisión manual',
      'auto_hide': 'Contenido ocultado automáticamente',
      'auto_remove': 'Contenido removido automáticamente',
      'escalate_crisis': 'Situación de crisis detectada - escalando a equipo de crisis',
      'require_edit': 'Contenido requiere edición antes de publicación',
      'warn_user': 'Usuario será advertido sobre el contenido',
      'suspend_user': 'Usuario será suspendido temporalmente'
    };

    return `${flagDescriptions}. Acción: ${actionExplanations[action]}`;
  }

  private updateUserHistory(userId: string, result: ModerationResult): void {
    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, {
        recentContent: [],
        recentSpamFlags: 0,
        totalFlags: 0,
        lastFlaggedAt: null,
        warningCount: 0,
        suspensionCount: 0
      });
    }

    const history = this.userHistory.get(userId)!;
    
    // Update recent content (keep last 10)
    if (result.isApproved) {
      history.recentContent.push(result.explanation);
      if (history.recentContent.length > 10) {
        history.recentContent.shift();
      }
    }

    // Update flag counts
    if (result.flags.length > 0) {
      history.totalFlags += result.flags.length;
      history.lastFlaggedAt = new Date();
      
      const hasSpamFlag = result.flags.some(flag => flag.type === 'spam');
      if (hasSpamFlag) {
        history.recentSpamFlags += 1;
      }
    }

    // Update action counts
    if (result.suggestedAction === 'warn_user') {
      history.warningCount += 1;
    } else if (result.suggestedAction === 'suspend_user') {
      history.suspensionCount += 1;
    }
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple similarity calculation - can be enhanced with more sophisticated algorithms
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return commonWords.length / totalWords;
  }

  private logModerationEvent(userId: string, contentType: string, result: ModerationResult): void {
    // Log moderation events for analytics and improvement
    const logEntry = {
      timestamp: new Date(),
      userId,
      contentType,
      result,
      config: this.config
    };

    // In a real application, this would be sent to a logging service
    console.log('Moderation Event:', logEntry);
  }

  // Public methods for configuration and management
  public updateConfig(newConfig: Partial<ModerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): ModerationConfig {
    return { ...this.config };
  }

  public getUserHistory(userId: string): UserModerationHistory | null {
    return this.userHistory.get(userId) || null;
  }

  public clearUserHistory(userId: string): void {
    this.userHistory.delete(userId);
  }

  public getSystemStats(): ModerationStats {
    const totalUsers = this.userHistory.size;
    const totalFlags = Array.from(this.userHistory.values())
      .reduce((sum, history) => sum + history.totalFlags, 0);
    
    const flaggedUsers = Array.from(this.userHistory.values())
      .filter(history => history.totalFlags > 0).length;

    return {
      totalUsers,
      totalFlags,
      flaggedUsers,
      flaggedUserPercentage: totalUsers > 0 ? (flaggedUsers / totalUsers) * 100 : 0,
      configVersion: '1.0.0'
    };
  }
}

interface UserModerationHistory {
  recentContent: string[];
  recentSpamFlags: number;
  totalFlags: number;
  lastFlaggedAt: Date | null;
  warningCount: number;
  suspensionCount: number;
}

interface ModerationStats {
  totalUsers: number;
  totalFlags: number;
  flaggedUsers: number;
  flaggedUserPercentage: number;
  configVersion: string;
}

// Export singleton instance
export const aiModerationSystem = new AIModerationSystem();

// Utility functions for common moderation tasks
export const moderateStory = async (content: string, userId: string) => {
  return await aiModerationSystem.moderateContent(content, userId, 'story');
};

export const moderateComment = async (content: string, userId: string) => {
  return await aiModerationSystem.moderateContent(content, userId, 'comment');
};

export const moderateMessage = async (content: string, userId: string) => {
  return await aiModerationSystem.moderateContent(content, userId, 'message');
};

export const moderateProfile = async (content: string, userId: string) => {
  return await aiModerationSystem.moderateContent(content, userId, 'profile');
};
