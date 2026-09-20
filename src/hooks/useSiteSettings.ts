import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface GeneralSettings {
  site_name?: string;
  site_description?: string;
  logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}

export interface ColorSettings {
  primary?: string;
  secondary?: string;
  button?: string;
  hover?: string;
  text?: string;
  background?: string;
  // legacy keys
  textColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  hoverColor?: string;
}

export interface TypographySettings {
  font_family?: string;
  font_size?: string;
  heading_font?: string;
  fontFamily?: string;
  headingSize?: string;
  bodySize?: string;
  lineHeight?: string;
}

export interface HeaderSettings {
  show_topbar?: boolean;
  topbar_text?: string;
  logo_url?: string;
}

export interface FooterLink {
  id?: string;
  title: string;
  url: string;
}

export interface FooterColumn {
  id?: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSettings {
  backgroundColor?: string;
  textColor?: string;
  copyrightText?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  customPhone?: string;
  customAddress?: string;
  customEmail?: string;
  showPhone?: boolean;
  showAddress?: boolean;
  showEmail?: boolean;
  columns?: FooterColumn[];
  footer_text?: string;
  show_social?: boolean;
  [key: string]: any;
}

export interface SocialSettings {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface SectionSettings {
  show_banner?: boolean;
  show_featured?: boolean;
  show_categories?: boolean;
}

export interface TrackingSettings {
  google_analytics?: string;
  facebook_pixel?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  googleTagManagerId?: string;
  tikTokPixelId?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
}

export interface SiteSettings {
  general?: GeneralSettings;
  colors?: ColorSettings;
  typography?: TypographySettings;
  header?: HeaderSettings;
  footer?: FooterSettings;
  social?: SocialSettings;
  sections?: SectionSettings;
  tracking?: TrackingSettings;
}

export const defaultSettings: SiteSettings = {
  general: {},
  colors: {
    primary: '#2563eb',
    secondary: '#2563eb',
    button: '#2563eb',
    hover: '#1e40af',
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

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const data = await api.get<Record<string, any>>('/site-settings');
        const settings: SiteSettings = { ...defaultSettings };
        for (const key of Object.keys(data)) {
          try {
            const parsed = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
            (settings as any)[key] = parsed;
          } catch {
            (settings as any)[key] = data[key];
          }
        }
        return settings;
      } catch {
        return defaultSettings;
      }
    },
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const payload: Record<string, any> = {};
      payload[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      return await api.post('/site-settings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      try {
        return await api.get<any[]>('/banners');
      } catch {
        return [];
      }
    },
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/banners', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: any; data: any }) => {
      return await api.put(`/banners/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => {
      return await api.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useHomeSections = () => {
  return useQuery({
    queryKey: ['home-sections'],
    queryFn: async () => {
      try {
        return await api.get<any[]>('/home-sections');
      } catch {
        return [];
      }
    },
  });
};

export const useUpdateHomeSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/home-sections', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] });
    },
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      try {
        return await api.get<any[]>('/menu-items');
      } catch {
        return [];
      }
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/menu-items', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

export const useDeliverySettings = () => {
  return useQuery({
    queryKey: ['delivery-settings'],
    queryFn: async () => {
      try {
        return await api.get<any>('/delivery-settings');
      } catch {
        return null;
      }
    },
  });
};

export const useUpdateDeliverySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/delivery-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-settings'] });
    },
  });
};
