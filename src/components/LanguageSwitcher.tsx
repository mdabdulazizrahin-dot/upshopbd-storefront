import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  type: 'admin' | 'frontend';
  variant?: 'default' | 'compact';
}

const LanguageSwitcher = ({ type, variant = 'default' }: LanguageSwitcherProps) => {
  const { 
    adminLanguage, 
    frontendLanguage, 
    setAdminLanguage, 
    setFrontendLanguage,
    tAdmin,
    t
  } = useLanguage();

  const currentLanguage = type === 'admin' ? adminLanguage : frontendLanguage;
  const setLanguage = type === 'admin' ? setAdminLanguage : setFrontendLanguage;
  const translations = type === 'admin' ? tAdmin : t;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const currentLangData = languages.find(l => l.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={variant === 'compact' ? 'sm' : 'default'}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {variant === 'default' && (
            <>
              <span>{currentLangData?.flag}</span>
              <span className="hidden sm:inline">{currentLangData?.label}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLanguage === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLanguage === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
