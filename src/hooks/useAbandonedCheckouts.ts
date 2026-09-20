import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AbandonedCheckout {
  id: string;
  session_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  delivery_address: string | null;
  district: string | null;
  upazila: string | null;
  delivery_type: string | null;
  order_note: string | null;
  cart_items: CartItemData[];
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemData {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variationId?: string;
  variationAttributes?: Record<string, string>;
}

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('checkout_session');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('checkout_session', sessionId);
  }
  return sessionId;
};

export const clearCheckoutSession = (): void => {
  localStorage.removeItem('checkout_session');
};

export const useAbandonedCheckouts = () => {
  return useQuery({
    queryKey: ['abandoned-checkouts'],
    queryFn: async () => {
      try {
        const res = await api.get<any>('/abandoned-checkouts');
        return (res?.data || res || []) as AbandonedCheckout[];
      } catch { return []; }
    },
  });
};

export const useSaveAbandonedCheckout = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        await api.post('/abandoned-checkout/save', data);
      } catch (e) {
        console.warn('Failed to save abandoned checkout:', e);
      }
    },
  });
};

export const useMarkCheckoutConverted = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      try {
        await api.post('/abandoned-checkout/delete', { session_id: sessionId });
      } catch (e) {
        console.warn('Failed to mark converted:', e);
      }
    },
  });
};

export const useDeleteAbandonedCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/abandoned-checkouts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abandoned-checkouts'] });
    },
  });
};
