import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CourierSetting {
  id: string; courier_name: string; display_name: string; api_key: string | null; api_secret: string | null;
  access_token: string | null; is_enabled: boolean; is_default: boolean; default_weight: number;
  created_at: string; updated_at: string;
}

export const useCourierSettings = () => {
  return useQuery({
    queryKey: ['courier-settings'],
    queryFn: async () => {
      try { return await api.get<CourierSetting[]>('/courier-settings'); }
      catch { return []; }
    },
  });
};

export const useUpdateCourierSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourierSetting> }) => {
      return await api.put(`/courier-settings/${id}`, data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courier-settings'] }); },
  });
};

export const useSetDefaultCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courierId: string) => {
      return await api.post(`/courier-settings/${courierId}/set-default`, {});
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courier-settings'] }); },
  });
};

export const useBookCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      return await api.post(`/courier/book`, { order_id: orderId });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
};