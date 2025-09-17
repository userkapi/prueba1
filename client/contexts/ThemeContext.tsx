import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type ColorScheme = 'warm' | 'cool' | 'nature' | 'cosmic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const colorSchemes = {
  warm: {
    name: 'Cálido',
    primary: '#f97316', // Orange
    secondary: '#f59e0b', // Amber
    accent: '#ef4444', // Red
    muted: '#f3f4f6'
  },
  cool: {
    name: 'Fresco',
    primary: '#3b82f6', // Blue
    secondary: '#06b6d4', // Cyan
    accent: '#8b5cf6', // Violet
    muted: '#f1f5f9'
  },
  nature: {
    name: 'Naturaleza',
    primary: '#22c55e', // Green
    secondary: '#84cc16', // Lime
    accent: '#eab308', // Yellow
    muted: '#f0fdf4'
  },
  cosmic: {
    name: 'Cósmico',
    primary: '#8b5cf6', // Violet
    secondary: '#ec4899', // Pink
    accent: '#06b6d4', // Cyan
    muted: '#faf5ff'
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('auto');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('warm');
  const [isDark, setIsDark] = useState(false);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('tioskap-theme') as Theme;
    const savedColorScheme = localStorage.getItem('tioskap-color-scheme') as ColorScheme;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColorScheme) setColorScheme(savedColorScheme);
  }, []);

  // Update dark mode based on theme preference and system preference
  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === 'dark') {
        setIsDark(true);
      } else if (theme === 'light') {
        setIsDark(false);
      } else {
        // Auto mode - use system preference
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    };

    updateDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateDarkMode();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme and color scheme to document
  useEffect(() => {
    const root = document.documentElement;
    const scheme = colorSchemes[colorScheme];
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(isDark ? 'dark' : 'light');
    
    // Update CSS custom properties for color scheme
    root.style.setProperty('--theme-primary', scheme.primary);
    root.style.setProperty('--theme-secondary', scheme.secondary);
    root.style.setProperty('--theme-accent', scheme.accent);
    root.style.setProperty('--theme-muted', scheme.muted);
    
    // Save preferences
    localStorage.setItem('tioskap-theme', theme);
    localStorage.setItem('tioskap-color-scheme', colorScheme);
  }, [theme, colorScheme, isDark]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light');
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        colorScheme, 
        setColorScheme, 
        isDark, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { colorSchemes };
