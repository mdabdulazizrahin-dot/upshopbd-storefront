import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export type StaffRole = 'admin' | 'moderator' | 'editor' | 'viewer';

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: StaffRole;
  permissions: string[] | null;
  created_at: string | null;
}

export interface StaffSummary {
  total_staff: number;
  admins_count: number;
  moderators_count: number;
  editors_count: number;
  viewers_count: number;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: StaffRole;
  permissions?: string[];
}

export interface UpdateStaffPayload {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: StaffRole;
  permissions?: string[];
}

export const useStaffUsers = () => {
  return useQuery({
    queryKey: ['admin-staff'],
    queryFn: async () => {
      const res = await api.get<{ data: StaffUser[]; summary: StaffSummary }>('/admin/staff');
      return res;
    },
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateStaffPayload) => {
      return await api.post<{ message: string; data: StaffUser }>('/admin/staff', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateStaffPayload) => {
      return await api.put<{ message: string; data: StaffUser }>(`/admin/staff/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete<{ message: string }>(`/admin/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
  });
};
