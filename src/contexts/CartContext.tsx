import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariation } from '@/types';
import { toast } from '@/hooks/use-toast';
import SideCart from '@/components/cart/SideCart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number, skipSideCart?: boolean) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isSideCartOpen: boolean;
  openSideCart: () => void;
  closeSideCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const openSideCart = () => setIsSideCartOpen(true);
  const closeSideCart = () => setIsSideCartOpen(false);

  const addToCart = (product: Product, variation?: ProductVariation, quantity: number = 1, skipSideCart: boolean = false) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.variationId === variation?.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        productId: product.id,
        variationId: variation?.id,
        quantity,
        product,
        selectedVariation: variation,
      }];
    });

    // Open side cart when adding item (unless skipped for direct checkout)
    if (!skipSideCart) {
      setIsSideCartOpen(true);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string, variationId?: string) => {
    setItems(prev => prev.filter(
      item => !(item.productId === productId && item.variationId === variationId)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variationId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variationId === variationId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? 
                  item.product.salePrice ?? item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isSideCartOpen,
      openSideCart,
      closeSideCart,
    }}>
      {children}
      <SideCart open={isSideCartOpen} onOpenChange={setIsSideCartOpen} />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
