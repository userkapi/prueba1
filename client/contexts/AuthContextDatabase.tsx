import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/database';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  email?: string;
  username: string;
  display_name: string;
  role: UserRole;
  avatar_color: string;
  is_anonymous: boolean;
  subscription_type: 'free' | 'premium' | 'professional';
  subscription_expires_at?: Date;
  
  // Stats
  stories_count: number;
  reactions_given: number;
  reactions_received: number;
  login_streak: number;
  karma_points: number;
  
  // Preferences
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications_email: boolean;
  notifications_push: boolean;
  crisis_alerts_enabled: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_login_at: Date;
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
  email?: string;
  username: string;
  password?: string;
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

// Generate UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Check if string is valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
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

  // Load user from localStorage on mount and sync with database
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('tioskap_user');
        const sessionToken = localStorage.getItem('tioskap_session');

        if (savedUser && sessionToken) {
          const userData = JSON.parse(savedUser);

          // Validate user ID is a proper UUID
          if (!isValidUUID(userData.id)) {
            console.log('Invalid user ID found in localStorage, clearing:', userData.id);
            localStorage.removeItem('tioskap_user');
            localStorage.removeItem('tioskap_session');
            return;
          }

          // Try to get fresh data from database
          try {
            const dbUser = await db.getUserById(userData.id);
            if (dbUser) {
              // Update last login and check login streak
              const lastLogin = dbUser.last_login_at ? new Date(dbUser.last_login_at) : null;
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(today.getDate() - 1);

              let newLoginStreak = dbUser.login_streak || 0;

              // Check if this is a new day login
              if (!lastLogin || lastLogin.toDateString() !== today.toDateString()) {
                // If last login was yesterday, increment streak
                if (lastLogin && lastLogin.toDateString() === yesterday.toDateString()) {
                  newLoginStreak += 1;
                } else if (!lastLogin || lastLogin < yesterday) {
                  // If more than a day gap, reset streak
                  newLoginStreak = 1;
                }

                // Update user with new login streak and last login
                const updatedUser = await db.updateUser(dbUser.id, {
                  login_streak: newLoginStreak,
                  last_login_at: today
                });

                setUser(updatedUser);
              } else {
                setUser(dbUser);
              }

              setIsAuthenticated(true);
            } else {
              // User not found in database, clear local data
              localStorage.removeItem('tioskap_user');
              localStorage.removeItem('tioskap_session');
            }
          } catch (error) {
            // Database error, use local data as fallback
            console.warn('Database unavailable, using local data:', error);
            setUser(userData);
            setIsAuthenticated(true);
          }
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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Por favor, ingresa un email válido.' };
      }

      // Check if user exists in database
      try {
        const existingUser = await db.getUserByEmail(email);

        if (!existingUser) {
          return {
            success: false,
            error: 'No existe una cuenta con este email. ¿Te gustaría registrarte?'
          };
        }

        // In a real application, you would verify the password hash here
        // For now, we'll simulate password verification
        if (password.length < 6) {
          return {
            success: false,
            error: 'Contraseña incorrecta. Verifica e intenta nuevamente.'
          };
        }

        // Update last login and login streak
        const today = new Date();
        const lastLogin = existingUser.last_login_at ? new Date(existingUser.last_login_at) : null;
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let newLoginStreak = existingUser.login_streak || 0;

        // Calculate login streak
        if (!lastLogin || lastLogin.toDateString() !== today.toDateString()) {
          if (lastLogin && lastLogin.toDateString() === yesterday.toDateString()) {
            newLoginStreak += 1;
          } else if (!lastLogin || lastLogin < yesterday) {
            newLoginStreak = 1;
          }

          // Update user in database
          const updatedUser = await db.updateUser(existingUser.id, {
            login_streak: newLoginStreak,
            last_login_at: today
          });

          setUser(updatedUser);
        } else {
          setUser(existingUser);
        }

        setIsAuthenticated(true);
        localStorage.setItem('tioskap_session', 'session_' + Date.now());

        return { success: true };

      } catch (dbError) {
        console.error('Database error during login:', dbError);
        return {
          success: false,
          error: 'Error de conexión. Por favor, intenta más tarde.'
        };
      }

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión. Inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return { success: false, error: 'Por favor, ingresa un email válido.' };
        }

        // Check if email already exists
        try {
          const existingUser = await db.getUserByEmail(data.email);
          if (existingUser) {
            return {
              success: false,
              error: 'Ya existe una cuenta con este email. ¿Quieres iniciar sesión?'
            };
          }
        } catch (dbError) {
          console.warn('Could not check existing email:', dbError);
        }
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(data.username)) {
        return {
          success: false,
          error: 'El nombre de usuario debe tener entre 3-20 caracteres y solo letras, números y guiones bajos.'
        };
      }

      // Ensure avatar_color is always generated
      const avatarColor = generateAvatarColor(data.username || Date.now().toString());

      // Create user in database
      const userData = {
        username: data.username,
        display_name: data.displayName,
        avatar_color: avatarColor,
        email: data.email || null,
        is_anonymous: data.isAnonymous || false
      };

      console.log('Creating user with data:', userData); // Debug log

      try {
        const newUser = await db.createUser(userData);

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('tioskap_session', 'session_' + Date.now());

        return { success: true };
      } catch (dbError: any) {
        console.error('Database error during registration:', dbError);

        // Check for common database errors
        if (dbError.message?.includes('unique') || dbError.message?.includes('duplicate')) {
          if (dbError.message?.includes('email')) {
            return { success: false, error: 'Este email ya está registrado.' };
          } else if (dbError.message?.includes('username')) {
            return { success: false, error: 'Este nombre de usuario ya está en uso.' };
          }
          return { success: false, error: 'Ya existe una cuenta con estos datos.' };
        }

        return {
          success: false,
          error: 'Error al crear la cuenta. Por favor, intenta más tarde.'
        };
      }

    } catch (error) {
      console.error('Registration error:', error);
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
      try {
        const updatedUser = await db.updateUser(user.id, updates);
        setUser(updatedUser);

        // Update localStorage to persist changes
        localStorage.setItem('tioskap_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user:', error);
        // Fallback to local update
        const updatedUser = { ...user, ...updates, updated_at: new Date() };
        setUser(updatedUser);
        localStorage.setItem('tioskap_user', JSON.stringify(updatedUser));
      }
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (user) {
      try {
        await db.updateUser(user.id, { deleted_at: new Date() });
      } catch (error) {
        console.error('Error deleting account:', error);
      }
      logout();
    }
  };

  const switchToAnonymous = async (): Promise<User> => {
    try {
      const username = generateAnonymousName();
      const avatarColor = generateAvatarColor(username + Date.now().toString());

      const anonymousData = {
        username: username,
        display_name: username,
        avatar_color: avatarColor,
        email: null,
        is_anonymous: true
      };

      console.log('Creating anonymous user with data:', anonymousData); // Debug log

      const anonymousUser = await db.createUser(anonymousData);

      setUser(anonymousUser);
      setIsAuthenticated(true);
      localStorage.setItem('tioskap_session', 'session_' + Date.now());

      return anonymousUser;
    } catch (error) {
      console.error('Error creating anonymous user:', error);

      // Fallback to local anonymous user with valid UUID
      const username = generateAnonymousName();
      const fallbackUser: User = {
        id: generateUUID(), // Use valid UUID instead of custom ID
        username: username,
        display_name: username,
        role: 'user',
        avatar_color: generateAvatarColor(username + Date.now().toString()),
        is_anonymous: true,
        subscription_type: 'free',
        stories_count: 0,
        reactions_given: 0,
        reactions_received: 0,
        login_streak: 1,
        karma_points: 0,
        language: 'es',
        theme: 'auto',
        notifications_email: false,
        notifications_push: false,
        crisis_alerts_enabled: false,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: new Date()
      };

      setUser(fallbackUser);
      setIsAuthenticated(true);
      localStorage.setItem('tioskap_session', 'session_' + Date.now());

      return fallbackUser;
    }
  };

  const upgradeSubscription = async (type: 'premium' | 'professional'): Promise<{ success: boolean; error?: string }> => {
    try {
      if (user) {
        const updates = {
          subscription_type: type,
          subscription_expires_at: new Date(Date.now() + (type === 'premium' ? 30 : 365) * 24 * 60 * 60 * 1000)
        };
        await updateUser(updates);
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
