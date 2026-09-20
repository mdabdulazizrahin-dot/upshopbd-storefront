import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAbandonedCheckouts, useDeleteAbandonedCheckout, AbandonedCheckout } from '@/hooks/useAbandonedCheckouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, Search, Trash2, Phone, ArrowUpDown, ShoppingCart, User, MapPin, Package } from 'lucide-react';

// items field থেকে product list বের করা
const getItems = (checkout: any) => {
  return checkout.items || checkout.cart_items || [];
};

const getProductName = (item: any) => item.product_name || item.productName || '-';
const getUnitPrice = (item: any) => Number(item.unit_price ?? item.price ?? 0);
const getQty = (item: any) => item.quantity || 1;

const AbandonedCheckouts = () => {
  const { data: checkouts, isLoading } = useAbandonedCheckouts();
  const deleteCheckout = useDeleteAbandonedCheckout();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCheckout, setSelectedCheckout] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredCheckouts = useMemo(() => {
    if (!checkouts) return [];
    let filtered = (checkouts as any[]).filter(checkout => {
      const searchLower = searchQuery.toLowerCase();
      const items = getItems(checkout);
      return (
        checkout.customer_name?.toLowerCase().includes(searchLower) ||
        checkout.customer_phone?.includes(searchQuery) ||
        checkout.delivery_address?.toLowerCase().includes(searchLower) ||
        items?.some((item: any) => getProductName(item).toLowerCase().includes(searchLower))
      );
    });
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      else comparison = (a.total_amount || 0) - (b.total_amount || 0);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [checkouts, searchQuery, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'total') => {
    if (sortBy === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCheckout.mutateAsync(deleteId);
      toast({ title: 'সফল', description: 'রেকর্ড মুছে ফেলা হয়েছে।' });
      setDeleteId(null);
    } catch {
      toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ হয়েছে।', variant: 'destructive' });
    }
  };

  const stats = useMemo(() => {
    if (!checkouts) return { total: 0, withPhone: 0, totalValue: 0 };
    return {
      total: (checkouts as any[]).length,
      withPhone: (checkouts as any[]).filter(c => c.customer_phone?.length === 11).length,
      totalValue: (checkouts as any[]).reduce((sum, c) => sum + (c.total_amount || 0), 0),
    };
  }, [checkouts]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Inactive Orders</h1>
          <p className="text-muted-foreground">Checkout form fill-up করে order confirm করে নাই</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Inactive</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
          <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><p className="text-sm text-amber-600">With Phone</p><p className="text-2xl font-bold text-amber-700">{stats.withPhone}</p></CardContent></Card>
          <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><p className="text-sm text-emerald-600">Contactable</p><p className="text-2xl font-bold text-emerald-700">{stats.withPhone}</p></CardContent></Card>
          <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><p className="text-sm text-blue-600">Potential Value</p><p className="text-2xl font-bold text-blue-700">৳{stats.totalValue.toLocaleString()}</p></CardContent></Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="নাম, ফোন বা পণ্য দিয়ে খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Badge variant="outline" className="h-10 px-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />Inactive Orders
          </Badge>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead><Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => toggleSort('total')}>Total <ArrowUpDown className="h-3 w-3 ml-1" /></Button></TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => toggleSort('date')}>Date <ArrowUpDown className="h-3 w-3 ml-1" /></Button></TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : filteredCheckouts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">{searchQuery ? 'No results found' : 'No inactive orders yet'}</TableCell></TableRow>
                ) : filteredCheckouts.map((checkout) => {
                  const items = getItems(checkout);
                  return (
                    <TableRow key={checkout.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{checkout.customer_name || 'N/A'}</p>
                          {checkout.customer_phone ? (
                            <a href={`tel:${checkout.customer_phone}`} className="text-xs text-primary hover:underline">{checkout.customer_phone}</a>
                          ) : <p className="text-xs text-muted-foreground">No phone</p>}
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{checkout.district || ''} {checkout.upazila ? `- ${checkout.upazila}` : ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {items.slice(0, 2).map((item: any, idx: number) => (
                            <div key={idx}>
                              <p className="text-xs font-medium">{getProductName(item)} × {getQty(item)}</p>
                              <p className="text-xs text-muted-foreground">৳{getUnitPrice(item).toLocaleString()}</p>
                            </div>
                          ))}
                          {items.length > 2 && <p className="text-xs text-muted-foreground">+{items.length - 2} more</p>}
                          {items.length === 0 && <p className="text-xs text-muted-foreground">-</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">৳{Number(checkout.total_amount || 0).toLocaleString()}</TableCell>
                      <TableCell><Badge className="bg-amber-100 text-amber-800">Inactive</Badge></TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <p>{new Date(checkout.updated_at).toLocaleDateString('en-CA')}</p>
                          <p className="text-xs text-muted-foreground">{new Date(checkout.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCheckout(checkout); setIsDetailsOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(checkout.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        {!isLoading && <p className="text-sm text-muted-foreground">Showing {filteredCheckouts.length} inactive orders</p>}
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Inactive Order Details</DialogTitle></DialogHeader>
          {selectedCheckout && (() => {
            const items = getItems(selectedCheckout);
            return (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2"><User className="h-4 w-4" />Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{selectedCheckout.customer_name || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span>
                        {selectedCheckout.customer_phone ? <a href={`tel:${selectedCheckout.customer_phone}`} className="font-medium text-primary hover:underline">{selectedCheckout.customer_phone}</a> : <span>-</span>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" />Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">District:</span><span className="font-medium">{selectedCheckout.district || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Upazila:</span><span className="font-medium">{selectedCheckout.upazila || '-'}</span></div>
                      <div><span className="text-muted-foreground">Address:</span><p className="font-medium mt-1">{selectedCheckout.delivery_address || '-'}</p></div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">পণ্যের তালিকা ({items.length}টি)</h4>
                  <div className="border rounded-lg divide-y">
                    {items.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">কোনো পণ্য নেই</div>
                    ) : items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4">
                        {(item.image_url || item.imageUrl) && (
                          <img src={item.image_url || item.imageUrl} alt={getProductName(item)} className="w-16 h-16 object-cover rounded border flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{getProductName(item)}</p>
                          {item.variation_attributes && Object.keys(item.variation_attributes).length > 0 && (
                            <p className="text-sm text-muted-foreground">{Object.entries(item.variation_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
                          )}
                          <p className="text-sm text-muted-foreground">৳{getUnitPrice(item).toLocaleString()} × {getQty(item)}</p>
                        </div>
                        <p className="font-semibold text-primary">৳{(getUnitPrice(item) * getQty(item)).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{Number(selectedCheckout.subtotal || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery Charge</span><span>৳{Number(selectedCheckout.delivery_charge || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-primary">৳{Number(selectedCheckout.total_amount || 0).toLocaleString()}</span></div>
                </div>

                {selectedCheckout.customer_phone && (
                  <div className="flex gap-3">
                    <a href={`tel:${selectedCheckout.customer_phone}`} className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors">
                      <Phone className="h-4 w-4" />Call Customer
                    </a>
                    <a href={`https://wa.me/88${selectedCheckout.customer_phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>রেকর্ড মুছে ফেলুন?</AlertDialogTitle>
            <AlertDialogDescription>এই inactive order রেকর্ডটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AbandonedCheckouts;
