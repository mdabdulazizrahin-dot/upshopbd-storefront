import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import api from '@/lib/api';

const ContactUs = () => {
  const { settings } = useSiteSettingsContext();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: page } = useQuery({
    queryKey: ['page', 'contact-us'],
    queryFn: async () => {
      try {
        const res = await api.get<any>('/pages/contact-us');
        return res?.data || res;
      } catch { return null; }
    },
  });

  useEffect(() => {
    document.title = page?.seo_title || page?.title || 'যোগাযোগ - UpShop BD';
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: 'বার্তা পাঠানো হয়েছে!', description: 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।' });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">
                {page?.title || 'যোগাযোগ করুন'}
              </h1>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-semibold mb-6">আমাদের সাথে যোগাযোগ করুন</h2>
                <p className="text-muted-foreground mb-8">
                  কোনো প্রশ্ন বা সমস্যায় আমরা সবসময় আপনার পাশে আছি। নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">ফোন</h3>
                      <p className="text-muted-foreground">{settings.general?.phone || '+880 1700-000000'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">ইমেইল</h3>
                      <p className="text-muted-foreground">{settings.general?.email || 'support@upshopbd.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">ঠিকানা</h3>
                      <p className="text-muted-foreground">{settings.general?.address || 'Dhanmondi, Dhaka-1205, Bangladesh'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-muted/30 p-6 md:p-8 rounded-xl">
                <h2 className="text-xl font-semibold mb-6">বার্তা পাঠান</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">নাম *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required placeholder="আপনার নাম" />
                    </div>
                    <div>
                      <Label htmlFor="phone">ফোন *</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} required placeholder="01XXXXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="subject">বিষয় *</Label>
                    <Input id="subject" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} required placeholder="কীভাবে সাহায্য করতে পারি?" />
                  </div>
                  <div>
                    <Label htmlFor="message">বার্তা *</Label>
                    <Textarea id="message" value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} required placeholder="আপনার বার্তা..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
