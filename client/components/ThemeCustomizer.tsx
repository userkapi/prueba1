import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContextDatabase";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Palette,
  Type,
  Layout,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Contrast,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  Settings
} from "lucide-react";

interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
    therapeutic: string;
    comfort: string;
    warm: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
  };
  layout: {
    borderRadius: number;
    spacing: number;
    containerWidth: string;
    sidebarWidth: number;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: number;
    focusRing: boolean;
  };
  effects: {
    animations: boolean;
    blur: boolean;
    shadows: boolean;
    gradients: boolean;
  };
}

const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: 'TIOSKAP Original',
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      background: '#FFFFFF',
      foreground: '#1F2937',
      accent: '#F59E0B',
      muted: '#F3F4F6',
      border: '#E5E7EB',
      therapeutic: '#E0F2FE',
      comfort: '#FEF3C7',
      warm: '#FDF2F8'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 1.6,
      fontWeight: 400
    },
    layout: {
      borderRadius: 8,
      spacing: 16,
      containerWidth: '1200px',
      sidebarWidth: 280
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: 16,
      focusRing: true
    },
    effects: {
      animations: true,
      blur: true,
      shadows: true,
      gradients: true
    }
  },
  {
    id: 'dark',
    name: 'Modo Nocturno',
    colors: {
      primary: '#A78BFA',
      secondary: '#22D3EE',
      background: '#111827',
      foreground: '#F9FAFB',
      accent: '#FBBF24',
      muted: '#374151',
      border: '#4B5563',
      therapeutic: '#1E3A8A',
      comfort: '#92400E',
      warm: '#7C2D12'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 1.6,
      fontWeight: 400
    },
    layout: {
      borderRadius: 8,
      spacing: 16,
      containerWidth: '1200px',
      sidebarWidth: 280
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: 16,
      focusRing: true
    },
    effects: {
      animations: true,
      blur: true,
      shadows: true,
      gradients: true
    }
  },
  {
    id: 'accessibility',
    name: 'Alto Contraste',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      background: '#FFFFFF',
      foreground: '#000000',
      accent: '#0000FF',
      muted: '#F0F0F0',
      border: '#000000',
      therapeutic: '#E6F3FF',
      comfort: '#FFF5E6',
      warm: '#FFE6F3'
    },
    typography: {
      fontFamily: 'Arial',
      fontSize: 18,
      lineHeight: 1.8,
      fontWeight: 600
    },
    layout: {
      borderRadius: 4,
      spacing: 20,
      containerWidth: '1000px',
      sidebarWidth: 320
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      fontSize: 18,
      focusRing: true
    },
    effects: {
      animations: false,
      blur: false,
      shadows: false,
      gradients: false
    }
  },
  {
    id: 'calm',
    name: 'Serenidad',
    colors: {
      primary: '#059669',
      secondary: '#0891B2',
      background: '#F0FDF4',
      foreground: '#065F46',
      accent: '#D97706',
      muted: '#ECFDF5',
      border: '#BBF7D0',
      therapeutic: '#DCFCE7',
      comfort: '#FEF3C7',
      warm: '#FDF2F8'
    },
    typography: {
      fontFamily: 'Georgia',
      fontSize: 16,
      lineHeight: 1.7,
      fontWeight: 400
    },
    layout: {
      borderRadius: 12,
      spacing: 18,
      containerWidth: '1100px',
      sidebarWidth: 300
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: 16,
      focusRing: true
    },
    effects: {
      animations: true,
      blur: true,
      shadows: true,
      gradients: true
    }
  }
];

interface ThemeCustomizerProps {
  compact?: boolean;
}

