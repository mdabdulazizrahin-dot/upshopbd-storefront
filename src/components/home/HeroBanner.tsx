import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useBanners } from '@/hooks/useSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

const HeroBanner = () => {
  const { data: banners, isLoading } = useBanners();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const activeBanners = banners?.filter((b: any) => b.is_active) || [];

  if (isLoading) {
    return (
      <div className="relative aspect-[870/360] w-full rounded-lg bg-muted/60 animate-pulse flex items-center justify-center border border-border/50">
        <div className="space-y-3 w-full max-w-sm px-6 text-center">
          <Skeleton className="h-6 w-32 mx-auto bg-muted-foreground/15" />
          <Skeleton className="h-9 w-52 mx-auto bg-muted-foreground/15" />
          <Skeleton className="h-4 w-64 mx-auto bg-muted-foreground/15" />
        </div>
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return <DefaultBanner />;
  }

  if (activeBanners.length === 1) {
    return <SingleBanner banner={activeBanners[0]} />;
  }

  return (
    <section className="relative overflow-hidden">
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {activeBanners.map((banner: any) => (
            <CarouselItem key={banner.id}>
              <SingleBanner banner={banner} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-none shadow-lg hover:bg-background" />
        <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-none shadow-lg hover:bg-background" />
      </Carousel>
    </section>
  );
};

interface BannerData {
  id: string;
  image_url: string;
  title?: string | null;
  subtitle?: string | null;
  button_text?: string | null;
  link_url?: string | null;
}

const SingleBanner = ({ banner }: { banner: BannerData }) => {
  return (
    <div className="relative w-full">
      <div className="relative aspect-[870/360] w-full overflow-hidden">
        <img
          src={banner.image_url}
          alt={banner.title || 'Banner'}
          className="w-full h-full object-cover"
        />
        {(banner.title || banner.subtitle || banner.button_text) && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        )}
        {(banner.title || banner.subtitle || banner.button_text) && (
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom">
              <div className="max-w-lg text-white animate-fade-in">
                {banner.title && (
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-4 drop-shadow-lg">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-sm md:text-lg lg:text-xl mb-6 text-white/90 drop-shadow">
                    {banner.subtitle}
                  </p>
                )}
                {banner.button_text && banner.link_url && (
                  <Link to={banner.link_url}>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg">
                      {banner.button_text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DefaultBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
      <div className="container-custom py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-background/10 text-sm font-medium mb-4">
              New Collection 2024
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Discover Your
              <br />
              <span className="text-secondary">Perfect Style</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg">
              Explore our premium collection of fashion and electronics. Quality products at the best prices, delivered across Bangladesh.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore More
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-background/10 rounded-full blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" alt="Fashion" className="w-full h-48 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" alt="Products" className="w-full h-32 object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Shoes" className="w-full h-32 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" alt="Accessories" className="w-full h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100V50C240 0 480 0 720 50C960 100 1200 100 1440 50V100H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
