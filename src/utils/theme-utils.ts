import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get from local storage if available
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      return savedTheme || 'system';
    }
    return 'system';
  });

  // Update the theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  // Apply the theme to the document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const applyTheme = (themeName: 'dark' | 'light') => {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(themeName);
    };

    if (theme === 'system') {
      applyTheme(getSystemTheme());

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(getSystemTheme());
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
      return undefined;
    }
  }, [theme]);

  return { theme, setTheme };
}
