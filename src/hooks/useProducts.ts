import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type: 'simple' | 'variable';
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  category_id: string | null;
  status: 'active' | 'inactive';
  seo_title: string | null;
  seo_description: string | null;
  seo_slug: string;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images?: ProductImage[];
  variations?: ProductVariation[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string | null;
  attributes: Record<string, string>;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  name_bn: string | null;
  slug: string;
  image_url: string | null;
  status: 'active' | 'inactive';
  parent_id: string | null;
  is_top?: boolean;
}

export interface CreateProductData {
  name: string;
  seo_slug: string;
  description?: string;
  product_type?: 'simple' | 'variable';
  price?: number;
  sale_price?: number | null;
  stock_quantity?: number;
  category_id?: string | null;
  images?: Array<{ url: string; is_main: boolean; sort_order: number }>;
}

export const useProducts = (options?: { category?: string; status?: 'active' | 'inactive'; limit?: number }) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      let url = '/products?';
      if (options?.category) url += `category=${options.category}&`;
      if (options?.status) url += `status=${options.status}&`;
      if (options?.limit) url += `limit=${options.limit}&`;
      return await api.get<Product[]>(url);
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      return await api.get<Product>(`/products/${slug}`);
    },
    enabled: !!slug,
  });
};

export const useCategories = (options?: { status?: 'active' | 'inactive'; is_top?: boolean }) => {
  return useQuery({
    queryKey: ['categories', options],
    queryFn: async () => {
      let url = '/categories?';
      if (options?.status) url += `status=${options.status}&`;
      if (options?.is_top !== undefined) url += `is_top=${options.is_top}&`;
      return await api.get<Category[]>(url);
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: CreateProductData) => {
      return await api.post('/products', product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      return await api.put(`/products/${id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return await api.post('/products/bulk-delete', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDuplicateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      return await api.post(`/products/${productId}/duplicate`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return await api.uploadImage(file);
    },
  });
};