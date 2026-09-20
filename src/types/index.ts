export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface ProductVariation {
  id: string;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  price: number;
  salePrice?: number;
  stockQuantity: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productType: 'simple' | 'variable';
  price: number;
  salePrice?: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  status: 'active' | 'inactive';
  images: ProductImage[];
  variations?: ProductVariation[];
  seoTitle?: string;
  seoDescription?: string;
  seoSlug: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variationId?: string;
  quantity: number;
  product: Product;
  selectedVariation?: ProductVariation;
}

export interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface District {
  id: string;
  name: string;
  nameBn: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  nameBn: string;
}

export interface DeliverySettings {
  insideDhaka: number;
  outsideDhaka: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  district: string;
  upazila: string;
  orderNote?: string;
  deliveryType: 'inside_dhaka' | 'outside_dhaka';
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'cod';
  paymentStatus: 'pending' | 'paid';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}
