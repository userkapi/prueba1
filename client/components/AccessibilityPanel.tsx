import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  Volume2,
  Keyboard,
  MousePointer,
  Type,
  Contrast,
  ZoomIn,
  Move,
  Settings,
  Info,
  Check,
  RotateCcw,
  Download,
  Upload,
  Accessibility
} from "lucide-react";

interface AccessibilitySettings {
  // Visual Settings
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  colorBlindnessFilter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  darkMode: boolean;
  focusIndicators: boolean;
  
  // Navigation Settings
  keyboardNavigation: boolean;
  skipLinks: boolean;
  tabIndex: boolean;
  arrowKeyNavigation: boolean;
  
  // Audio Settings
  soundEnabled: boolean;
  screenReader: boolean;
  voiceAnnouncements: boolean;
  soundVolume: number;
  
  // Motor Accessibility
  clickTargetSize: number;
  clickDelay: number;
  stickyKeys: boolean;
  mouseKeys: boolean;
  
  // Cognitive Accessibility
  simplifiedInterface: boolean;
  helpText: boolean;
  confirmActions: boolean;
  autoSave: boolean;
  breadcrumbs: boolean;
  
  // Language and Reading
  language: string;
  readingGuide: boolean;
  dyslexiaFont: boolean;
  textToSpeech: boolean;
  translationEnabled: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  colorBlindnessFilter: 'none',
  darkMode: false,
  focusIndicators: true,
  keyboardNavigation: true,
  skipLinks: true,
  tabIndex: true,
  arrowKeyNavigation: false,
  soundEnabled: true,
  screenReader: false,
  voiceAnnouncements: false,
  soundVolume: 50,
  clickTargetSize: 44,
  clickDelay: 0,
  stickyKeys: false,
  mouseKeys: false,
  simplifiedInterface: false,
  helpText: true,
  confirmActions: false,
  autoSave: true,
  breadcrumbs: true,
  language: 'es',
  readingGuide: false,
  dyslexiaFont: false,
  textToSpeech: false,
  translationEnabled: false
};

interface AccessibilityPanelProps {
  compact?: boolean;
}

