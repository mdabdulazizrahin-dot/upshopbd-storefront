import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomerItem, useCustomerOrders } from '@/hooks/useCustomers';
import { ShoppingBag, Calendar, Phone, Mail, UserCheck, UserX, Loader2 } from 'lucide-react';

interface CustomerOrdersModalProps {
  customer: CustomerItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerOrdersModal = ({ customer, open, onOpenChange }: CustomerOrdersModalProps) => {
  const { data, isLoading } = useCustomerOrders({
    userId: customer?.user_id,
    phone: customer?.phone,
  });

  if (!customer) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">অপেক্ষমাণ (Pending)</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">প্রসেসিং (Processing)</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">শিপড (Shipped)</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">ডেলিভারড (Delivered)</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">বাতিল (Cancelled)</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {customer.type === 'registered' ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  {customer.name}
                  {customer.type === 'registered' ? (
                    <Badge className="bg-emerald-600 text-white text-xs">নিবন্ধিত অ্যাকাউন্ট</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">গেস্ট কাস্টমার</Badge>
                  )}
                </DialogTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  {customer.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {customer.phone}
                    </span>
                  )}
                  {customer.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {customer.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground">মোট কেনাকাটা</div>
              <div className="text-lg font-bold text-primary font-mono">
                ৳{(customer.total_spent || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto my-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>অর্ডার হিস্ট্রি লোড হচ্ছে...</span>
            </div>
          ) : !data?.orders || data.orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>কোনো অর্ডার পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>অর্ডার নম্বর</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>পণ্য বিবরণ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">মোট টাকা</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium text-xs">
                        {order.order_number}
                        {order.is_suspicious && (
                          <span className="block text-[10px] text-red-600 font-sans font-bold">
                            ⚠️ সন্দেহজনক অর্ডার
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-1">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="line-clamp-1">
                                • {item.product_name} <span className="text-muted-foreground">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">তথ্য নেই</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm">
                        ৳{Number(order.total_amount || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrdersModal;
