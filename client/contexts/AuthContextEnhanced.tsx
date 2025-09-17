import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatar: string;
  joinedAt: Date;
  lastLogin: Date;
  isAnonymous: boolean;
  subscription?: {
    type: 'free' | 'premium' | 'professional';
    expiresAt?: Date;
  };
  stats: {
    storiesCount: number;
    reactionsGiven: number;
    reactionsReceived: number;
    loginStreak: number;
  };
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      crisisAlerts: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  switchToAnonymous: () => Promise<User>;
  upgradeSubscription: (type: 'premium' | 'professional') => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName: string;
  isAnonymous?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Generate avatar color based on user ID
const generateAvatarColor = (id: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF8A65'];
  const colorIndex = parseInt(id.slice(-1), 16) % colors.length;
  return colors[colorIndex];
};

// Generate anonymous username
const generateAnonymousName = (): string => {
  const adjectives = [
    'Sereno', 'Valiente', 'Esperanzado', 'Resiliente', 'Luminoso', 'Pacífico', 'Fuerte',
    'Gentil', 'Sabio', 'Compasivo', 'Equilibrado', 'Tranquilo'
  ];
  const nouns = [
    'Corazón', 'Alma', 'Estrella', 'Luna', 'Sol', 'Montaña', 'Río',
    'Árbol', 'Viento', 'Mar', 'Cielo', 'Jardín'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('tioskap_user');
        const sessionToken = localStorage.getItem('tioskap_session');
        
        if (savedUser && sessionToken) {
          const userData = JSON.parse(savedUser);
          // Validate session (in real app, verify with server)
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('tioskap_user');
        localStorage.removeItem('tioskap_session');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('tioskap_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create user if doesn't exist
      const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
      let existingUser = existingUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        return { success: false, error: 'Usuario no encontrado. Por favor, regístrate primero.' };
      }
      
      // Simple password check (in real app, use proper hashing)
      if (existingUser.password !== password) {
        return { success: false, error: 'Contraseña incorrecta.' };
      }
      
      const userData: User = {
        ...existingUser,
        lastLogin: new Date(),
        stats: {
          ...existingUser.stats,
          loginStreak: existingUser.stats.loginStreak + 1
        }
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('tioskap_session', 'session_' + Date.now());
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión. Inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
      
      // Check if user already exists
      if (existingUsers.find((u: any) => u.email === data.email)) {
        return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
      }
      
      if (existingUsers.find((u: any) => u.username === data.username)) {
        return { success: false, error: 'Ya existe una cuenta con este nombre de usuario.' };
      }
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newUser: User = {
        id: userId,
        email: data.email,
        username: data.username,
        displayName: data.displayName || (data.isAnonymous ? generateAnonymousName() : data.username),
        role: 'user' as UserRole,
        avatar: generateAvatarColor(userId),
        joinedAt: new Date(),
        lastLogin: new Date(),
        isAnonymous: data.isAnonymous || false,
        subscription: {
          type: 'free'
        },
        stats: {
          storiesCount: 0,
          reactionsGiven: 0,
          reactionsReceived: 0,
          loginStreak: 1
        },
        preferences: {
          language: 'es',
          theme: 'auto',
          notifications: {
            email: true,
            push: true,
            crisisAlerts: false
          }
        }
      };
      
      // Save to users list
      existingUsers.push({ ...newUser, password: data.password });
      localStorage.setItem('tioskap_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('tioskap_session', 'session_' + Date.now());
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al registrar la cuenta. Inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tioskap_user');
    localStorage.removeItem('tioskap_session');
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
        localStorage.setItem('tioskap_users', JSON.stringify(existingUsers));
      }
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (user) {
      // Remove from users list
      const existingUsers = JSON.parse(localStorage.getItem('tioskap_users') || '[]');
      const filteredUsers = existingUsers.filter((u: any) => u.id !== user.id);
      localStorage.setItem('tioskap_users', JSON.stringify(filteredUsers));
      
      logout();
    }
  };

  const switchToAnonymous = async (): Promise<User> => {
    const anonymousUser: User = {
      id: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: '',
      username: '',
      displayName: generateAnonymousName(),
      role: 'user',
      avatar: generateAvatarColor(`anon_${Date.now()}`),
      joinedAt: new Date(),
      lastLogin: new Date(),
      isAnonymous: true,
      subscription: {
        type: 'free'
      },
      stats: {
        storiesCount: 0,
        reactionsGiven: 0,
        reactionsReceived: 0,
        loginStreak: 1
      },
      preferences: {
        language: 'es',
        theme: 'auto',
        notifications: {
          email: false,
          push: false,
          crisisAlerts: false
        }
      }
    };
    
    setUser(anonymousUser);
    setIsAuthenticated(true);
    
    return anonymousUser;
  };

  const upgradeSubscription = async (type: 'premium' | 'professional'): Promise<{ success: boolean; error?: string }> => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          subscription: {
            type,
            expiresAt: new Date(Date.now() + (type === 'premium' ? 30 : 365) * 24 * 60 * 60 * 1000)
          }
        };
        await updateUser(updatedUser);
        return { success: true };
      }
      return { success: false, error: 'Usuario no autenticado' };
    } catch (error) {
      return { success: false, error: 'Error al actualizar la suscripción' };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading,
        login, 
        register, 
        logout,
        updateUser,
        deleteAccount,
        switchToAnonymous,
        upgradeSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
