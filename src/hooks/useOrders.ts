import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Order {
  id: string; order_number: string; user_id: string | null; customer_name: string; customer_phone: string;
  customer_email: string | null; delivery_address: string; district_id: string | null; upazila_id: string | null;
  order_note: string | null; delivery_type: 'inside_dhaka' | 'outside_dhaka'; delivery_charge: number;
  subtotal: number; total_amount: number; payment_method: 'cod'; payment_status: 'pending' | 'paid' | 'cancelled';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  courier_name: string | null; tracking_number: string | null; courier_tracking_link: string | null;
  created_at: string; updated_at: string; district?: District | null; upazila?: Upazila | null; items?: OrderItem[];
}
export interface OrderItem { id: string; order_id: string; product_id: string | null; variation_id: string | null; product_name: string; variation_attributes: Record<string, string> | null; quantity: number; unit_price: number; total_price: number; }
export interface District { id: string; name: string; name_bn: string; division: string | null; }
export interface Upazila { id: string; district_id: string; name: string; name_bn: string; }
export interface DeliverySetting { id: string; delivery_type: 'inside_dhaka' | 'outside_dhaka'; charge: number; status: boolean; }
export interface CreateOrderData { customer_name: string; customer_phone: string; customer_email?: string; delivery_address: string; district_id?: string; upazila_id?: string; order_note?: string; delivery_type: 'inside_dhaka' | 'outside_dhaka'; delivery_charge: number; subtotal: number; total_amount: number; user_id?: string; }
export interface CreateOrderItemData { product_id?: string; variation_id?: string; product_name: string; variation_attributes?: Record<string, string>; quantity: number; unit_price: number; total_price: number; }
export interface UpdateOrderData { customer_name?: string; customer_phone?: string; delivery_address?: string; order_note?: string; order_status?: Order['order_status']; payment_status?: 'pending' | 'paid'; courier_name?: string; tracking_number?: string; courier_tracking_link?: string; }

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const res = await api.get<any>('/orders');
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }
      catch { return []; }
    },
  });
};
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => { return await api.get<Order>(`/orders/${id}`); },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: { order: CreateOrderData; items: CreateOrderItemData[] }) => {
      return await api.post('/orders', orderData);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, order_status, payment_status }: { id: string; order_status?: Order['order_status']; payment_status?: 'pending' | 'paid' | 'cancelled'; }) => {
      return await api.put(`/orders/${id}`, { order_status, payment_status });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderData }) => {
      return await api.put(`/orders/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
};

export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity, unit_price }: { id: string; quantity: number; unit_price: number }) => {
      return await api.put(`/order-items/${id}`, { quantity, total_price: quantity * unit_price });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { return await api.delete(`/orders/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
};

export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return await api.post('/orders/bulk-delete', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDistricts = () => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      try { return await api.get<District[]>('/districts'); }
      catch { return []; }
    },
  });
};

export const useUpazilas = (districtId?: string) => {
  return useQuery({
    queryKey: ['upazilas', districtId],
    queryFn: async () => {
      try {
        const url = districtId ? `/upazilas?district_id=${districtId}` : '/upazilas';
        return await api.get<Upazila[]>(url);
      } catch { return []; }
    },
  });
};

export const useDeliverySettings = () => {
  return useQuery({
    queryKey: ['delivery-settings'],
    queryFn: async () => {
      try { return await api.get<DeliverySetting[]>('/delivery-settings'); }
      catch { return []; }
    },
  });
};

export const useUpdateDeliverySetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, charge }: { id: string; charge: number }) => {
      return await api.put(`/delivery-settings/${id}`, { charge });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['delivery-settings'] }); },
  });
};
