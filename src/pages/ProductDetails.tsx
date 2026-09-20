import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MinimalProductCard from '@/components/home/MinimalProductCard';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { transformProduct } from '@/lib/productUtils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, ChevronRight, Heart } from 'lucide-react';
import { ProductVariation } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist } from '@/hooks/useWishlist';
import { sanitizeDescription } from '@/lib/sanitize';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, openSideCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const { data: dbProduct, isLoading } = useProduct(slug || '');
  const product = dbProduct ? transformProduct(dbProduct) : null;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [showVariationWarning, setShowVariationWarning] = useState(false);

  // Fetch related products
  const { data: allProducts } = useProducts({ status: 'active' });
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => p.category_id === product.categoryId && p.id !== product.id)
      .slice(0, 4)
      .map(transformProduct);
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Get available attributes - parse comma-separated values
  const availableAttributes = (() => {
    if (product.productType !== 'variable' || !product.variations) return {};
    
    const attrs: Record<string, Set<string>> = {};
    product.variations.forEach(v => {
      Object.entries(v.attributes).forEach(([key, value]) => {
        if (value) {
          if (!attrs[key]) attrs[key] = new Set();
          // Parse comma-separated values
          const values = value.split(',').map(v => v.trim()).filter(v => v);
          values.forEach(val => attrs[key].add(val));
        }
      });
    });
    
    return Object.fromEntries(
      Object.entries(attrs).map(([key, values]) => [key, Array.from(values)])
    );
  })();

  // Find matching variation - check if selected value is in comma-separated list
  const selectedVariation = ((): ProductVariation | undefined => {
    if (product.productType !== 'variable' || !product.variations) return undefined;
    
    const selectedKeys = Object.keys(selectedAttributes);
    const requiredKeys = Object.keys(availableAttributes);
    
    if (selectedKeys.length !== requiredKeys.length) return undefined;
    
    return product.variations.find(v =>
      Object.entries(selectedAttributes).every(([key, selectedValue]) => {
        const attrValue = v.attributes[key];
        if (!attrValue) return false;
        // Check if selected value exists in comma-separated list
        const attrValues = attrValue.split(',').map(v => v.trim());
        return attrValues.includes(selectedValue);
      })
    );
  })();

  // Price display
  const displayPrice = selectedVariation?.salePrice ?? selectedVariation?.price ?? product.salePrice ?? product.price;
  const originalPrice = selectedVariation?.price ?? product.price;
  const hasDiscount = displayPrice < originalPrice;

  // Stock - for display purposes only
  const stockQuantity = selectedVariation?.stockQuantity ?? product.stockQuantity;
  const isInStock = stockQuantity > 0;

  // Can add to cart - enable button when variation is selected (don't require stock)
  const canAddToCart = product.productType === 'simple' || !!selectedVariation;

  const handleAttributeSelect = (key: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    setShowVariationWarning(false);
  };

  const handleAddToCart = () => {
    if (product.productType === 'variable' && !selectedVariation) {
      setShowVariationWarning(true);
      return;
    }
    addToCart(product, selectedVariation, quantity);
    setQuantity(1);
    openSideCart();
  };

  const handleOrderNow = () => {
    if (product.productType === 'variable' && !selectedVariation) {
      setShowVariationWarning(true);
      return;
    }
    addToCart(product, selectedVariation, quantity, true); // Skip side cart for direct checkout
    navigate('/checkout');
  };

  // Generate product code from slug or id
  const productCode = `PCODE: ${String(product.id).padStart(6, '0').toUpperCase()}`;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {product.categoryName && (
              <>
                <Link to={`/shop?category=${product.categoryId}`} className="hover:text-primary">
                  {product.categoryName}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Main Product Section - 3 Column Layout */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid lg:grid-cols-[400px_1fr_300px]">
              {/* Left Column - Image Gallery */}
              <div className="p-4 border-r border-border">
                {/* Main Image */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-4">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImage]?.image_url || product.images[selectedImage]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImage === idx ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <img src={img.image_url || img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Middle Column - Product Info */}
              <div className="p-6 border-r border-border">
                {/* Product Name with Wishlist Button */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h1 className="text-xl font-semibold text-foreground">
                    {product.name}
                  </h1>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full border transition-colors flex-shrink-0 ${
                      isInWishlist(product.id)
                        ? 'bg-destructive/10 border-destructive text-destructive'
                        : 'border-border hover:border-destructive hover:text-destructive'
                    }`}
                    title={isInWishlist(product.id) ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">
                    BDT {displayPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      BDT {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Product Code */}
                <p className="text-sm text-muted-foreground mb-6">{productCode}</p>

                {/* Variations */}
                {product.productType === 'variable' && Object.entries(availableAttributes).map(([key, values]) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {key === 'size' ? 'সাইজ' : key === 'color' ? 'কালার' : key}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(values as string[]).map(value => (
                        <button
                          key={value}
                          onClick={() => handleAttributeSelect(key, value)}
                          className={`min-w-[48px] px-4 py-2 text-sm font-medium border transition-colors ${
                            selectedAttributes[key] === value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:border-primary'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    {/* Warning message when not selected */}
                    {showVariationWarning && !selectedAttributes[key] && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-destructive text-destructive-foreground rounded-full text-xs font-bold">!</span>
                        <span>অনুগ্রহ করে একটি {key === 'size' ? 'সাইজ' : key === 'color' ? 'কালার' : 'অপশন'} নির্বাচন করুন</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">পরিমান</label>
                <div className="inline-flex items-center border border-border rounded">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors text-lg"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium border-x border-border py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q + 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full font-medium"
                    onClick={handleOrderNow}
                  >
                    অর্ডার করুন
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 font-medium"
                    onClick={handleAddToCart}
                  >
                    অ্যাড টু কার্ট
                  </Button>
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="p-6 bg-muted/30">
                <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                  প্রোডাক্টের ডিটেইলস
                </h2>
                
                <div className="prose prose-sm text-muted-foreground">
                  {product.description ? (
                    <div 
                      className="whitespace-pre-line leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeDescription(product.description) }}
                    />
                  ) : (
                    <p className="text-muted-foreground">কোন বিবরণ নেই</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">সম্পর্কিত প্রোডাক্ট</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {relatedProducts.map(product => (
                  <MinimalProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
