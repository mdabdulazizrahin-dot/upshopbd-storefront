import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useProducts, useDeleteProduct, useBulkDeleteProducts, useDuplicateProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Copy, CheckSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Products = () => {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const bulkDeleteProduct = useBulkDeleteProducts();
  const duplicateProduct = useDuplicateProduct();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkAlertOpen, setIsBulkAlertOpen] = useState(false);

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const isAllSelected = !!filteredProducts?.length && filteredProducts.every(p => selectedIds.includes(p.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts?.map(p => p.id) || []);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteProduct.mutateAsync(selectedIds);
      toast({
        title: 'Products Deleted',
        description: `${selectedIds.length} products have been deleted successfully.`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected products.',
        variant: 'destructive',
      });
    }
    setIsBulkAlertOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast({
        title: 'Product Deleted',
        description: 'The product has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    }
    setDeleteId(null);
  };

  const handleDuplicate = async (productId: string) => {
    try {
      await duplicateProduct.mutateAsync(productId);
      toast({
        title: 'Product Duplicated',
        description: 'Product has been duplicated successfully. The copy is set to inactive.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate product.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Link to="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search & Bulk Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg text-sm">
              <span className="font-semibold text-primary">
                {selectedIds.length} টি সিলেক্ট করা হয়েছে
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkAlertOpen(true)}
                className="h-7 text-xs flex items-center gap-1"
                disabled={bulkDeleteProduct.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts?.map((product) => {
                  const mainImage = product.images?.find(i => i.is_main) || product.images?.[0];
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <TableRow key={product.id} className={isSelected ? 'bg-primary/5' : ''}>
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(product.id)}
                          aria-label={`Select ${product.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={mainImage?.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category?.name || 'No category'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.product_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {product.sale_price && (
                            <span className="text-muted-foreground line-through text-sm mr-2">
                              ৳{Number(product.price).toLocaleString()}
                            </span>
                          )}
                          <span className="font-medium">
                            ৳{Number(product.sale_price || product.price).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.product_type === 'variable' ? (
                          <span className="text-muted-foreground">
                            {product.variations?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0}
                          </span>
                        ) : (
                          <span className={product.stock_quantity < 10 ? 'text-amber-600' : ''}>
                            {product.stock_quantity}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/product/${product.seo_slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Duplicate"
                            onClick={() => handleDuplicate(product.id)}
                            disabled={duplicateProduct.isPending}
                          >
                            <Copy className="h-4 w-4 text-primary" />
                          </Button>
                          <Link to={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Delete"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation */}
        <AlertDialog open={isBulkAlertOpen} onOpenChange={setIsBulkAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {selectedIds.length} selected product(s) along with their images and variations. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={bulkDeleteProduct.isPending}
              >
                {bulkDeleteProduct.isPending ? 'Deleting...' : `Delete ${selectedIds.length} Products`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Products;
