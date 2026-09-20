import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Share2, Copy, Check, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import api from '@/lib/api';

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  image_url?: string | null;
  page_type?: 'page' | 'blog' | 'launch' | string;
  status: 'published' | 'draft';
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const { data: page, isLoading, isError } = useQuery<PageData>({
    queryKey: ['custom-page', slug],
    queryFn: async () => {
      return await api.get<PageData>(`/pages/${slug}`);
    },
    enabled: !!slug,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: 'লিংক কপি করা হয়েছে!' });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${page?.title || 'Check this out'} - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'blog': return { text: 'ব্লগ পোস্ট (Blog)', color: 'bg-blue-100 text-blue-800' };
      case 'launch': return { text: 'প্রোডাক্ট লঞ্চ (New Launch)', color: 'bg-purple-100 text-purple-800' };
      default: return { text: 'পেজ (Page)', color: 'bg-muted text-muted-foreground' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container-custom py-10 max-w-4xl">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-72 w-full rounded-2xl mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container-custom py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">পেজটি পাওয়া যায়নি</h2>
          <p className="text-sm text-muted-foreground mb-6">
            আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি সঠিক নয়।
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              হোম পেজে ফিরে যান
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const typeInfo = getTypeLabel(page.page_type);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb Header */}
        <div className="bg-muted/40 border-b">
          <div className="container-custom py-4 max-w-4xl">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">হোম</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>পেজ</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium truncate">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Page Container */}
        <article className="container-custom py-10 max-w-4xl">
          {/* Header section */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeInfo.color}`}>
                {typeInfo.text}
              </span>
              {page.created_at && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(page.created_at).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
              {page.title}
            </h1>
          </div>

          {/* Featured Banner Image */}
          {page.image_url && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border bg-muted/20">
              <img
                src={page.image_url}
                alt={page.title}
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* HTML Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-sans space-y-4 
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-primary
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:max-w-full [&_img]:mx-auto
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-muted/30 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
            [&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:text-primary/80"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />

          {/* Social Share & Action Bar */}
          <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                <Share2 className="h-4 w-4" /> শেয়ার করুনঃ
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareFacebook}
                className="h-8 text-xs bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/20"
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="h-8 text-xs bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20"
              >
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 text-xs flex items-center gap-1"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'কপি হয়েছে' : 'লিংক কপি'}
              </Button>
            </div>

            <Link to="/shop">
              <Button variant="default" size="sm">
                সকল প্রোডাক্ট দেখুন
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CustomPage;
