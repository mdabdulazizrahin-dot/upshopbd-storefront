import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { transformProduct } from '@/lib/productUtils';
import { Skeleton } from '@/components/ui/skeleton';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">উইশলিস্ট দেখতে লগইন করুন</h1>
          <p className="text-muted-foreground mb-6">
            আপনার পছন্দের প্রোডাক্টগুলো সংরক্ষণ করতে লগইন করুন।
          </p>
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90">লগইন করুন</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-8">
          <h1 className="text-2xl font-bold mb-6">আমার উইশলিস্ট</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">আপনার উইশলিস্ট খালি</h1>
          <p className="text-muted-foreground mb-6">
            আপনি এখনো কোনো প্রোডাক্ট উইশলিস্টে যোগ করেননি।
          </p>
          <Link to="/shop">
            <Button className="bg-primary hover:bg-primary/90">শপিং শুরু করুন</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-2xl font-bold mb-6">আমার উইশলিস্ট ({wishlistItems.length})</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {wishlistItems.map((item) => {
            const product = item.product || item.products || item;
            if (!product || !product.id) return null;
            
            const mainImage =
              product.product_images?.find((img: any) => img.is_main) ||
              product.images?.find((img: any) => img.is_main || img.isMain) ||
              product.product_images?.[0] ||
              product.images?.[0];

            const imageUrl = mainImage?.image_url || mainImage?.url || (typeof mainImage === 'string' ? mainImage : '/placeholder.svg');
            const displayPrice = product.sale_price ?? product.salePrice ?? product.price;
            const originalPrice = product.price;
            const slug = product.seo_slug || product.seoSlug || product.slug || String(product.id);

            return (
              <div key={item.id || product.id} className="bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/30 transition-all group flex flex-col justify-between">
                <Link to={`/product/${slug}`} className="block">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
                
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <Link to={`/product/${slug}`}>
                    <h3 className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors" title={product.name}>
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <p className="text-sm sm:text-base font-bold text-primary">
                      ৳{Number(displayPrice || 0).toLocaleString()}
                    </p>
                    {product.sale_price && product.price > product.sale_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{Number(originalPrice || 0).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-2 pt-1 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-8"
                      onClick={() => {
                        const productForCart = {
                          id: String(product.id),
                          name: product.name,
                          price: Number(product.price || 0),
                          salePrice: product.sale_price ? Number(product.sale_price) : (product.salePrice ? Number(product.salePrice) : undefined),
                          seoSlug: slug,
                          images: (product.images || product.product_images || []).map((img: any) => ({
                            id: String(img.id || ''),
                            url: img.url || img.image_url || '',
                            isMain: Boolean(img.is_main || img.isMain),
                          })),
                          productType: 'simple' as const,
                          stockQuantity: product.stock_quantity ?? 0,
                          status: product.status || 'published',
                        };
                        addToCart(productForCart as any, undefined, 1);
                        toast({ title: 'কার্টে যোগ হয়েছে', description: 'প্রোডাক্টটি সফলভাবে কার্টে যোগ করা হয়েছে।' });
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      কার্ট
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWishlist(item.product_id || product.id)}
                      title="উইশলিস্ট থেকে মুছুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;