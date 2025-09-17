import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContextDatabase";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { OfflineProvider, OfflineStatus } from "./contexts/OfflineContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import IndexEnhanced from "./pages/IndexEnhanced";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import DesahogosEnhanced from "./pages/DesahogosEnhanced";
import ChatbotEnhanced from "./pages/ChatbotEnhanced";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import SelfHelpResources from "./pages/SelfHelpResources";
import SecuritySettings from "./pages/SecuritySettings";
import AboutUs from "./pages/AboutUs";
import History from "./pages/History";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import ProfessionalConsultation from "./pages/ProfessionalConsultation";
import OnboardingTour from "./components/OnboardingTour";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <OfflineProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <OfflineStatus />
                <BrowserRouter>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<IndexEnhanced />} />
                      <Route path="/nosotros" element={<AboutUs />} />
                      <Route path="/desahogos" element={<DesahogosEnhanced />} />
                      <Route path="/tienda" element={<Placeholder page="Tienda" />} />
                      <Route path="/ajustes" element={<SecuritySettings />} />
                      <Route path="/chatbot" element={<ChatbotEnhanced />} />
                      <Route path="/cuenta" element={<EnhancedDashboard />} />
                      <Route path="/recursos" element={<SelfHelpResources />} />
                      <Route path="/dashboard" element={<EnhancedDashboard />} />
                      <Route path="/seguridad" element={<SecuritySettings />} />
                      <Route path="/profesionales" element={<ProfessionalConsultation />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/coffee" element={<Placeholder page="Buy My Coffee" />} />
                      <Route path="/siguenos" element={<Placeholder page="Síguenos" />} />
                      <Route path="/historia" element={<History />} />
                      <Route path="/ayuda" element={<Placeholder page="Ayuda" />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <OnboardingTour />
                  </Layout>
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </OfflineProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
