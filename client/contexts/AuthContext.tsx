import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnonymousUser {
  id: string;
  nickname: string;
  avatar: string;
  joinedAt: Date;
  storiesCount: number;
  reactionsGiven: number;
}

interface AuthContextType {
  user: AnonymousUser | null;
  isAuthenticated: boolean;
  createAnonymousAccount: (nickname?: string) => Promise<AnonymousUser>;
  logout: () => void;
  updateUserStats: (storiesCount?: number, reactionsGiven?: number) => void;
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

// Simple avatar generator based on user ID
const generateAvatar = (id: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const colorIndex = parseInt(id.slice(-1), 16) % colors.length;
  return colors[colorIndex];
};

// Generate anonymous nicknames
const generateNickname = (): string => {
  const adjectives = [
    'Sereno', 'Valiente', 'Esperanzado', 'Resiliente', 'Luminoso', 'Pacífico', 'Fuerte',
    'Gentle', 'Hopeful', 'Brave', 'Bright', 'Calm', 'Strong', 'Peaceful'
  ];
  const nouns = [
    'Corazón', 'Alma', 'Estrella', 'Luna', 'Sol', 'Montaña', 'Río',
    'Heart', 'Soul', 'Star', 'Moon', 'Sun', 'Mountain', 'River'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tioskap_anonymous_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('tioskap_anonymous_user');
      }
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('tioskap_anonymous_user', JSON.stringify(user));
    }
  }, [user]);

  const createAnonymousAccount = async (nickname?: string): Promise<AnonymousUser> => {
    // Generate unique ID based on timestamp and random number
    const id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const generatedNickname = nickname || generateNickname();
    
    const newUser: AnonymousUser = {
      id,
      nickname: generatedNickname,
      avatar: generateAvatar(id),
      joinedAt: new Date(),
      storiesCount: 0,
      reactionsGiven: 0
    };

    setUser(newUser);
    setIsAuthenticated(true);
    
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tioskap_anonymous_user');
  };

  const updateUserStats = (storiesCount?: number, reactionsGiven?: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        storiesCount: storiesCount !== undefined ? storiesCount : user.storiesCount,
        reactionsGiven: reactionsGiven !== undefined ? reactionsGiven : user.reactionsGiven,
      };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        createAnonymousAccount, 
        logout,
        updateUserStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
