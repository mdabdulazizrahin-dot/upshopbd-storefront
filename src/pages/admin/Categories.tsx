import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Categories = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isBulkAlertOpen, setIsBulkAlertOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    name_bn: '', 
    slug: '', 
    image_url: '', 
    status: 'active', 
    parent_id: '',
    is_top: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get<any[]>('/categories'),
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      let image_url = data.image_url;
      if (imageFile) {
        setUploading(true);
        const result = await api.uploadImage(imageFile);
        image_url = result.url;
        setUploading(false);
      }
      return api.post('/categories', { ...data, image_url });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category created successfully' });
      resetForm(); setIsOpen(false);
    },
    onError: (e: any) => { toast({ title: e.message, variant: 'destructive' }); setUploading(false); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: any; data: any }) => {
      let image_url = data.image_url;
      if (imageFile) {
        setUploading(true);
        const result = await api.uploadImage(imageFile);
        image_url = result.url;
        setUploading(false);
      }
      return api.put(`/categories/${id}`, { ...data, image_url });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category updated successfully' });
      resetForm(); setIsOpen(false);
    },
    onError: (e: any) => { toast({ title: e.message, variant: 'destructive' }); setUploading(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category deleted' });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: any[]) => api.post('/categories/bulk-delete', { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: `${selectedIds.length} categories deleted successfully` });
      setSelectedIds([]);
      setIsBulkAlertOpen(false);
    },
    onError: (e: any) => {
      toast({ title: e.message || 'Failed to delete categories', variant: 'destructive' });
      setIsBulkAlertOpen(false);
    },
  });

  const isAllSelected = !!categories?.length && categories.every((c: any) => selectedIds.includes(c.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories?.map((c: any) => c.id) || []);
    }
  };

  const handleToggleSelect = (id: any) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteMutation.mutate(selectedIds);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      name_bn: '', 
      slug: '', 
      image_url: '', 
      status: 'active', 
      parent_id: '',
      is_top: false,
    });
    setEditingCategory(null); setImageFile(null);
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ 
      name: cat.name, 
      name_bn: cat.name_bn || '', 
      slug: cat.slug, 
      image_url: cat.image_url || '', 
      status: cat.status, 
      parent_id: cat.parent_id || '',
      is_top: !!cat.is_top,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) { toast({ title: 'Name and Slug required', variant: 'destructive' }); return; }
    if (editingCategory) updateMutation.mutate({ id: editingCategory.id, data: formData });
    else createMutation.mutate(formData);
  };

  const handleToggleTopCategory = async (category: any, checked: boolean) => {
    try {
      await api.put(`/categories/${category.id}`, { is_top: checked });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ 
        title: checked ? `"${category.name}" added to Top Categories` : `"${category.name}" removed from Top Categories` 
      });
    } catch (err: any) {
      toast({ title: err.message || 'Failed to update category', variant: 'destructive' });
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const parentCategories = categories?.filter((c: any) => !c.parent_id) || [];
  const getParentName = (parentId: any) => categories?.find((c: any) => c.id == parentId)?.name || null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories and choose which ones appear in Top Categories</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name (English) *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Electronics" />
                </div>
                <div className="space-y-2">
                  <Label>Name (Bangla)</Label>
                  <Input value={formData.name_bn} onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} placeholder="ইলেকট্রনিক্স" />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="electronics" />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  {(formData.image_url || imageFile) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Parent Category (Optional)</Label>
                  <Select value={formData.parent_id || 'none'} onValueChange={(v) => setFormData({ ...formData, parent_id: v === 'none' ? '' : v })}>
                    <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {parentCategories.filter((c: any) => c.id != editingCategory?.id).map((cat: any) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name_bn || cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Top Category Switch in Modal */}
                <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_top" className="font-semibold cursor-pointer">Top Category (হোমপেজে প্রদর্শন)</Label>
                    <p className="text-xs text-muted-foreground">চালু থাকলে এটি হোমপেজের Top Categories সেকশনে যুক্ত হবে</p>
                  </div>
                  <Switch
                    id="is_top"
                    checked={!!formData.is_top}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_top: checked })}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                    {uploading ? 'Uploading...' : editingCategory ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/30 px-4 py-2.5 rounded-lg text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} টি ক্যাটাগরি সিলেক্ট করা হয়েছে
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkAlertOpen(true)}
                className="h-8 text-xs flex items-center gap-1.5"
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div></div>
            ) : categories && categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all categories"
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Name (BN)</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Top Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: any) => {
                    const isSelected = selectedIds.includes(category.id);
                    return (
                      <TableRow key={category.id} className={`${category.parent_id ? 'bg-muted/30' : ''} ${isSelected ? 'bg-primary/5' : ''}`}>
                        <TableCell className="w-12">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleSelect(category.id)}
                            aria-label={`Select ${category.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {category.image_url ? <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                          </div>
                        </TableCell>
                      <TableCell className="font-medium">
                        {category.parent_id && <span className="text-muted-foreground mr-2">↳</span>}
                        {category.name}
                      </TableCell>
                      <TableCell>{category.name_bn || '-'}</TableCell>
                      <TableCell>
                        {getParentName(category.parent_id) ? <Badge variant="outline">{getParentName(category.parent_id)}</Badge> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell>
                        <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>{category.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!category.is_top}
                            onCheckedChange={(checked) => handleToggleTopCategory(category, checked)}
                          />
                          <span className={`text-xs font-semibold ${category.is_top ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                            {category.is_top ? 'Top' : 'No'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(category.id); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No categories found. Create your first category!</div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Delete Confirmation */}
        <AlertDialog open={isBulkAlertOpen} onOpenChange={setIsBulkAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {selectedIds.length} selected category/categories. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={bulkDeleteMutation.isPending}
              >
                {bulkDeleteMutation.isPending ? 'Deleting...' : `Delete ${selectedIds.length} Categories`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Categories;
