import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? 
                              item.product.salePrice ?? item.product.price;
                const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
                
                return (
                  <div
                    key={`${item.productId}-${item.variationId}`}
                    className="flex gap-4 p-4 bg-card rounded-xl border"
                  >
                    <Link to={`/product/${item.product.seoSlug}`} className="flex-shrink-0">
                      <img
                        src={mainImage?.url}
                        alt={item.product.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.seoSlug}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.selectedVariation && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {Object.entries(item.selectedVariation.attributes)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' | ')}
                        </p>
                      )}

                      <p className="font-bold text-primary mt-2">
                        ৳{price.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variationId)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variationId)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId, item.variationId)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t my-4" />

                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-primary">৳{subtotal.toLocaleString()}</span>
                </div>

                <Link to="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link to="/shop" className="block text-center mt-4">
                  <Button variant="ghost" className="text-muted-foreground">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
