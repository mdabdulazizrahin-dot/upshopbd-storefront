import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Eye, 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  BookOpen, 
  Rocket, 
  Megaphone,
  Layers,
  Save,
  Loader2,
  X
} from 'lucide-react';

const STATIC_SLUGS = [
  'about-us',
  'contact-us',
  'privacy-policy',
  'terms-conditions',
  'return-policy',
  'faq'
];

const defaultStaticPagesList = [
  { slug: 'about-us', title: 'About Us' },
  { slug: 'contact-us', title: 'Contact Us' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms-conditions', title: 'Terms & Conditions' },
  { slug: 'return-policy', title: 'Return Policy' },
  { slug: 'faq', title: 'FAQ' },
];

export const Pages = () => {
  const queryClient = useQueryClient();
  const [mainTab, setMainTab] = useState<'custom' | 'static'>('custom');
  const [staticTab, setStaticTab] = useState('about-us');

  // Custom pages search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Dialog & editing state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch all pages
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => api.get<any[]>('/pages').catch(() => []),
  });

  // Save / Update Mutation
  const savePageMutation = useMutation({
    mutationFn: (pageData: any) => api.post('/pages', pageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      toast({ title: 'পেইজ সফলভাবে সংরক্ষণ করা হয়েছে!' });
      setIsDialogOpen(false);
      setEditingPage(null);
    },
    onError: (err: any) => {
      toast({ title: 'পেইজ সেভ করতে সমস্যা হয়েছে', description: err.message, variant: 'destructive' });
    },
  });

  // Delete Mutation
  const deletePageMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      toast({ title: 'পেইজ মুছে ফেলা হয়েছে' });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast({ title: 'ডিলিট করতে ব্যর্থ হয়েছে', description: err.message, variant: 'destructive' });
    }
  });

  // Filter custom pages (exclude static pages from custom list)
  const customPages = useMemo(() => {
    return pages.filter((p: any) => !STATIC_SLUGS.includes(p.slug));
  }, [pages]);

  const filteredCustomPages = useMemo(() => {
    return customPages.filter((p: any) => {
      const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || (p.page_type || 'page') === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [customPages, searchQuery, typeFilter]);

  const getStaticPageData = (slug: string) => pages.find((p: any) => p.slug === slug);

  const handleOpenCreateModal = () => {
    setEditingPage(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (page: any) => {
    setEditingPage(page);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deletePageMutation.mutate(deleteId);
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'blog':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center gap-1"><BookOpen className="h-3 w-3" /> ব্লগ (Blog)</Badge>;
      case 'launch':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 flex items-center gap-1"><Rocket className="h-3 w-3" /> লঞ্চ (Launch)</Badge>;
      case 'announcement':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 flex items-center gap-1"><Megaphone className="h-3 w-3" /> নোটিশ</Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1"><FileText className="h-3 w-3" /> কাস্টম পেজ</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              <FileText className="h-8 w-8 text-primary" />
              পেইজ ও কনটেন্ট ম্যানেজমেন্ট
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              কাস্টম পেইজ, ব্লগ পোস্ট, নতুন প্রোডাক্ট লঞ্চ বা স্ট্যাটিক পলিসি পেইজ পরিচালনা করুন
            </p>
          </div>
          
          <Button 
            onClick={handleOpenCreateModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex items-center gap-2 h-10 px-4"
          >
            <Plus className="h-4 w-4" />
            নতুন পেইজ / ব্লগ তৈরি করুন
          </Button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setMainTab('custom')}
              className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                mainTab === 'custom' 
                  ? 'border-primary text-primary font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              কাস্টম পেইজ ও ব্লগ ({customPages.length})
            </button>
            <button
              onClick={() => setMainTab('static')}
              className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                mainTab === 'static' 
                  ? 'border-primary text-primary font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4" />
              ডিফল্ট স্ট্যাটিক পেজসমূহ (৬টি)
            </button>
          </div>
        </div>

        {/* Tab 1: Custom Pages & Blogs */}
        {mainTab === 'custom' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-lg border shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="টাইটেল বা স্লাগ খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-muted-foreground whitespace-nowrap">টাইপ ফিল্টার:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-44 h-9">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব পেইজ (All)</SelectItem>
                    <SelectItem value="page">📄 সাধারণ পেইজ (Page)</SelectItem>
                    <SelectItem value="blog">📝 ব্লগ পোস্ট (Blog)</SelectItem>
                    <SelectItem value="launch">🚀 প্রোডাক্ট লঞ্চ (Launch)</SelectItem>
                    <SelectItem value="announcement">📢 নোটিশ / ঘোষণা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Pages Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">পেইজ লোড হচ্ছে...</p>
                  </div>
                ) : filteredCustomPages.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">কোনো কাস্টম পেইজ পাওয়া যায়নি</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                        {searchQuery || typeFilter !== 'all' 
                          ? 'আপনার সার্চ ফিল্টারের সাথে মিল রেখে কোনো পেইজ পাওয়া যায়নি।' 
                          : 'আপনি এখনো কোনো নতুন কাস্টম পেজ বা ব্লগ তৈরি করেননি। নিচের বাটনে ক্লিক করে প্রথম পেইজটি তৈরি করুন!'}
                      </p>
                    </div>
                    <Button onClick={handleOpenCreateModal} className="mt-2">
                      <Plus className="h-4 w-4 mr-1.5" />
                      প্রথম পেইজ তৈরি করুন
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ব্যানার</TableHead>
                        <TableHead>টাইটেল ও ধরন</TableHead>
                        <TableHead>পাবলিক লিংক (URL)</TableHead>
                        <TableHead>স্ট্যাটাস</TableHead>
                        <TableHead>তারিখ</TableHead>
                        <TableHead className="text-right">একশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomPages.map((page: any) => (
                        <TableRow key={page.id || page.slug}>
                          <TableCell>
                            <div className="w-12 h-12 rounded-lg bg-muted border overflow-hidden flex items-center justify-center">
                              {page.image_url ? (
                                <img src={page.image_url} alt={page.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-foreground text-sm leading-snug">{page.title}</p>
                              <div className="mt-1">
                                {getTypeBadge(page.page_type)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`/page/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline font-mono inline-flex items-center gap-1 bg-primary/5 px-2 py-1 rounded"
                            >
                              /page/{page.slug}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                              {page.status === 'published' ? 'পাবলিশড' : 'ড্রাফট'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {page.created_at ? new Date(page.created_at).toLocaleDateString('bn-BD', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/page/${page.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="সরাসরি দেখুন">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => handleOpenEditModal(page)}
                                title="এডিট করুন"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteId(page.id)}
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Default Static Pages */}
        {mainTab === 'static' && (
          <div className="space-y-4">
            <Card className="border-blue-100 bg-blue-50/40 p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-950">ডিফল্ট স্ট্যাটিক পেজ পলিসি</h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    এই পেজগুলো ওয়েবসাইটের ডিফল্ট পলিসি ও কোম্পানির তথ্য পেজ (যেমনঃ About Us, Contact, Return Policy ইত্যাদি)। এখান থেকে তাদের কনটেন্ট আপডেট করতে পারবেন।
                  </p>
                </div>
              </div>
            </Card>

            <Tabs value={staticTab} onValueChange={setStaticTab}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto gap-1 bg-muted p-1">
                {defaultStaticPagesList.map(p => (
                  <TabsTrigger key={p.slug} value={p.slug} className="text-xs py-2">{p.title}</TabsTrigger>
                ))}
              </TabsList>
              {defaultStaticPagesList.map(pageInfo => (
                <TabsContent key={pageInfo.slug} value={pageInfo.slug}>
                  <PageEditor
                    slug={pageInfo.slug}
                    defaultTitle={pageInfo.title}
                    pageData={getStaticPageData(pageInfo.slug)}
                    onSave={(data: any) => savePageMutation.mutate(data)}
                    isLoading={savePageMutation.isPending}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>

      {/* Create / Edit Custom Page Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {editingPage ? 'পেইজ এডিট করুন' : 'নতুন পেইজ বা ব্লগ তৈরি করুন'}
            </DialogTitle>
            <DialogDescription>
              ব্লগ পোস্ট, প্রোডাক্ট লঞ্চ ক্যাম্পেইন বা যে কোনো কাস্টম পেজের তথ্য ও ছবি দিন
            </DialogDescription>
          </DialogHeader>

          <CustomPageForm
            initialData={editingPage}
            onSubmit={(formData: any) => savePageMutation.mutate(formData)}
            isLoading={savePageMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই পেইজটি স্থায়ীভাবে মুছে ফেলা হবে এবং এর পাবলিক লিংক আর কাজ করবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

// Form for Custom Page / Blog
interface CustomPageFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const CustomPageForm = ({ initialData, onSubmit, isLoading, onCancel }: CustomPageFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [pageType, setPageType] = useState(initialData?.page_type || 'blog');
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Auto generate slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setImageUrl(res.url);
      toast({ title: 'ছবি সফলভাবে আপলোড হয়েছে!' });
    } catch {
      toast({ title: 'ছবি আপলোড করতে ব্যর্থ হয়েছে', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper toolbar functions to insert HTML snippets
  const insertSnippet = (snippet: string) => {
    setContent((prev) => prev + (prev ? '\n' : '') + snippet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'টাইটেল দেওয়া আবশ্যক', variant: 'destructive' });
      return;
    }
    if (!slug.trim()) {
      toast({ title: 'স্লাগ (URL Slug) দেওয়া আবশ্যক', variant: 'destructive' });
      return;
    }

    const payload: any = {
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      page_type: pageType,
      status,
      image_url: imageUrl || null,
      content,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
    };

    if (initialData?.id) {
      payload.id = initialData.id;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      {/* Title & Page Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label className="font-semibold text-sm">
            পেইজ / ব্লগের শিরোনাম (Title) <span className="text-destructive">*</span>
          </Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="যেমন: নতুন ঘড়ির ফিচার বা সামার স্পেশাল কালেকশন"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-sm">পেইজের ধরন (Type)</Label>
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">📝 ব্লগ পোস্ট (Blog Post)</SelectItem>
              <SelectItem value="launch">🚀 প্রোডাক্ট লঞ্চ (Launch)</SelectItem>
              <SelectItem value="page">📄 সাধারণ পেইজ (Page)</SelectItem>
              <SelectItem value="announcement">📢 নোটিশ / ঘোষণা</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Slug & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label className="font-semibold text-sm">
            কাস্টম URL স্লাগ (Slug) <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-xs text-muted-foreground font-mono">
              /page/
            </span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="summer-collection-2026"
              className="rounded-l-none font-mono text-sm"
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground">পাবলিক ভিজিট লিংকঃ /page/{slug || 'your-slug'}</p>
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-sm">স্ট্যাটাস (Status)</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">পাবলিশড (সবার জন্য দৃশ্যমান)</SelectItem>
              <SelectItem value="draft">ড্রাফট (অপ্রকাশিত)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="space-y-2 p-4 border rounded-xl bg-muted/20">
        <Label className="font-semibold text-sm flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-primary" />
            ব্যানার / ফিচারড ইমেজ (Featured Image)
          </span>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="text-xs text-destructive hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> রিমুভ করুন
            </button>
          )}
        </Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="cursor-pointer"
            />
            {uploadingImage && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> আপলোড হচ্ছে...</p>}
          </div>
          <div>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="অথবা ইমেজের সরাসরি URL দিন..."
              className="text-xs font-mono"
            />
          </div>
        </div>

        {imageUrl && (
          <div className="relative mt-2 rounded-lg overflow-hidden border max-h-48 w-full bg-card">
            <img src={imageUrl} alt="Featured Preview" className="w-full h-48 object-cover" />
          </div>
        )}
      </div>

      {/* Content Editor with Toolbar & Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-semibold text-sm">পেইজের বিস্তারিত কনটেন্ট (Content)</Label>
          <div className="flex rounded-md bg-muted p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'write' ? 'bg-card font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              এডিটর (Editor)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'preview' ? 'bg-card font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              লাইভ প্রিভিউ (Preview)
            </button>
          </div>
        </div>

        {activeTab === 'write' ? (
          <div className="space-y-2">
            {/* Quick Helper Toolbar */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-muted/60 rounded-t-lg border border-b-0 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<h2>সেকশন হেডিং</h2>')}
              >
                H2 হেডিং
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<h3>সাব-হেডিং</h3>')}
              >
                H3 হেডিং
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<p>এখানে আপনার প্যারাগ্রাফের টেক্সট লিখুন...</p>')}
              >
                প্যারাগ্রাফ
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<ul>\n  <li>পয়েন্ট ১</li>\n  <li>পয়েন্ট ২</li>\n</ul>')}
              >
                বুলেট লিস্ট
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<blockquote class="border-l-4 border-primary pl-4 italic">আপনার হাইলাইট বা কোটেশন...</blockquote>')}
              >
                কোট
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => insertSnippet('<img src="https://..." alt="Photo" class="rounded-xl shadow-md my-4 max-w-full" />')}
              >
                + ইমেজ ট্যাগ
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h2>নতুন অফার</h2><p>আমাদের নতুন কালেকশন সম্পর্কে বিস্তারিত...</p>"
              rows={10}
              className="font-mono text-xs rounded-t-none border-t-0 leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground">
              টিপস: আপনি সাধারণ টেক্সটের পাশাপাশি HTML ট্যাগ যেমন &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;img&gt; ইত্যাদি ব্যবহার করতে পারবেন।
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-6 min-h-[220px] bg-background">
            {content ? (
              <div
                className="prose dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-center text-muted-foreground text-xs py-10">
                কোনো কনটেন্ট লিখা হয়নি। &quot;এডিটর&quot; ট্যাবে ফিরে কনটেন্ট লিখুন।
              </p>
            )}
          </div>
        )}
      </div>

      {/* SEO Section */}
      <details className="border rounded-xl p-3 bg-muted/10">
        <summary className="font-semibold text-xs cursor-pointer text-muted-foreground hover:text-foreground">
          🔍 সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO Settings) - ঐচ্ছিক
        </summary>
        <div className="space-y-3 pt-3">
          <div className="space-y-1">
            <Label className="text-xs">SEO টাইটেল</Label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Google সার্চে দেখানোর টাইটেল"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">SEO ডেসক্রিপশন (Meta Description)</Label>
            <Textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Google সার্চের রেজাল্টে প্রদর্শিত সংক্ষিপ্ত বর্ণনা"
              rows={2}
              className="text-xs"
            />
          </div>
        </div>
      </details>

      <DialogFooter className="gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit" disabled={isLoading || uploadingImage}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              সংরক্ষণ হচ্ছে...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              {initialData ? 'আপডেট করুন' : 'পেইজ তৈরি করুন'}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Static page simple editor (keeps backward compatibility for the 6 core policy pages)
interface PageEditorProps {
  slug: string;
  defaultTitle: string;
  pageData: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const PageEditor = ({ slug, defaultTitle, pageData, onSave, isLoading }: PageEditorProps) => {
  const [title, setTitle] = useState(pageData?.title || defaultTitle);
  const [content, setContent] = useState(pageData?.content || '');
  const [seoTitle, setSeoTitle] = useState(pageData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(pageData?.seo_description || '');

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">পেজ কনটেন্ট ({defaultTitle})</CardTitle>
            <CardDescription>পাবলিক পেজের শিরোনাম ও বিস্তারিত তথ্য সম্পাদনা করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>পেজের টাইটেল</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" />
            </div>
            <div>
              <Label>কনটেন্ট (HTML বা টেক্সট)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<h2>সেকশন হেডিং</h2><p>বিস্তারিত তথ্য...</p>"
                rows={15}
                className="font-mono text-xs leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                আপনি সরাসরি HTML ট্যাগ যেমন &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; ইত্যাদি ব্যবহার করতে পারবেন।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">এসইও সেটিংস (SEO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>SEO Title</Label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO title" />
            </div>
            <div>
              <Label>SEO Description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() =>
            onSave({
              slug,
              title,
              content,
              seo_title: seoTitle,
              seo_description: seoDescription,
              page_type: 'page',
              status: 'published'
            })
          }
          className="w-full"
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
        </Button>
      </div>
    </div>
  );
};

export default Pages;
