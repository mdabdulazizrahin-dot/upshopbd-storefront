import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid = ({ products, title }: ProductGridProps) => {
  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
