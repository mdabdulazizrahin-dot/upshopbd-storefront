import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

interface StaticPageProps {
  slug: string;
  defaultTitle: string;
  defaultContent: string;
}

const StaticPage = ({ slug, defaultTitle, defaultContent }: StaticPageProps) => {
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      try {
        const res = await api.get<any>(`/pages/${slug}`);
        return res?.data || res;
      } catch { return null; }
    },
  });

  useEffect(() => {
    document.title = page?.seo_title || page?.title || defaultTitle;
  }, [page, defaultTitle]);

  const content = page?.content || defaultContent;
  const title = page?.title || defaultTitle;

  const renderContent = () => {
    const parts = content.split(/(?=<h2)/i);
    if (parts.length <= 1) {
      return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return (
      <div className="space-y-6">
        {parts.map((part: string, index: number) => {
          if (!part.trim()) return null;
          const isSection = part.toLowerCase().startsWith('<h2');
          if (!isSection) {
            return <div key={index} className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: part }} />;
          }
          const titleMatch = part.match(/<h2[^>]*>(.*?)<\/h2>/i);
          const sectionTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : '';
          const body = part.replace(/<h2[^>]*>.*?<\/h2>/i, '').trim();
          return (
            <div key={index} className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {index}
                </div>
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{sectionTitle}</h2>
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: body }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48 mx-auto" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">{title}</h1>
                  <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
                </div>
                {renderContent()}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaticPage;
