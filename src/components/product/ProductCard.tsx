import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.productType === 'simple') {
      addToCart(product);
    }
  };

  return (
    <Link to={`/product/${product.seoSlug}`} className="group block">
      <div className="product-card">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={mainImage?.url}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {hasDiscount && (
              <span className="sale-badge animate-pulse-soft">-{discountPercent}%</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg bg-background hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Overlay */}
          {product.productType === 'simple' && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold"
                size="sm"
                onClick={handleQuickAdd}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}

          {product.productType === 'variable' && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold"
                size="sm"
              >
                Select Options
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">{product.categoryName}</p>
          <h3 className="font-medium text-foreground line-clamp-2 mb-2.5 group-hover:text-primary transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="font-bold text-lg text-primary">৳{product.salePrice?.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="font-bold text-lg text-foreground">৳{product.price.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Beautiful Brand-Color Accent Line expanding on hover like top category */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-primary rounded-full group-hover:w-3/4 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

export default ProductCard;
