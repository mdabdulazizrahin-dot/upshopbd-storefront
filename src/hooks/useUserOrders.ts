import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface UserOrder {
  id: string; order_number: string; customer_name: string; customer_phone: string; delivery_address: string;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; payment_status: 'pending' | 'paid' | 'cancelled';
  subtotal: number; delivery_charge: number; total_amount: number; created_at: string;
  courier_name?: string | null; tracking_number?: string | null; courier_tracking_link?: string | null;
  district?: string | null; upazila?: string | null; items?: UserOrderItem[];
}

export interface UserOrderItem {
  id: string; product_name: string; quantity: number; unit_price: number; total_price: number;
  variation_attributes: Record<string, string> | null;
  product: { product_images: { image_url: string; is_main: boolean }[] } | null;
}

const extractArray = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  return [];
};

export const useUserOrders = (userId?: string | number) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      try { return extractArray(await api.get<any>('/user/orders')); }
      catch { return []; }
    },
    enabled: !!userId,
  });
};

export const useUserOrderWithItems = (orderId?: string) => {
  return useQuery({
    queryKey: ['user-order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      try {
        const res = await api.get<any>(`/user/orders/${orderId}`);
        if (res?.data) return res.data;
        return res;
      } catch { return null; }
    },
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      return await api.put(`/user/orders/${orderId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-order'] });
    },
  });
};
