import { useEffect } from 'react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const useDynamicFavicon = () => {
  const { settings } = useSiteSettingsContext();
  const faviconUrl = settings?.general?.faviconUrl;

  useEffect(() => {
    if (!faviconUrl) return;

    // Find existing favicon link or create new one
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = faviconUrl;
    
    // Set type based on extension
    if (faviconUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else if (faviconUrl.endsWith('.png')) {
      link.type = 'image/png';
    } else if (faviconUrl.endsWith('.ico')) {
      link.type = 'image/x-icon';
    }
  }, [faviconUrl]);
};

export default useDynamicFavicon;