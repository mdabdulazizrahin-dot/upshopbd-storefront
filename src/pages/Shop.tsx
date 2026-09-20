import { useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useProducts } from '@/hooks/useProducts';
import { transformProduct } from '@/lib/productUtils';
import { Skeleton } from '@/components/ui/skeleton';
import MinimalProductCard from '@/components/home/MinimalProductCard';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

const Shop = () => {
  const { data: dbProducts, isLoading } = useProducts({ status: 'active' });
  const { settings } = useSiteSettingsContext();
  const gridColumns = settings?.sections?.productGridColumns || 6;
  const mobileGridColumns = settings?.sections?.mobileProductGridColumns || 2;

  const products = useMemo(() => dbProducts?.map(transformProduct) || [], [dbProducts]);

  // Mobile column class mapping
  const getMobileColClass = () => {
    const mobileColMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    };
    return mobileColMap[mobileGridColumns] || 'grid-cols-2';
  };

  // Desktop column class mapping (sm and up)
  const getDesktopColClass = () => {
    const desktopColMap: Record<number, string> = {
      3: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3',
      4: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4',
      5: 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5',
      6: 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
      7: 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7',
      8: 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8',
      9: 'sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9',
      10: 'sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10',
    };
    return desktopColMap[gridColumns] || desktopColMap[6];
  };

  const getGridClass = () => `${getMobileColClass()} ${getDesktopColClass()}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted py-8">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              All Products
            </h1>
            <p className="text-muted-foreground mt-2">
              {products.length} products found
            </p>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Product Grid - Dynamic columns based on admin settings */}
          {isLoading ? (
            <div className={`grid ${getGridClass()} gap-2 sm:gap-3 md:gap-4`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid ${getGridClass()} gap-2 sm:gap-3 md:gap-4`}>
              {products.map((product) => (
                <MinimalProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;