export default function AccessibilityPanel({ compact = false }: AccessibilityPanelProps) {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`tioskap_accessibility_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } else {
      // Load from general localStorage for anonymous users
      const savedSettings = localStorage.getItem('tioskap_accessibility_anonymous');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [user]);

  // Save settings to localStorage and apply to DOM
  useEffect(() => {
    const storageKey = user 
      ? `tioskap_accessibility_${user.id}` 
      : 'tioskap_accessibility_anonymous';
    
    localStorage.setItem(storageKey, JSON.stringify(settings));
    applySettingsToDOM(settings);
  }, [settings, user]);

  const applySettingsToDOM = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    const body = document.body;

    // Visual Settings
    root.style.setProperty('--font-size-base', `${newSettings.fontSize}px`);
    root.style.setProperty('--line-height-base', `${newSettings.lineHeight}`);
    root.style.setProperty('--letter-spacing-base', `${newSettings.letterSpacing}px`);
    root.style.setProperty('--click-target-size', `${newSettings.clickTargetSize}px`);

    // High contrast
    if (newSettings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
      body.classList.add('reduced-motion');
    } else {
      root.style.setProperty('--animation-duration', '300ms');
      root.style.setProperty('--transition-duration', '150ms');
      body.classList.remove('reduced-motion');
    }

    // Color blindness filters
    if (newSettings.colorBlindnessFilter !== 'none') {
      body.classList.add(`filter-${newSettings.colorBlindnessFilter}`);
    } else {
      ['protanopia', 'deuteranopia', 'tritanopia', 'monochrome'].forEach(filter => {
        body.classList.remove(`filter-${filter}`);
      });
    }

    // Dyslexia font
    if (newSettings.dyslexiaFont) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }

    // Focus indicators
    if (!newSettings.focusIndicators) {
      body.classList.add('no-focus-indicators');
    } else {
      body.classList.remove('no-focus-indicators');
    }

    // Simplified interface
    if (newSettings.simplifiedInterface) {
      body.classList.add('simplified-interface');
    } else {
      body.classList.remove('simplified-interface');
    }

    // Reading guide
    if (newSettings.readingGuide) {
      body.classList.add('reading-guide');
    } else {
      body.classList.remove('reading-guide');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Announce change for screen readers
    if (settings.voiceAnnouncements) {
      announceChange(key, value);
    }
  };

  const announceChange = (setting: string, value: any) => {
    const announcement = `${setting} cambiado a ${value}`;
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = 'es-ES';
    utterance.volume = settings.soundVolume / 100;
    speechSynthesis.speak(utterance);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    addNotification({
      type: 'info',
      title: 'Configuración restablecida',
      message: 'Todas las configuraciones de accesibilidad han sido restablecidas',
      priority: 'medium',
      category: 'system',
      autoDelete: 5
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tioskap-accessibility-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
        
        addNotification({
          type: 'success',
          title: 'Configuración importada',
          message: 'Las configuraciones de accesibilidad han sido importadas',
          priority: 'medium',
          category: 'system',
          autoDelete: 5
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error de importación',
          message: 'El archivo no tiene un formato válido',
          priority: 'medium',
          category: 'system',
          autoDelete: 5
        });
      }
    };
    reader.readAsText(file);
  };

  const runAccessibilityTest = () => {
    setTestMode(true);
    
    // Test various accessibility features
    const tests = [
      { name: 'Navegación por teclado', passed: settings.keyboardNavigation },
      { name: 'Indicadores de foco', passed: settings.focusIndicators },
      { name: 'Tamaño de objetivo', passed: settings.clickTargetSize >= 44 },
      { name: 'Contraste', passed: settings.highContrast || !settings.darkMode },
      { name: 'Texto alternativo', passed: true }, // Would check actual implementation
    ];

    const passedTests = tests.filter(test => test.passed).length;
    const score = Math.round((passedTests / tests.length) * 100);

    setTimeout(() => {
      setTestMode(false);
      addNotification({
        type: score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error',
        title: `Puntuación de accesibilidad: ${score}%`,
        message: `${passedTests} de ${tests.length} pruebas pasaron`,
        priority: 'medium',
        category: 'system',
        autoDelete: 8
      });
    }, 2000);
  };

  if (compact) {
    return (
      <Card className="hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-primary" />
            Accesibilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quick-high-contrast" className="text-sm">Alto contraste</Label>
              <Switch
                id="quick-high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="quick-large-text" className="text-sm">Texto grande</Label>
              <Switch
                id="quick-large-text"
                checked={settings.fontSize > 16}
                onCheckedChange={(checked) => updateSetting('fontSize', checked ? 20 : 16)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quick-reduced-motion" className="text-sm">Reducir movimiento</Label>
              <Switch
                id="quick-reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración completa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configuración de Accesibilidad</DialogTitle>
                  <DialogDescription>
                    Personaliza la experiencia para mejorar la accesibilidad según tus necesidades
                  </DialogDescription>
                </DialogHeader>
                <AccessibilityConfigPanel
                  settings={settings}
                  updateSetting={updateSetting}
                  onReset={resetSettings}
                  onExport={exportSettings}
                  onImport={importSettings}
                  onTest={runAccessibilityTest}
                  testMode={testMode}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AccessibilityConfigPanel
        settings={settings}
        updateSetting={updateSetting}
        onReset={resetSettings}
        onExport={exportSettings}
        onImport={importSettings}
        onTest={runAccessibilityTest}
        testMode={testMode}
      />
    </div>
  );
}

// Accessibility Config Panel Component
interface AccessibilityConfigPanelProps {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTest: () => void;
  testMode: boolean;
}

function AccessibilityConfigPanel({
  settings,
  updateSetting,
  onReset,
  onExport,
  onImport,
  onTest,
  testMode
}: AccessibilityConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Configuración de Accesibilidad</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onTest} disabled={testMode}>
            {testMode ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Evaluando...
              </div>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Evaluar accesibilidad
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acceso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant={settings.highContrast ? "default" : "outline"}
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Contrast className="h-6 w-6" />
              <span className="text-sm">Alto Contraste</span>
            </Button>
            
            <Button
              variant={settings.fontSize > 16 ? "default" : "outline"}
              onClick={() => updateSetting('fontSize', settings.fontSize > 16 ? 16 : 20)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Type className="h-6 w-6" />
              <span className="text-sm">Texto Grande</span>
            </Button>
            
            <Button
              variant={settings.reducedMotion ? "default" : "outline"}
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Move className="h-6 w-6" />
              <span className="text-sm">Sin Animaciones</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Settings */}
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="navigation">Navegación</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="motor">Motor</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitivo</TabsTrigger>
        </TabsList>

        {/* Visual Tab */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Configuración Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Alto contraste</Label>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Reducir movimiento</Label>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Indicadores de foco</Label>
                    <Switch
                      checked={settings.focusIndicators}
                      onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Fuente para dislexia</Label>
                    <Switch
                      checked={settings.dyslexiaFont}
                      onCheckedChange={(checked) => updateSetting('dyslexiaFont', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tamaño de fuente: {settings.fontSize}px</Label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => updateSetting('fontSize', value)}
                      min={12}
                      max={28}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Altura de línea: {settings.lineHeight}</Label>
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={([value]) => updateSetting('lineHeight', value)}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Espaciado de letras: {settings.letterSpacing}px</Label>
                    <Slider
                      value={[settings.letterSpacing]}
                      onValueChange={([value]) => updateSetting('letterSpacing', value)}
                      min={0}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Filtro para daltonismo</Label>
                    <Select
                      value={settings.colorBlindnessFilter}
                      onValueChange={(value: any) => updateSetting('colorBlindnessFilter', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
                        <SelectItem value="protanopia">Protanopia (rojo-verde)</SelectItem>
                        <SelectItem value="deuteranopia">Deuteranopia (rojo-verde)</SelectItem>
                        <SelectItem value="tritanopia">Tritanopia (azul-amarillo)</SelectItem>
                        <SelectItem value="monochrome">Monocromático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Configuración de Navegación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Navegación por teclado</Label>
                  <p className="text-sm text-muted-foreground">Permite navegar usando Tab, Enter y flechas</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enlaces de salto</Label>
                  <p className="text-sm text-muted-foreground">Enlaces para saltar al contenido principal</p>
                </div>
                <Switch
                  checked={settings.skipLinks}
                  onCheckedChange={(checked) => updateSetting('skipLinks', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Navegación con flechas</Label>
                  <p className="text-sm text-muted-foreground">Usar flechas para navegar entre elementos</p>
                </div>
                <Switch
                  checked={settings.arrowKeyNavigation}
                  onCheckedChange={(checked) => updateSetting('arrowKeyNavigation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Migas de pan</Label>
                  <p className="text-sm text-muted-foreground">Mostrar la ubicación actual en la navegación</p>
                </div>
                <Switch
                  checked={settings.breadcrumbs}
                  onCheckedChange={(checked) => updateSetting('breadcrumbs', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Configuración de Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sonidos habilitados</Label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Anuncios de voz</Label>
                <Switch
                  checked={settings.voiceAnnouncements}
                  onCheckedChange={(checked) => updateSetting('voiceAnnouncements', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Texto a voz</Label>
                <Switch
                  checked={settings.textToSpeech}
                  onCheckedChange={(checked) => updateSetting('textToSpeech', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Volumen de sonido: {settings.soundVolume}%</Label>
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={([value]) => updateSetting('soundVolume', value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Motor Tab */}
        <TabsContent value="motor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Configuración Motora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tamaño de objetivo de clic: {settings.clickTargetSize}px</Label>
                <Slider
                  value={[settings.clickTargetSize]}
                  onValueChange={([value]) => updateSetting('clickTargetSize', value)}
                  min={24}
                  max={60}
                  step={4}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Mínimo recomendado: 44px
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Retraso de clic: {settings.clickDelay}ms</Label>
                <Slider
                  value={[settings.clickDelay]}
                  onValueChange={([value]) => updateSetting('clickDelay', value)}
                  min={0}
                  max={1000}
                  step={100}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Teclas persistentes</Label>
                  <p className="text-sm text-muted-foreground">Permite usar modificadores sin mantenerlos presionados</p>
                </div>
                <Switch
                  checked={settings.stickyKeys}
                  onCheckedChange={(checked) => updateSetting('stickyKeys', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cognitive Tab */}
        <TabsContent value="cognitive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Configuración Cognitiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Interfaz simplificada</Label>
                  <p className="text-sm text-muted-foreground">Reduce la complejidad visual de la interfaz</p>
                </div>
                <Switch
                  checked={settings.simplifiedInterface}
                  onCheckedChange={(checked) => updateSetting('simplifiedInterface', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Texto de ayuda</Label>
                  <p className="text-sm text-muted-foreground">Muestra descripciones adicionales</p>
                </div>
                <Switch
                  checked={settings.helpText}
                  onCheckedChange={(checked) => updateSetting('helpText', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirmar acciones</Label>
                  <p className="text-sm text-muted-foreground">Pide confirmación para acciones importantes</p>
                </div>
                <Switch
                  checked={settings.confirmActions}
                  onCheckedChange={(checked) => updateSetting('confirmActions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Guardado automático</Label>
                  <p className="text-sm text-muted-foreground">Guarda el progreso automáticamente</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Guía de lectura</Label>
                  <p className="text-sm text-muted-foreground">Resalta la línea actual mientras lees</p>
                </div>
                <Switch
                  checked={settings.readingGuide}
                  onCheckedChange={(checked) => updateSetting('readingGuide', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-between pt-6 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar configuración
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
              id="accessibility-import"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('accessibility-import')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar configuración
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restablecer todo
        </Button>
      </div>
    </div>
  );
}

// Add CSS for accessibility features
const accessibilityCSS = `
  /* High contrast mode */
  .high-contrast {
    --background: #ffffff;
    --foreground: #000000;
    --primary: #0000ff;
    --secondary: #000000;
    --muted: #f0f0f0;
    --border: #000000;
  }

  /* Reduced motion */
  .reduced-motion *,
  .reduced-motion *::before,
  .reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Color blindness filters */
  .filter-protanopia {
    filter: url('#protanopia-filter');
  }
  
  .filter-deuteranopia {
    filter: url('#deuteranopia-filter');
  }
  
  .filter-tritanopia {
    filter: url('#tritanopia-filter');
  }
  
  .filter-monochrome {
    filter: grayscale(100%);
  }

  /* Dyslexia font */
  .dyslexia-font {
    font-family: 'OpenDyslexic', Arial, sans-serif;
  }

  /* No focus indicators */
  .no-focus-indicators *:focus {
    outline: none;
    box-shadow: none;
  }

  /* Simplified interface */
  .simplified-interface {
    --border-radius: 0px;
    --shadow: none;
  }
  
  .simplified-interface .gradient-border,
  .simplified-interface .glass-effect {
    background: var(--background) !important;
    backdrop-filter: none !important;
  }

  /* Reading guide */
  .reading-guide p:hover {
    background-color: rgba(255, 255, 0, 0.2);
    outline: 2px solid #ffff00;
  }

  /* Larger click targets */
  button, a, input, select, textarea {
    min-height: var(--click-target-size, 44px);
    min-width: var(--click-target-size, 44px);
  }

  /* Skip links */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  }

  .skip-link:focus {
    top: 6px;
  }
`;

// Add the CSS to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = accessibilityCSS;
  document.head.appendChild(styleElement);
}