export default function ThemeCustomizer({ compact = false }: ThemeCustomizerProps) {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const { addNotification } = useNotifications();
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFAULT_THEMES[0]);
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load custom themes from localStorage
  useEffect(() => {
    if (user) {
      const savedThemes = localStorage.getItem(`tioskap_themes_${user.id}`);
      if (savedThemes) {
        setCustomThemes(JSON.parse(savedThemes));
      }

      const savedCurrentTheme = localStorage.getItem(`tioskap_current_theme_${user.id}`);
      if (savedCurrentTheme) {
        setCurrentTheme(JSON.parse(savedCurrentTheme));
      }
    }
  }, [user]);

  // Save themes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tioskap_themes_${user.id}`, JSON.stringify(customThemes));
      localStorage.setItem(`tioskap_current_theme_${user.id}`, JSON.stringify(currentTheme));
    }
  }, [customThemes, currentTheme, user]);

  // Apply theme to CSS variables
  useEffect(() => {
    if (previewMode || currentTheme.id !== 'default') {
      applyThemeToCSS(currentTheme);
    }
  }, [currentTheme, previewMode]);

  const applyThemeToCSS = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-family', themeConfig.typography.fontFamily);
    root.style.setProperty('--font-size', `${themeConfig.typography.fontSize}px`);
    root.style.setProperty('--line-height', `${themeConfig.typography.lineHeight}`);
    root.style.setProperty('--font-weight', `${themeConfig.typography.fontWeight}`);

    // Apply layout
    root.style.setProperty('--border-radius', `${themeConfig.layout.borderRadius}px`);
    root.style.setProperty('--spacing', `${themeConfig.layout.spacing}px`);
    root.style.setProperty('--container-width', themeConfig.layout.containerWidth);
    root.style.setProperty('--sidebar-width', `${themeConfig.layout.sidebarWidth}px`);

    // Apply accessibility
    if (themeConfig.accessibility.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
    } else {
      root.style.setProperty('--animation-duration', '300ms');
    }

    // Apply effects
    if (!themeConfig.effects.blur) {
      root.style.setProperty('--blur', 'none');
    }
    if (!themeConfig.effects.shadows) {
      root.style.setProperty('--shadow', 'none');
    }
  };

  const saveCustomTheme = () => {
    const name = prompt('Nombre para tu tema personalizado:');
    if (!name) return;

    const newTheme: ThemeConfig = {
      ...currentTheme,
      id: `custom_${Date.now()}`,
      name
    };

    setCustomThemes(prev => [newTheme, ...prev].slice(0, 10)); // Keep only 10 custom themes

    addNotification({
      type: 'success',
      title: '🎨 Tema guardado',
      message: `Tu tema "${name}" ha sido guardado`,
      priority: 'medium',
      category: 'achievement',
      autoDelete: 5
    });
  };

  const loadTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    addNotification({
      type: 'info',
      title: 'Tema aplicado',
      message: `Tema "${theme.name}" aplicado correctamente`,
      priority: 'low',
      category: 'system',
      autoDelete: 3
    });
  };

  const resetToDefault = () => {
    setCurrentTheme(DEFAULT_THEMES[0]);
    addNotification({
      type: 'info',
      title: 'Tema restablecido',
      message: 'Se ha restablecido el tema por defecto',
      priority: 'low',
      category: 'system',
      autoDelete: 3
    });
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tioskap-theme-${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        
        // Validate theme structure
        if (importedTheme.colors && importedTheme.typography && importedTheme.layout) {
          setCurrentTheme({
            ...importedTheme,
            id: `imported_${Date.now()}`
          });
          
          addNotification({
            type: 'success',
            title: 'Tema importado',
            message: `Tema "${importedTheme.name}" importado correctamente`,
            priority: 'medium',
            category: 'system',
            autoDelete: 5
          });
        } else {
          throw new Error('Invalid theme format');
        }
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

  if (compact) {
    return (
      <Card className="hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Personalización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Tema actual: </span>
              <span className="font-medium">{currentTheme.name}</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_THEMES.slice(0, 3).map(theme => (
                <Button
                  key={theme.id}
                  variant={currentTheme.id === theme.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => loadTheme(theme)}
                  className="text-xs"
                >
                  {theme.name}
                </Button>
              ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizar tema
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Personalización de Tema</DialogTitle>
                  <DialogDescription>
                    Personaliza la apariencia de TIOSKAP según tus preferencias
                  </DialogDescription>
                </DialogHeader>
                <ThemeCustomizerPanel
                  currentTheme={currentTheme}
                  setCurrentTheme={setCurrentTheme}
                  customThemes={customThemes}
                  onLoadTheme={loadTheme}
                  onSaveTheme={saveCustomTheme}
                  onReset={resetToDefault}
                  onExport={exportTheme}
                  onImport={importTheme}
                  previewMode={previewMode}
                  setPreviewMode={setPreviewMode}
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
      <ThemeCustomizerPanel
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        customThemes={customThemes}
        onLoadTheme={loadTheme}
        onSaveTheme={saveCustomTheme}
        onReset={resetToDefault}
        onExport={exportTheme}
        onImport={importTheme}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
      />
    </div>
  );
}

// Theme Customizer Panel Component
interface ThemeCustomizerPanelProps {
  currentTheme: ThemeConfig;
  setCurrentTheme: (theme: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
  customThemes: ThemeConfig[];
  onLoadTheme: (theme: ThemeConfig) => void;
  onSaveTheme: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewMode: boolean;
  setPreviewMode: (enabled: boolean) => void;
}

function ThemeCustomizerPanel({
  currentTheme,
  setCurrentTheme,
  customThemes,
  onLoadTheme,
  onSaveTheme,
  onReset,
  onExport,
  onImport,
  previewMode,
  setPreviewMode
}: ThemeCustomizerPanelProps) {
  const updateTheme = (section: keyof ThemeConfig, updates: any) => {
    setCurrentTheme(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Personalización de Tema</h2>
          <Badge variant={previewMode ? "default" : "secondary"}>
            {previewMode ? "Vista previa activa" : "Editando"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={previewMode}
            onCheckedChange={setPreviewMode}
            id="preview-mode"
          />
          <Label htmlFor="preview-mode" className="text-sm">Vista previa</Label>
        </div>
      </div>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Temas Predefinidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...DEFAULT_THEMES, ...customThemes].map(theme => (
              <Card 
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentTheme.id === theme.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onLoadTheme(theme)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">{theme.name}</h4>
                    
                    {/* Color Preview */}
                    <div className="flex gap-1">
                      {Object.entries(theme.colors).slice(0, 5).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {theme.typography.fontFamily} • {theme.typography.fontSize}px
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customization Tabs */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colores</TabsTrigger>
          <TabsTrigger value="typography">Tipografía</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="accessibility">Accesibilidad</TabsTrigger>
          <TabsTrigger value="effects">Efectos</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Colores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => updateTheme('colors', { [key]: e.target.value })}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => updateTheme('colors', { [key]: e.target.value })}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Tipografía</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Familia de fuente</Label>
                  <Select
                    value={currentTheme.typography.fontFamily}
                    onValueChange={(value) => updateTheme('typography', { fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de fuente: {currentTheme.typography.fontSize}px</Label>
                  <Slider
                    value={[currentTheme.typography.fontSize]}
                    onValueChange={([value]) => updateTheme('typography', { fontSize: value })}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Altura de línea: {currentTheme.typography.lineHeight}</Label>
                  <Slider
                    value={[currentTheme.typography.lineHeight]}
                    onValueChange={([value]) => updateTheme('typography', { lineHeight: value })}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peso de fuente: {currentTheme.typography.fontWeight}</Label>
                  <Slider
                    value={[currentTheme.typography.fontWeight]}
                    onValueChange={([value]) => updateTheme('typography', { fontWeight: value })}
                    min={300}
                    max={700}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Preview */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Vista previa del texto</h3>
                  <p style={{
                    fontFamily: currentTheme.typography.fontFamily,
                    fontSize: `${currentTheme.typography.fontSize}px`,
                    lineHeight: currentTheme.typography.lineHeight,
                    fontWeight: currentTheme.typography.fontWeight
                  }}>
                    Este es un ejemplo de cómo se verá el texto con la configuración actual. 
                    TIOSKAP es tu espacio seguro para sanar y crecer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Radio de borde: {currentTheme.layout.borderRadius}px</Label>
                  <Slider
                    value={[currentTheme.layout.borderRadius]}
                    onValueChange={([value]) => updateTheme('layout', { borderRadius: value })}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Espaciado: {currentTheme.layout.spacing}px</Label>
                  <Slider
                    value={[currentTheme.layout.spacing]}
                    onValueChange={([value]) => updateTheme('layout', { spacing: value })}
                    min={8}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ancho del contenedor</Label>
                  <Select
                    value={currentTheme.layout.containerWidth}
                    onValueChange={(value) => updateTheme('layout', { containerWidth: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000px">1000px (Compacto)</SelectItem>
                      <SelectItem value="1200px">1200px (Estándar)</SelectItem>
                      <SelectItem value="1400px">1400px (Amplio)</SelectItem>
                      <SelectItem value="100%">100% (Pantalla completa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ancho de la barra lateral: {currentTheme.layout.sidebarWidth}px</Label>
                  <Slider
                    value={[currentTheme.layout.sidebarWidth]}
                    onValueChange={([value]) => updateTheme('layout', { sidebarWidth: value })}
                    min={200}
                    max={400}
                    step={20}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Accesibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alto contraste</Label>
                    <p className="text-sm text-muted-foreground">Mejora la legibilidad con colores de alto contraste</p>
                  </div>
                  <Switch
                    checked={currentTheme.accessibility.highContrast}
                    onCheckedChange={(checked) => updateTheme('accessibility', { highContrast: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Movimiento reducido</Label>
                    <p className="text-sm text-muted-foreground">Reduce las animaciones para mayor comodidad</p>
                  </div>
                  <Switch
                    checked={currentTheme.accessibility.reducedMotion}
                    onCheckedChange={(checked) => updateTheme('accessibility', { reducedMotion: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anillo de enfoque</Label>
                    <p className="text-sm text-muted-foreground">Muestra indicadores visuales al navegar con teclado</p>
                  </div>
                  <Switch
                    checked={currentTheme.accessibility.focusRing}
                    onCheckedChange={(checked) => updateTheme('accessibility', { focusRing: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de fuente para accesibilidad: {currentTheme.accessibility.fontSize}px</Label>
                  <Slider
                    value={[currentTheme.accessibility.fontSize]}
                    onValueChange={([value]) => updateTheme('accessibility', { fontSize: value })}
                    min={14}
                    max={28}
                    step={2}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Efectos Visuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animaciones</Label>
                    <p className="text-sm text-muted-foreground">Habilita transiciones y animaciones suaves</p>
                  </div>
                  <Switch
                    checked={currentTheme.effects.animations}
                    onCheckedChange={(checked) => updateTheme('effects', { animations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Efecto de desenfoque</Label>
                    <p className="text-sm text-muted-foreground">Aplica efectos de backdrop-blur en elementos</p>
                  </div>
                  <Switch
                    checked={currentTheme.effects.blur}
                    onCheckedChange={(checked) => updateTheme('effects', { blur: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sombras</Label>
                    <p className="text-sm text-muted-foreground">Agrega profundidad con sombras sutiles</p>
                  </div>
                  <Switch
                    checked={currentTheme.effects.shadows}
                    onCheckedChange={(checked) => updateTheme('effects', { shadows: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gradientes</Label>
                    <p className="text-sm text-muted-foreground">Utiliza fondos degradados para elementos decorativos</p>
                  </div>
                  <Switch
                    checked={currentTheme.effects.gradients}
                    onCheckedChange={(checked) => updateTheme('effects', { gradients: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-between pt-6 border-t">
        <div className="flex gap-2">
          <Button onClick={onSaveTheme}>
            <Save className="h-4 w-4 mr-2" />
            Guardar tema
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
              id="theme-import"
            />
            <Button variant="outline" onClick={() => document.getElementById('theme-import')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restablecer
        </Button>
      </div>
    </div>
  );
}
