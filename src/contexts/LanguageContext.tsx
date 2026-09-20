import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations } from '@/i18n/translations';

interface LanguageContextType {
  adminLanguage: Language;
  frontendLanguage: Language;
  setAdminLanguage: (lang: Language) => void;
  setFrontendLanguage: (lang: Language) => void;
  t: Translations;
  tAdmin: Translations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  adminLanguage: 'en',
  frontendLanguage: 'bn',
  setAdminLanguage: () => {},
  setFrontendLanguage: () => {},
  t: translations['bn'],
  tAdmin: translations['en'],
  isLoading: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [adminLanguage, setAdminLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('admin_language') as Language) || 'en';
  });
  const [frontendLanguage, setFrontendLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('frontend_language') as Language) || 'bn';
  });

  const setAdminLanguage = (lang: Language) => {
    setAdminLanguageState(lang);
    localStorage.setItem('admin_language', lang);
  };

  const setFrontendLanguage = (lang: Language) => {
    setFrontendLanguageState(lang);
    localStorage.setItem('frontend_language', lang);
  };

  return (
    <LanguageContext.Provider value={{
      adminLanguage,
      frontendLanguage,
      setAdminLanguage,
      setFrontendLanguage,
      t: translations[frontendLanguage],
      tAdmin: translations[adminLanguage],
      isLoading: false,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
