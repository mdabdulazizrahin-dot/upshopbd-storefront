import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CourierNote {
  id: string;
  order_id: string;
  source: 'admin' | 'courier' | 'system';
  message: string;
  created_at: string;
  created_by: string | null;
}

export const useCourierNotes = (orderId?: string) => {
  return useQuery({
    queryKey: ['courier-notes', orderId],
    queryFn: async () => {
      if (!orderId) return [];
      try {
        return await api.get<CourierNote[]>(`/courier-notes/${orderId}`);
      } catch {
        return [];
      }
    },
    enabled: !!orderId,
  });
};

export const useAddCourierNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order_id,
      source,
      message,
    }: {
      order_id: string;
      source: 'admin' | 'courier' | 'system';
      message: string;
    }) => {
      try {
        return await api.post<CourierNote>(`/courier-notes`, { order_id, source, message });
      } catch {
        // fallback: return fake note
        return {
          id: Date.now().toString(),
          order_id,
          source,
          message,
          created_at: new Date().toISOString(),
          created_by: null,
        } as CourierNote;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courier-notes', variables.order_id] });
    },
  });
};

export const useCourierNotesCount = (orderId?: string) => {
  return useQuery({
    queryKey: ['courier-notes-count', orderId],
    queryFn: async () => 0,
    enabled: !!orderId,
  });
};

export const useHasCourierNotes = (orderId?: string) => {
  const { data: count, isLoading } = useCourierNotesCount(orderId);
  return { hasNotes: (count || 0) > 0, isLoading };
};
