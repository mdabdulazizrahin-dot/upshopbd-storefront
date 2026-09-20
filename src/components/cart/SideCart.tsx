import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface SideCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SideCart = ({ open, onOpenChange }: SideCartProps) => {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  const getItemPrice = (item: typeof items[0]) => {
    return item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? 
           item.product.salePrice ?? item.product.price;
  };

  const getItemImage = (item: typeof items[0]) => {
    if (item.selectedVariation?.image) return item.selectedVariation.image;
    return item.product.images?.[0]?.url || '/placeholder.svg';
  };

  const getVariationText = (item: typeof items[0]) => {
    if (!item.selectedVariation) return null;
    return Object.entries(item.selectedVariation.attributes)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Add items to your cart to checkout</p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.productId}-${item.variationId || 'simple'}`}
                  className="flex gap-4 bg-muted/30 p-3 rounded-lg"
                >
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={getItemImage(item)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link 
                        to={`/product/${item.product.seoSlug}`}
                        onClick={() => onOpenChange(false)}
                        className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variationId)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Variation */}
                    {getVariationText(item) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {getVariationText(item)}
                      </p>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-primary">
                        ৳{(getItemPrice(item) * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variationId)}
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variationId)}
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 space-y-4 bg-background">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span className="text-primary">৳{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  asChild
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button 
                  onClick={() => onOpenChange(false)}
                  asChild
                >
                  <Link to="/checkout">Order Confirm</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SideCart;
