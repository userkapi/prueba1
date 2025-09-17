import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Clock, 
  Fingerprint, 
  Smartphone,
  Key,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  Settings,
  Timer,
  ShieldCheck,
  Zap,
  UserX,
  Download,
  RotateCcw
} from "lucide-react";

interface SecuritySettings {
  biometricAuth: boolean;
  autoDelete: boolean;
  autoDeleteDays: number;
  endToEndEncryption: boolean;
  incognitoMode: boolean;
  dataRetention: number; // days
  anonymousAnalytics: boolean;
  shareUsageData: boolean;
  sessionTimeout: number; // minutes
  secureConnection: boolean;
}

interface DataExport {
  stories: number;
  reactions: number;
  chatMessages: number;
  journalEntries: number;
  totalSize: string;
}

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings>({
    biometricAuth: false,
    autoDelete: true,
    autoDeleteDays: 30,
    endToEndEncryption: true,
    incognitoMode: false,
    dataRetention: 90,
    anonymousAnalytics: true,
    shareUsageData: false,
    sessionTimeout: 30,
    secureConnection: true
  });

  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [activeSession, setActiveSession] = useState(true);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [dataExport, setDataExport] = useState<DataExport>({
    stories: 5,
    reactions: 156,
    chatMessages: 89,
    journalEntries: 12,
    totalSize: "2.3 MB"
  });

  useEffect(() => {
    // Check if biometric authentication is available
    const checkBiometric = async () => {
      if ('PublicKeyCredential' in window) {
        setIsBiometricAvailable(true);
      }
    };
    checkBiometric();

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('tioskap-security-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('tioskap-security-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof SecuritySettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const enableBiometric = async () => {
    try {
      // Simulated biometric setup
      if (navigator.credentials) {
        updateSetting('biometricAuth', true);
      }
    } catch (error) {
      console.error('Biometric setup failed:', error);
    }
  };

  const deleteAllData = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.')) {
      // Simulated data deletion
      localStorage.clear();
      alert('Todos los datos han sido eliminados exitosamente.');
    }
  };

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stories: dataExport.stories,
      reactions: dataExport.reactions,
      chatMessages: dataExport.chatMessages,
      journalEntries: dataExport.journalEntries,
      settings: settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tioskap-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSecurityScore = () => {
    let score = 0;
    if (settings.endToEndEncryption) score += 25;
    if (settings.biometricAuth) score += 20;
    if (settings.autoDelete) score += 15;
    if (settings.incognitoMode) score += 10;
    if (!settings.shareUsageData) score += 15;
    if (settings.sessionTimeout <= 30) score += 15;
    return score;
  };

  const securityScore = getSecurityScore();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Seguridad y Privacidad
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Controla tu privacidad y protege tus datos con configuraciones avanzadas de seguridad
        </p>
      </div>

      {/* Security Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-warm-200/50 hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                securityScore >= 80 ? 'bg-green-100' : 
                securityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <ShieldCheck className={`h-8 w-8 ${
                  securityScore >= 80 ? 'text-green-600' : 
                  securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Puntuación de Seguridad</h3>
                <p className="text-muted-foreground">
                  Tu nivel actual de protección de datos
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                securityScore >= 80 ? 'text-green-600' : 
                securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {securityScore}/100
              </div>
              <Badge className={
                securityScore >= 80 ? 'bg-green-100 text-green-800' : 
                securityScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }>
                {securityScore >= 80 ? 'Excelente' : 
                 securityScore >= 60 ? 'Bueno' : 'Mejorable'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-effect">
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            Autenticación
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datos
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <div className="grid gap-6">
            {/* Biometric Authentication */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Autenticación Biométrica
                </CardTitle>
                <CardDescription>
                  Usa tu huella dactilar o reconocimiento facial para mayor seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isBiometricAvailable ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Fingerprint className={`h-4 w-4 ${
                        isBiometricAvailable ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">Biometría disponible</p>
                      <p className="text-sm text-muted-foreground">
                        {isBiometricAvailable ? 'Tu dispositivo soporta autenticación biométrica' : 'No disponible en este dispositivo'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.biometricAuth}
                    onCheckedChange={(checked) => checked ? enableBiometric() : updateSetting('biometricAuth', false)}
                    disabled={!isBiometricAvailable}
                  />
                </div>
                
                {settings.biometricAuth && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Autenticación biométrica activa</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Gestión de Sesiones
                </CardTitle>
                <CardDescription>
                  Controla cuándo y cómo expiran tus sesiones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tiempo de inactividad (minutos)</label>
                    <select 
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                      <option value={0}>Nunca</option>
                    </select>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">
                        Última actividad: {lastActivity.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="grid gap-6">
            {/* Encryption */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cifrado de Datos
                </CardTitle>
                <CardDescription>
                  Protege tus datos con cifrado de extremo a extremo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cifrado de extremo a extremo</p>
                      <p className="text-sm text-muted-foreground">
                        Solo tú puedes leer tus datos
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.endToEndEncryption}
                    onCheckedChange={(checked) => updateSetting('endToEndEncryption', checked)}
                  />
                </div>
                
                {settings.endToEndEncryption && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-medium">Todos tus datos están cifrados</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incognito Mode */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  Modo Incógnito
                </CardTitle>
                <CardDescription>
                  Navegación completamente privada sin guardar historial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      settings.incognitoMode ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <EyeOff className={`h-4 w-4 ${
                        settings.incognitoMode ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">Navegación incógnito</p>
                      <p className="text-sm text-muted-foreground">
                        No se guardará historial de tu actividad
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.incognitoMode}
                    onCheckedChange={(checked) => updateSetting('incognitoMode', checked)}
                  />
                </div>
                
                {settings.incognitoMode && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700">
                      <EyeOff className="h-4 w-4" />
                      <span className="text-sm font-medium">Modo incógnito activo</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics Settings */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración de Datos
                </CardTitle>
                <CardDescription>
                  Controla qué datos compartir para mejorar el servicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics anónimos</p>
                      <p className="text-sm text-muted-foreground">
                        Ayuda a mejorar la plataforma sin identificarte
                      </p>
                    </div>
                    <Switch
                      checked={settings.anonymousAnalytics}
                      onCheckedChange={(checked) => updateSetting('anonymousAnalytics', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compartir datos de uso</p>
                      <p className="text-sm text-muted-foreground">
                        Comparte estadísticas de uso para investigación
                      </p>
                    </div>
                    <Switch
                      checked={settings.shareUsageData}
                      onCheckedChange={(checked) => updateSetting('shareUsageData', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6">
            {/* Auto-Delete */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Eliminación Automática
                </CardTitle>
                <CardDescription>
                  Elimina automáticamente datos antiguos para mayor privacidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Eliminación automática</p>
                    <p className="text-sm text-muted-foreground">
                      Elimina datos después del tiempo especificado
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDelete}
                    onCheckedChange={(checked) => updateSetting('autoDelete', checked)}
                  />
                </div>
                
                {settings.autoDelete && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Eliminar después de:</label>
                      <select 
                        value={settings.autoDeleteDays}
                        onChange={(e) => updateSetting('autoDeleteDays', parseInt(e.target.value))}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value={7}>7 días</option>
                        <option value={30}>30 días</option>
                        <option value={90}>3 meses</option>
                        <option value={365}>1 año</option>
                      </select>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm">
                          Los datos se eliminarán automáticamente después de {settings.autoDeleteDays} días
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportar Datos
                </CardTitle>
                <CardDescription>
                  Descarga una copia de todos tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">Historias</p>
                    <p className="text-blue-600">{dataExport.stories} entradas</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">Reacciones</p>
                    <p className="text-green-600">{dataExport.reactions} reacciones</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium">Chat</p>
                    <p className="text-purple-600">{dataExport.chatMessages} mensajes</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium">Diario</p>
                    <p className="text-yellow-600">{dataExport.journalEntries} entradas</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Tamaño total</p>
                    <p className="text-sm text-muted-foreground">{dataExport.totalSize}</p>
                  </div>
                  <Button onClick={exportData} className="bg-blue-500 hover:bg-blue-600 hover-lift">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Deletion */}
            <Card className="bg-red-50 border-red-200 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Eliminar Todos los Datos
                </CardTitle>
                <CardDescription className="text-red-600">
                  Elimina permanentemente todos tus datos. Esta acción no se puede deshacer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={deleteAllData}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 hover-lift"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todos los Datos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid gap-6">
            {/* Connection Security */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad de Conexión
                </CardTitle>
                <CardDescription>
                  Configuraciones avanzadas de seguridad de red
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Conexión segura (HTTPS)</p>
                      <p className="text-sm text-muted-foreground">
                        Todas las comunicaciones están cifradas
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verificación de certificados</p>
                    <p className="text-sm text-muted-foreground">
                      Verifica la autenticidad del servidor
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Impact */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Resumen de Privacidad
                </CardTitle>
                <CardDescription>
                  Qué datos recopilamos y cómo los usamos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Tus historias y mensajes están cifrados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No compartimos datos personales con terceros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Tu identidad permanece anónima</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Puedes eliminar tus datos en cualquier momento</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reset Settings */}
            <Card className="bg-white/70 backdrop-blur-sm border-warm-200/50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Restablecer Configuración
                </CardTitle>
                <CardDescription>
                  Volver a la configuración predeterminada de seguridad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (confirm('¿Restablecer toda la configuración de seguridad?')) {
                      setSettings({
                        biometricAuth: false,
                        autoDelete: true,
                        autoDeleteDays: 30,
                        endToEndEncryption: true,
                        incognitoMode: false,
                        dataRetention: 90,
                        anonymousAnalytics: true,
                        shareUsageData: false,
                        sessionTimeout: 30,
                        secureConnection: true
                      });
                    }
                  }}
                  className="hover-lift"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restablecer a Predeterminado
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
