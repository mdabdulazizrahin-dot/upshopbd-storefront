import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';

const defaultSettings: SiteSettings = {
  general: {},
  colors: {
    primary: '#70C332',
    secondary: '#70C332',
    button: '#70C332',
    hover: '#5ca329',
    text: '#111827',
    background: '#ffffff',
  },
  typography: {},
  header: {},
  footer: {},
  social: {},
  sections: {},
  tracking: {},
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
}

const getInitialSettings = (): SiteSettings => {
  try {
    const cached = localStorage.getItem('cached_site_settings');
    if (cached) return JSON.parse(cached);
  } catch {}
  return defaultSettings;
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: getInitialSettings(),
  isLoading: true,
});

export const useSiteSettingsContext = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const { data: serverSettings, isLoading } = useSiteSettings();
  const settings = serverSettings || getInitialSettings();

  const hexToHslValues = (hex: string): string => {
    if (!hex) return '225 100% 59%';
    if (!hex.startsWith('#')) return hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '225 100% 59%';
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    if (serverSettings) {
      try {
        localStorage.setItem('cached_site_settings', JSON.stringify(serverSettings));
      } catch {}
    }
  }, [serverSettings]);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    if (settings.colors?.primary) root.style.setProperty('--primary', hexToHslValues(settings.colors.primary));
    if (settings.colors?.secondary) root.style.setProperty('--secondary', hexToHslValues(settings.colors.secondary));
    if (settings.colors?.text) root.style.setProperty('--foreground', hexToHslValues(settings.colors.text));
    if (settings.colors?.background) root.style.setProperty('--background', hexToHslValues(settings.colors.background));
    if (settings.general?.site_name) document.title = settings.general.site_name;
  }, [settings]);

  return (
    <SiteSettingsContext.Provider value={{ settings: settings || defaultSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
