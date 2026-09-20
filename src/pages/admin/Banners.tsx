import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useSiteSettings';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import api from '@/lib/api';

const BannersPage = () => {
  const { data: banners, isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const handleCreate = async (data: any) => {
    try {
      await createBanner.mutateAsync(data);
      toast({ title: 'Banner created successfully' });
      setIsDialogOpen(false);
    } catch {
      toast({ title: 'Failed to create banner', variant: 'destructive' });
    }
  };

  const handleUpdate = async (id: any, data: any) => {
    try {
      await updateBanner.mutateAsync({ id, data });
      toast({ title: 'Banner updated successfully' });
      setEditingBanner(null);
    } catch {
      toast({ title: 'Failed to update banner', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteBanner.mutateAsync(id);
      toast({ title: 'Banner deleted' });
    } catch {
      toast({ title: 'Failed to delete banner', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: any, isActive: boolean) => {
    try {
      await updateBanner.mutateAsync({ id, data: { is_active: !isActive } });
      toast({ title: 'Status updated' });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Banner Management</h1>
            <p className="text-muted-foreground">Manage home page slider banners</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />New Banner</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create New Banner</DialogTitle></DialogHeader>
              <BannerForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners?.map((banner: any) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="relative aspect-[16/9] bg-muted">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><ImageIcon className="h-12 w-12 text-muted-foreground" /></div>
                )}
                <div className="absolute top-2 right-2">
                  <Switch checked={banner.is_active} onCheckedChange={() => handleToggleActive(banner.id, banner.is_active)} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{banner.title || 'Untitled Banner'}</h3>
                <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs px-2 py-1 rounded ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingBanner(banner)}><Edit className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Banner</DialogTitle></DialogHeader>
                        <BannerForm initialData={banner} onSubmit={(data) => handleUpdate(banner.id, data)} />
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This banner will be permanently deleted.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(banner.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!banners || banners.length === 0) && (
          <Card className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No banners found</h3>
            <p className="text-muted-foreground mb-4">Create your first banner</p>
            <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Banner</Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

const BannerForm = ({ initialData, onSubmit }: { initialData?: any; onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({ title: initialData?.title || '', subtitle: initialData?.subtitle || '', image_url: initialData?.image_url || '', link_url: initialData?.link_url || '', button_text: initialData?.button_text || '', sort_order: initialData?.sort_order || 0, is_active: initialData?.is_active ?? true });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadImage(file);
      setForm({ ...form, image_url: result.url });
      toast({ title: 'Image uploaded' });
    } catch {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast({ title: 'Banner image is required', variant: 'destructive' }); return; }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Banner title" /></div>
        <div className="space-y-2"><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Banner subtitle" /></div>
        <div className="space-y-2"><Label>Link URL</Label><Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/shop" /></div>
        <div className="space-y-2"><Label>Button Text</Label><Input value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} placeholder="Shop Now" /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} /></div>
      </div>
      <div className="space-y-2">
        <Label>Banner Image *</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {form.image_url && <img src={form.image_url} alt="Preview" className="max-h-40 rounded border mt-2" />}
      </div>
      <Button type="submit" disabled={uploading}>{initialData ? 'Update' : 'Create'}</Button>
    </form>
  );
};

export default BannersPage;
