import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useOrders, useUpdateOrderStatus, useDeleteOrder, useBulkDeleteOrders } from '@/hooks/useOrders';
import { useBookCourier } from '@/hooks/useCourierSettings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Eye, Search, Trash2, ArrowUpDown, Filter, Truck, MessageSquare, PackagePlus, Loader2, ShieldAlert } from 'lucide-react';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import CourierNotesModal from '@/components/admin/CourierNotesModal';
import BlockedEntitiesModal from '@/components/admin/BlockedEntitiesModal';

const Orders = () => {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const bulkDeleteOrder = useBulkDeleteOrders();
  const bookCourier = useBookCourier();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkAlertOpen, setIsBulkAlertOpen] = useState(false);
  const [courierOrder, setCourierOrder] = useState<any>(null);
  const [isCourierOpen, setIsCourierOpen] = useState(false);
  const [bookingOrderId, setBookingOrderId] = useState<string | null>(null);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let filtered = orders.filter((order: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.order_number?.toLowerCase().includes(searchLower) ||
        order.customer_name?.toLowerCase().includes(searchLower) ||
        order.customer_phone?.includes(searchQuery);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'suspicious'
          ? !!order.is_suspicious
          : order.order_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    filtered.sort((a: any, b: any) => {
      let comparison = sortBy === 'date'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : a.total_amount - b.total_amount;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: orders?.length || 0,
    pending: orders?.filter((o: any) => o.order_status === 'pending').length || 0,
    processing: orders?.filter((o: any) => o.order_status === 'processing').length || 0,
    delivered: orders?.filter((o: any) => o.order_status === 'delivered').length || 0,
    cancelled: orders?.filter((o: any) => o.order_status === 'cancelled').length || 0,
    suspicious: orders?.filter((o: any) => o.is_suspicious).length || 0,
  }), [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, order_status: status as any });
      toast({ title: 'Status updated' });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    try {
      await deleteOrder.mutateAsync(deleteOrderId);
      toast({ title: 'Order deleted' });
      setDeleteOrderId(null);
    } catch {
      toast({ title: 'Failed to delete order', variant: 'destructive' });
    }
  };

  const isAllSelected = !!filteredOrders?.length && filteredOrders.every((o: any) => selectedIds.includes(o.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders?.map((o: any) => o.id) || []);
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
      await bulkDeleteOrder.mutateAsync(selectedIds);
      toast({
        title: 'Orders Deleted',
        description: `${selectedIds.length} orders have been deleted successfully.`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected orders.',
        variant: 'destructive',
      });
    }
    setIsBulkAlertOpen(false);
  };

  const handleBookCourier = async (order: any) => {
    setBookingOrderId(order.id);
    try {
      const result: any = await bookCourier.mutateAsync(order.id);
      toast({
        title: '🎉 Booking সফল!',
        description: (result.message || 'Courier booked!') + (result.tracking_number ? ' | Tracking: ' + result.tracking_number : ''),
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Courier booking ব্যর্থ হয়েছে';
      toast({ title: 'ত্রুটি', description: msg, variant: 'destructive' });
    } finally {
      setBookingOrderId(null);
    }
  };

  const toggleSort = (field: 'date' | 'total') => {
    if (sortBy === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Orders</h1>
            <p className="text-muted-foreground">View and manage all orders</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBlockedModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <ShieldAlert className="h-4 w-4" />
            বট ও ব্লক লিস্ট
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl border p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4"><p className="text-sm text-amber-600">Pending</p><p className="text-2xl font-bold text-amber-700">{stats.pending}</p></div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4"><p className="text-sm text-blue-600">Processing</p><p className="text-2xl font-bold text-blue-700">{stats.processing}</p></div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4"><p className="text-sm text-emerald-600">Delivered</p><p className="text-2xl font-bold text-emerald-700">{stats.delivered}</p></div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4"><p className="text-sm text-red-600">Cancelled</p><p className="text-2xl font-bold text-red-700">{stats.cancelled}</p></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="suspicious">🚨 বট / ফেক অর্ডার ({stats.suspicious})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/30 px-4 py-2.5 rounded-lg text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} টি অর্ডার সিলেক্ট করা হয়েছে
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
                disabled={bulkDeleteOrder.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => toggleSort('total')}>
                      Total <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => toggleSort('date')}>
                      Date <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8">Loading orders...</TableCell></TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8">No orders found</TableCell></TableRow>
                ) : (
                  filteredOrders.map((order: any) => {
                    const isSelected = selectedIds.includes(order.id);
                    return (
                    <TableRow key={order.id} className={isSelected ? 'bg-primary/5' : ''}>
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(order.id)}
                          aria-label={`Select order ${order.order_number}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono font-medium text-primary">
                        {order.order_number}
                        {order.is_suspicious && (
                          <Badge variant="destructive" className="ml-1 text-[10px] px-1 py-0 h-4 bg-red-600 font-sans">
                            বট/ফেক
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{order.delivery_address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items?.slice(0, 2).map((item: any, idx: number) => (
                            <p key={idx} className="text-xs">{item.product_name} × {item.quantity}</p>
                          ))}
                          {(order.items?.length || 0) > 2 && <p className="text-xs text-muted-foreground">+{order.items.length - 2} more</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">৳{Number(order.total_amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select value={order.order_status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                          <SelectTrigger className="w-32 h-8">
                            <Badge className={`${getStatusColor(order.order_status)} text-xs`}>{order.order_status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Courier Column */}
                      <TableCell>
                        <div className="space-y-1.5 min-w-[140px]">
                          {order.courier_name && (
                            <div className="flex items-center gap-1 text-xs">
                              <Truck className="h-3 w-3 text-blue-500" />
                              <span className="font-medium text-blue-700">{order.courier_name}</span>
                            </div>
                          )}
                          {order.tracking_number && (
                            <p className="text-xs text-muted-foreground font-mono">{order.tracking_number}</p>
                          )}
                          {/* Book Courier - শুধু tracking নেই এবং cancelled/delivered না হলে দেখাবে */}
                          {!order.tracking_number && !['delivered', 'cancelled'].includes(order.order_status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs text-green-700 border-green-300 hover:bg-green-50 w-full"
                              onClick={() => handleBookCourier(order)}
                              disabled={bookingOrderId === order.id}
                            >
                              {bookingOrderId === order.id
                                ? <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                : <PackagePlus className="h-3 w-3 mr-1" />
                              }
                              Book Courier
                            </Button>
                          )}
                          {/* Courier Note Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 w-full"
                            onClick={() => { setCourierOrder(order); setIsCourierOpen(true); }}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Courier Note
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        <p>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteOrderId(order.id)}>
                            <Trash2 className="h-4 w-4" />
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
        </div>

        {!isLoading && <p className="text-sm text-muted-foreground">Showing {filteredOrders.length} orders</p>}
      </div>

      <OrderDetailsModal order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />

      {courierOrder && (
        <CourierNotesModal
          orderId={String(courierOrder.id)}
          orderNumber={courierOrder.order_number}
          open={isCourierOpen}
          onOpenChange={setIsCourierOpen}
        />
      )}

      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkAlertOpen} onOpenChange={setIsBulkAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} selected order(s) along with their order items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleteOrder.isPending}
            >
              {bulkDeleteOrder.isPending ? 'Deleting...' : `Delete ${selectedIds.length} Orders`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Blocked Entities Modal */}
      <BlockedEntitiesModal
        open={isBlockedModalOpen}
        onOpenChange={setIsBlockedModalOpen}
      />
    </AdminLayout>
  );
};

export default Orders;
