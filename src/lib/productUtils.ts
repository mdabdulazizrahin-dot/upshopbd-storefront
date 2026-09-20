import { Product as DBProduct } from '@/hooks/useProducts';
import { Product } from '@/types';

// Transform database product to frontend Product type
export const transformProduct = (dbProduct: DBProduct): Product => {
  const mainImage = dbProduct.images?.find(img => img.is_main) || dbProduct.images?.[0];
  
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    productType: dbProduct.product_type,
    price: dbProduct.price,
    salePrice: dbProduct.sale_price || undefined,
    stockQuantity: dbProduct.stock_quantity,
    categoryId: dbProduct.category_id || '',
    categoryName: dbProduct.category?.name || '',
    status: dbProduct.status,
    images: dbProduct.images?.map(img => ({
      id: img.id,
      url: img.image_url,
      isMain: img.is_main,
    })) || [],
    variations: dbProduct.variations?.map(v => ({
      id: v.id,
      attributes: v.attributes as { size?: string; color?: string; [key: string]: string | undefined },
      price: v.price,
      salePrice: v.sale_price || undefined,
      stockQuantity: v.stock_quantity,
      image: v.image_url || undefined,
    })) || [],
    seoTitle: dbProduct.seo_title || undefined,
    seoDescription: dbProduct.seo_description || undefined,
    seoSlug: dbProduct.seo_slug,
    createdAt: dbProduct.created_at,
  };
};
