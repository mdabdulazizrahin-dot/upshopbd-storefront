import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySectionProps {
  title?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

// Curated high-res isolated product images matching common ecommerce categories (100% verified 200 OK URLs)
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  shoes: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80',
  shoe: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80',
  jewellery: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80',
  jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80',
  apparel: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  clothing: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  fashion: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80',
  bag: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80',
  furniture: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80',
  watches: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80',
  watch: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80',
  kitchenware: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80',
  cosmetics: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80',
  cosmatices: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80',
  beauty: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80',
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
  gadgets: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
};

const getCategoryImage = (category: any): string => {
  // Check if image_url exists and is not the broken photo-1580481077195 URL
  if (category.image_url && category.image_url.trim().length > 0 && !category.image_url.includes('photo-1580481077195')) {
    return category.image_url;
  }
  const key = (category.slug || category.name || '').toLowerCase();
  for (const [k, url] of Object.entries(FALLBACK_CATEGORY_IMAGES)) {
    if (key.includes(k)) return url;
  }
  return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80';
};

interface CategoryCardProps {
  category: any;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageUrl = getCategoryImage(category);
  const displayName = category.name || category.name_bn || 'Category';

  return (
    <div className="flex-shrink-0 w-[118px] sm:w-[126px] md:w-[130px] lg:w-[136px] xl:w-[146px] h-[138px] sm:h-[148px] md:h-[155px] xl:h-[162px]">
      <Link
        to={`/shop?category=${category.slug}`}
        className="group/card relative flex flex-col items-center justify-between p-2.5 sm:p-3 md:p-3.5 bg-white dark:bg-card border border-gray-200/90 dark:border-gray-800 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-primary/60 active:scale-[0.98] w-full h-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] overflow-hidden cursor-pointer select-none"
      >
        {/* Subtle hover gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.04] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Isolated Product Image */}
        <div className="flex-1 w-full flex items-center justify-center p-1 overflow-hidden">
          <img
            src={imageUrl}
            alt={displayName}
            className="max-h-16 md:max-h-20 w-auto max-w-full object-contain drop-shadow-sm group-hover/card:scale-110 group-hover/card:rotate-1 transition-transform duration-300 ease-out"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = FALLBACK_CATEGORY_IMAGES[category.slug?.toLowerCase()] || FALLBACK_CATEGORY_IMAGES.furniture;
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
        </div>

        {/* Category Label */}
        <div className="w-full text-center mt-1 pt-1 z-10">
          <span className="block font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 group-hover/card:text-primary transition-colors tracking-tight truncate">
            {displayName}
          </span>
        </div>

        {/* Brand Accent Line expanding on hover */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary rounded-full group-hover/card:w-3/4 transition-all duration-300 pointer-events-none" />
      </Link>
    </div>
  );
};

const CategorySection = ({ 
  title = "Top Categories",
  autoplay = true,
  autoplaySpeed = 2000,
}: CategorySectionProps) => {
  const { data: categories, isLoading } = useCategories({ status: 'active' });
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Filter only categories configured for Top Categories (is_top === true)
  const topCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    // Filter categories that have is_top === true (or not 0/false)
    const filtered = categories.filter((c: any) => c.is_top === true || c.is_top === 1);
    const list = filtered.length > 0 ? filtered : categories;

    const preferredOrder = [
      'shoes', 'shoe',
      'jewellery', 'jewelry',
      'apparel', 'clothing', 'fashion',
      'bags', 'bag',
      'furniture',
      'watches', 'watch',
      'kitchenware', 'kitchen',
      'cosmetics', 'cosmatices', 'beauty'
    ];

    return [...list].sort((a, b) => {
      const aSlug = (a.slug || a.name || '').toLowerCase();
      const bSlug = (b.slug || b.name || '').toLowerCase();
      
      const aIndex = preferredOrder.findIndex(p => aSlug.includes(p));
      const bIndex = preferredOrder.findIndex(p => bSlug.includes(p));

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [categories]);

  // Slide step function (matches clicking the > or < button)
  const slideNext = useCallback(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 10) return;

      // Slide distance matches ~2-3 cards or ~300px
      const slideDistance = Math.min(el.clientWidth * 0.65, 360);

      if (el.scrollLeft >= maxScroll - 20) {
        // Reached the end! Smoothly slide back to beginning
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Slide forward smoothly just like clicking the > arrow button!
        el.scrollBy({ left: slideDistance, behavior: 'smooth' });
      }
    }
  }, []);

  const slidePrev = useCallback(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const slideDistance = Math.min(el.clientWidth * 0.65, 360);
      el.scrollBy({ left: -slideDistance, behavior: 'smooth' });
    }
  }, []);

  // Auto-slide animation that triggers step-by-step just like clicking the > arrow button!
  useEffect(() => {
    if (topCategories.length === 0 || autoplay === false) return;

    const intervalTime = autoplaySpeed && autoplaySpeed >= 800 ? autoplaySpeed : 2000;

    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        slideNext();
      }
    }, intervalTime); // Snappy, lively auto-slide (default: 2000ms / 2 seconds)

    return () => clearInterval(timer);
  }, [slideNext, topCategories.length, autoplay, autoplaySpeed]);

  if (isLoading) {
    return (
      <section className="py-6 md:py-8">
        {/* Centered Line Header Skeleton with 2 dots */}
        <div className="relative flex items-center justify-center my-6 md:my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative bg-muted/30 px-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <Skeleton className="h-7 w-44 mx-auto rounded-md" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Cards Row Skeleton */}
        <div className="flex gap-3 overflow-hidden px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className="w-[120px] sm:w-[130px] md:w-[136px] h-[145px] sm:h-[155px] flex-shrink-0 bg-white dark:bg-card border border-gray-200/80 rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm animate-pulse"
            >
              <Skeleton className="w-16 h-16 rounded-xl bg-muted/80 my-auto" />
              <Skeleton className="h-4 w-16 bg-muted/80 mt-2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (topCategories.length === 0) return null;

  return (
    <section className="py-3 md:py-4 relative group/section">
      {/* Centered Horizontal Line with Title Header with 2 dots on both sides matching user image 2 */}
      <div className="relative flex items-center justify-center my-2.5 sm:my-3.5">
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

      {/* Auto-sliding Carousel Container */}
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-background via-background/60 to-transparent z-10" />

        {/* Scroll Track: displays all 8 categories simultaneously on desktop */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-3.5 overflow-x-auto scrollbar-none py-3 px-1 select-none justify-start lg:justify-between items-center"
        >
          {topCategories.map((category, idx) => (
            <CategoryCard 
              key={`top-cat-${category.id}-${idx}`} 
              category={category} 
            />
          ))}
        </div>

        {/* Floating Manual Navigation Arrows (Visible on Section Hover) */}
        <div className="opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={slidePrev}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md border border-gray-200 shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-110 pointer-events-auto"
            title="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={slideNext}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md border border-gray-200 shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-110 pointer-events-auto"
            title="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
