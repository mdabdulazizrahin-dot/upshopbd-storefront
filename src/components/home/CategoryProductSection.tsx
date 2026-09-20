import { Product } from '@/types';
import MinimalProductCard from './MinimalProductCard';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

interface CategoryProductSectionProps {
  title: string;
  products: Product[];
  sectionBgColor?: string;
}

const CategoryProductSection = ({ title, products, sectionBgColor }: CategoryProductSectionProps) => {
  const { settings } = useSiteSettingsContext();
  const gridColumns = settings?.sections?.productGridColumns || 6;
  const mobileGridColumns = settings?.sections?.mobileProductGridColumns || 2;

  if (products.length === 0) return null;

  // Convert HSL string to CSS compatible format
  const bgStyle = sectionBgColor 
    ? { backgroundColor: `hsl(${sectionBgColor})` }
    : undefined;

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
    <section className="py-2 sm:py-3">
      <div className="container-custom">
        {/* Section Header: Centered Line with 2 Dots matching Top Categories design */}
        <div className="relative flex items-center justify-center my-2 sm:my-3">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200/90 dark:border-gray-800" />
          </div>
          <div className="relative bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white px-1">
                {title}
              </h2>
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Product Grid - Dynamic columns based on admin settings */}
        <div className={`grid ${getGridClass()} gap-2 sm:gap-3 md:gap-4`}>
          {products.map((product) => (
            <MinimalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryProductSection;
