import { useState, useMemo, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import CategoryProductSection from '@/components/home/CategoryProductSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useHomeSections } from '@/hooks/useSiteSettings';
import { transformProduct } from '@/lib/productUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { ChevronRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { settings } = useSiteSettingsContext();
  const { data: dbProducts, isLoading: productsLoading } = useProducts({ status: 'active' });
  const { data: categories, isLoading: categoriesLoading } = useCategories({ status: 'active' });
  const { data: homeSections } = useHomeSections();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [bannerHeight, setBannerHeight] = useState<number | null>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);

  // Sync category menu height precisely to the hero banner height
  useEffect(() => {
    if (!bannerContainerRef.current) return;
    const updateHeight = () => {
      if (bannerContainerRef.current) {
        const height = bannerContainerRef.current.offsetHeight;
        if (height > 100) {
          setBannerHeight(height);
        }
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(bannerContainerRef.current);
    return () => observer.disconnect();
  }, [categoriesLoading]);

  const products = useMemo(() => {
    return dbProducts?.map(transformProduct) || [];
  }, [dbProducts]);

  // Get parent categories
  const parentCategories = categories?.filter(c => !c.parent_id) || [];
  
  const getSubCategories = (parentId: string) =>
    categories?.filter((c) => c.parent_id === parentId) || [];

  // Helper to find root/main parent category for any category ID (handles subcategories of any depth)
  const findRootCategory = (catId: any) => {
    if (!catId || !categories || categories.length === 0) return null;
    let current = categories.find((c: any) => String(c.id) === String(catId));
    if (!current) return null;

    // Follow parent_id up to the top root category
    const visited = new Set<string>();
    while (current.parent_id && !visited.has(String(current.id))) {
      visited.add(String(current.id));
      const parent = categories.find((c: any) => String(c.id) === String(current.parent_id));
      if (!parent) break;
      current = parent;
    }
    return current;
  };

  // Group products by ROOT / MAIN category
  // If a main category (or any of its subcategories) has products, it will automatically get its own section
  const productsByMainCategory = useMemo(() => {
    if (!categories || categories.length === 0 || !products) return [];

    // Map: rootCategoryId -> { category, products }
    const groupMap = new Map<string, { category: any; products: typeof products }>();

    // Seed map with all root/main categories to preserve natural ordering
    const rootCategories = categories.filter((c: any) => !c.parent_id);
    rootCategories.forEach((rootCat: any) => {
      groupMap.set(String(rootCat.id), {
        category: rootCat,
        products: []
      });
    });

    const uncategorized: typeof products = [];

    products.forEach((product) => {
      const rootCat = findRootCategory(product.categoryId);
      if (rootCat) {
        const key = String(rootCat.id);
        if (!groupMap.has(key)) {
          groupMap.set(key, { category: rootCat, products: [] });
        }
        groupMap.get(key)!.products.push(product);
      } else {
        uncategorized.push(product);
      }
    });

    // Only include main categories that actually have products!
    const activeSections = Array.from(groupMap.values()).filter(g => g.products.length > 0);

    // If there are products without any category, add them at the bottom
    if (uncategorized.length > 0) {
      activeSections.push({
        category: { id: 'uncategorized', name: 'অন্যান্য পণ্য', name_bn: 'অন্যান্য পণ্য', slug: '' },
        products: uncategorized
      });
    }

    return activeSections;
  }, [products, categories]);

  const isLoading = productsLoading || categoriesLoading;

  // Active home sections ordered by sort_order
  const orderedSections = useMemo(() => {
    if (!homeSections || homeSections.length === 0) {
      return [
        { section_key: 'hero', is_visible: true, sort_order: 1 },
        { section_key: 'categories', is_visible: true, sort_order: 2 },
        { section_key: 'featured_products', is_visible: true, sort_order: 3 },
        { section_key: 'features', is_visible: true, sort_order: 4 },
      ];
    }
    return [...homeSections]
      .filter(s => s.is_visible !== false && s.is_visible !== 0)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [homeSections]);

  const renderSection = (section: any) => {
    const key = section.section_key;

    switch (key) {
      case 'hero':
      case 'hero_banner':
        return (
          <section key={section.id || key} className="container-custom py-4">
            <div className="hidden lg:flex gap-8 items-start">
              {/* Left Category Menu - Matches Banner Height with sleek scrollbar */}
              <div 
                className="w-[272px] flex-shrink-0 bg-white border border-gray-200 shadow-sm relative flex flex-col rounded-none overflow-hidden"
                style={{
                  height: bannerHeight ? `${bannerHeight}px` : '380px',
                  maxHeight: bannerHeight ? `${bannerHeight}px` : '380px',
                }}
              >
                <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold flex items-center gap-2 flex-shrink-0">
                  <Menu className="h-4 w-4" />
                  প্রোডাক্ট ক্যাটাগরি
                </div>
                <nav className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                  {categoriesLoading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    parentCategories.map((category) => {
                      const subCategories = getSubCategories(category.id);
                      const hasSubCategories = subCategories.length > 0;
                      const isHovered = hoveredCategory === category.id;

                      return (
                        <div
                          key={category.id}
                          className="relative group/cat"
                          onMouseEnter={() => setHoveredCategory(category.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <Link
                            to={`/shop?category=${category.slug}`}
                            className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/40 hover:text-primary text-gray-800"
                          >
                            <span className="truncate">{category.name_bn || category.name}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover/cat:text-primary transition-colors flex-shrink-0" />
                          </Link>

                          {hasSubCategories && isHovered && (
                            <div className="bg-muted/30 border-t border-gray-100 pl-4 py-1">
                              {subCategories.map((subCat) => (
                                <Link
                                  key={subCat.id}
                                  to={`/shop?category=${subCat.slug}`}
                                  className="flex items-center px-4 py-2 text-xs transition-colors hover:text-primary text-gray-700"
                                >
                                  <span>↳ {subCat.name_bn || subCat.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </nav>
              </div>

              {/* Hero Banner Container */}
              <div ref={bannerContainerRef} className="flex-1 min-w-0">
                <HeroBanner />
              </div>
            </div>

            {/* Mobile - Just Banner */}
            <div className="lg:hidden">
              <HeroBanner />
            </div>
          </section>
        );

      case 'categories':
        return (
          <div key={section.id || key} className="container-extended">
            <CategorySection
              title={section.settings?.title || section.title || 'Top Categories'}
              autoplay={section.settings?.autoplay !== false}
              autoplaySpeed={section.settings?.autoplay_speed || 2000}
            />
          </div>
        );

      case 'featured_products':
        return (
          <div key={section.id || key}>
            {isLoading ? (
              <section className="container-custom py-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-square rounded-lg" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <>
                {productsByMainCategory.map(({ category, products: catProducts }) => {
                  const title = category.name_bn || category.name || 'ক্যাটাগরি পণ্য';
                  return (
                    <CategoryProductSection
                      key={category.id}
                      title={title}
                      products={catProducts.slice(0, section.settings?.limit || 12)}
                      sectionBgColor={settings.sections?.categorySectionBgColor}
                    />
                  );
                })}

                {products.length === 0 && (
                  <div className="container-custom py-16 text-center">
                    <p className="text-muted-foreground text-lg">কোনো পণ্য পাওয়া যায়নি</p>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'features':
        return <FeaturesSection key={section.id || key} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        {orderedSections.map(section => renderSection(section))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
