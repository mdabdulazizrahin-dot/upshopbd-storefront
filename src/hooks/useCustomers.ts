import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CustomerSummary {
  total_customers: number;
  registered_count: number;
  guest_count: number;
  total_orders: number;
  total_revenue: number;
}

export interface CustomerItem {
  id: string;
  user_id: number | null;
  name: string;
  email: string | null;
  phone: string | null;
  type: 'registered' | 'guest';
  orders_count: number;
  total_spent: number;
  created_at: string | null;
  last_order_at: string | null;
  last_order_status: string | null;
}

export interface BlockedEntity {
  id: number | string;
  type: 'phone' | 'ip';
  value: string;
  reason: string | null;
  created_at: string;
}

export const useCustomers = (params?: { search?: string; type?: string }) => {
  return useQuery({
    queryKey: ['admin-customers', params],
    queryFn: async () => {
      const searchParam = params?.search ? `&search=${encodeURIComponent(params.search)}` : '';
      const typeParam = params?.type && params.type !== 'all' ? `&type=${encodeURIComponent(params.type)}` : '';
      const res = await api.get<{ data: CustomerItem[]; summary: CustomerSummary }>(`/admin/customers?${searchParam}${typeParam}`);
      return res;
    },
  });
};

export const useCustomerOrders = (params: { userId?: string | number | null; phone?: string | null }) => {
  return useQuery({
    queryKey: ['customer-orders', params.userId, params.phone],
    queryFn: async () => {
      if (!params.userId && !params.phone) return { orders: [], total_count: 0, total_spent: 0 };
      const query = params.userId ? `user_id=${params.userId}` : `phone=${encodeURIComponent(params.phone || '')}`;
      const res = await api.get<{ orders: any[]; total_count: number; total_spent: number }>(`/admin/customers/orders?${query}`);
      return res;
    },
    enabled: !!params.userId || !!params.phone,
  });
};

export const useBlockedEntities = () => {
  return useQuery({
    queryKey: ['blocked-entities'],
    queryFn: async () => {
      const res = await api.get<{ data: BlockedEntity[] }>('/admin/blocked-entities');
      return res.data || [];
    },
  });
};

export const useBlockEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { type: 'phone' | 'ip'; value: string; reason?: string }) => {
      return await api.post('/admin/blocked-entities', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-entities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });
};

export const useUnblockEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      return await api.delete(`/admin/blocked-entities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-entities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });
};
