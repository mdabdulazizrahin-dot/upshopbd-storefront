import { Link } from 'react-router-dom';
import { Product } from '@/types';

interface MinimalProductCardProps {
  product: Product;
}

const MinimalProductCard = ({ product }: MinimalProductCardProps) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const displayPrice = product.salePrice || product.price;

  return (
    <Link to={`/product/${product.seoSlug}`} className="group block h-full">
      <div className="relative bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/60 hover:border-primary/50 h-full flex flex-col hover:-translate-y-1">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-muted p-2 flex items-center justify-center">
          <img
            src={mainImage?.url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
          {/* Title - Single line with truncate */}
          <h3 
            className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors leading-tight"
            title={product.name}
          >
            {product.name}
          </h3>
          
          {/* Price */}
          <p className="mt-1 sm:mt-1.5 text-sm sm:text-base font-bold text-primary">
            ৳{displayPrice.toLocaleString()}
          </p>
        </div>

        {/* Beautiful Brand-Color Accent Line expanding on hover like top category */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
      </div>
    </Link>
  );
};

export default MinimalProductCard;
