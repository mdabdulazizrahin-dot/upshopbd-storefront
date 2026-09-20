import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUpdateOrder } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { Package, User, Phone, MapPin, FileText, Truck, CreditCard, Calendar, Save, X, ExternalLink, Link, MessageSquare, ShieldAlert, Ban, Globe } from 'lucide-react';
import CourierNotesModal from './CourierNotesModal';
import { useBlockEntity } from '@/hooks/useCustomers';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variation_attributes: any;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  district?: string;
  upazila?: string;
  order_note?: string;
  order_status: string;
  payment_status: string;
  delivery_type?: string;
  delivery_charge: number;
  subtotal: number;
  total_amount: number;
  created_at: string;
  courier_name?: string;
  tracking_number?: string;
  courier_tracking_link?: string;
  items?: OrderItem[];
  ip_address?: string;
  is_suspicious?: boolean;
  suspicious_reason?: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailsModal = ({ order, open, onOpenChange }: OrderDetailsModalProps) => {
  const updateOrder = useUpdateOrder();
  const blockEntity = useBlockEntity();

  const [isEditing, setIsEditing] = useState(false);
  const [showCourierNotes, setShowCourierNotes] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    order_note: '',
    order_status: '',
    payment_status: '',
    courier_name: '',
    tracking_number: '',
    courier_tracking_link: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customer_name: order.customer_name || '',
        customer_phone: order.customer_phone || '',
        delivery_address: order.delivery_address || '',
        order_note: order.order_note || '',
        order_status: order.order_status || 'pending',
        payment_status: order.payment_status || 'pending',
        courier_name: order.courier_name || '',
        tracking_number: order.tracking_number || '',
        courier_tracking_link: order.courier_tracking_link || '',
      });
      setIsEditing(false);
    }
  }, [order]);

  if (!order) return null;

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

  const handleBlock = async (type: 'phone' | 'ip', value: string) => {
    if (!value) return;
    setBlocking(true);
    try {
      await blockEntity.mutateAsync({
        type,
        value,
        reason: `Blocked from Order #${order.order_number} (${order.customer_name})`,
      });
      toast({
        title: type === 'phone' ? 'ফোন নম্বর ব্লক করা হয়েছে' : 'আইপি ব্লক করা হয়েছে',
        description: `${value} আর কোনো অর্ডার দিতে পারবে না।`,
      });
    } catch (err: any) {
      toast({ title: 'ব্লক ব্যর্থ হয়েছে', description: err.message, variant: 'destructive' });
    } finally {
      setBlocking(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateOrder.mutateAsync({ id: order.id, data: formData });
      toast({ title: 'Success', description: 'Order updated successfully.' });
      setIsEditing(false);
      onOpenChange(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to update order.', variant: 'destructive' });
    }
  };

  const calculatedSubtotal = order.items?.reduce((sum: number, item: any) => sum + (Number(item.unit_price || 0) * Number(item.quantity || 1)), 0) || Number(order.subtotal || 0);
  const deliveryCharge = Number(order.delivery_charge || 0);
  const calculatedTotal = (order.total_amount !== undefined && order.total_amount !== null)
    ? Number(order.total_amount)
    : (calculatedSubtotal + deliveryCharge);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-display">
                Order #{order.order_number}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(formData.order_status)}>
                  {formData.order_status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setShowCourierNotes(true)}>
                  <MessageSquare className="h-4 w-4 mr-1" /> Courier Timeline
                </Button>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateOrder.isPending}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Anti-Bot & Fake Order Banner */}
          {order.is_suspicious ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-900 mt-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-0.5">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-700 flex items-center gap-1.5">
                    সন্দেহজনক বট / ফেক অর্ডার সতর্কতা
                  </h4>
                  <p className="text-xs text-red-600 mt-0.5">
                    শনাক্তকরণের কারণ: <strong>{order.suspicious_reason || 'অস্বাভাবিক কার্যকলাপ বা বট অর্ডার'}</strong>
                  </p>
                  {order.ip_address && (
                    <p className="text-[11px] text-red-500 font-mono mt-0.5">
                      IP Address: {order.ip_address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBlock('phone', order.customer_phone)}
                  disabled={blocking}
                  className="h-8 text-xs gap-1 shadow-sm"
                >
                  <Ban className="h-3.5 w-3.5" />
                  ফোন নম্বর ব্লক
                </Button>
                {order.ip_address && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBlock('ip', order.ip_address!)}
                    disabled={blocking}
                    className="h-8 text-xs gap-1 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    IP ব্লক
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-muted/40 border rounded-lg p-2.5 px-3 flex items-center justify-between text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>অর্ডার আইপি: <strong className="font-mono text-foreground">{order.ip_address || '127.0.0.1'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBlock('phone', order.customer_phone)}
                  disabled={blocking}
                  className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                >
                  <Ban className="h-3 w-3 mr-1" />
                  ফোন ব্লক করুন
                </Button>
                {order.ip_address && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBlock('ip', order.ip_address!)}
                    disabled={blocking}
                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    IP ব্লক করুন
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    {isEditing ? (
                      <Input value={formData.customer_name} onChange={(e) => setFormData(p => ({ ...p, customer_name: e.target.value }))} />
                    ) : (
                      <p className="font-medium">{order.customer_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label>
                    {isEditing ? (
                      <Input value={formData.customer_phone} onChange={(e) => setFormData(p => ({ ...p, customer_phone: e.target.value }))} />
                    ) : (
                      <p className="font-medium">{order.customer_phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</label>
                    {isEditing ? (
                      <Textarea value={formData.delivery_address} onChange={(e) => setFormData(p => ({ ...p, delivery_address: e.target.value }))} rows={2} />
                    ) : (
                      <p className="font-medium">{order.delivery_address}</p>
                    )}
                  </div>
                  {(order.district || order.upazila) && (
                    <div>
                      <label className="text-sm text-muted-foreground">Area</label>
                      <p className="font-medium">{[order.upazila, order.district].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Order Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Order Status</label>
                    {isEditing ? (
                      <Select value={formData.order_status} onValueChange={(v) => setFormData(p => ({ ...p, order_status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Payment Status</label>
                    {isEditing ? (
                      <Select value={formData.payment_status} onValueChange={(v) => setFormData(p => ({ ...p, payment_status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>{order.payment_status}</Badge>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Order Date</label>
                    <p className="font-medium">{new Date(order.created_at).toLocaleString('en-US')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Order Note</label>
                    {isEditing ? (
                      <Textarea value={formData.order_note} onChange={(e) => setFormData(p => ({ ...p, order_note: e.target.value }))} rows={2} placeholder="Additional notes..." />
                    ) : (
                      <p className="font-medium">{order.order_note || 'No notes'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" /> Courier Name</label>
                    {isEditing ? (
                      <Input value={formData.courier_name} onChange={(e) => setFormData(p => ({ ...p, courier_name: e.target.value }))} placeholder="e.g., Pathao, RedX, Steadfast..." />
                    ) : (
                      <p className="font-medium">{order.courier_name || 'Not assigned'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tracking Number</label>
                    {isEditing ? (
                      <Input value={formData.tracking_number} onChange={(e) => setFormData(p => ({ ...p, tracking_number: e.target.value }))} placeholder="Enter tracking number..." />
                    ) : (
                      <p className="font-medium">{order.tracking_number || 'No tracking'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1"><Link className="h-3 w-3" /> Tracking Link</label>
                    {isEditing ? (
                      <Input value={formData.courier_tracking_link} onChange={(e) => setFormData(p => ({ ...p, courier_tracking_link: e.target.value }))} placeholder="https://..." type="url" />
                    ) : order.courier_tracking_link ? (
                      <a href={order.courier_tracking_link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center gap-1">
                        Open Tracking <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="font-medium text-muted-foreground">No tracking link</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-4">
                <Package className="h-4 w-4" /> Ordered Products
              </h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      {item.variation_attributes && typeof item.variation_attributes === 'object' && Object.keys(item.variation_attributes).length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(item.variation_attributes).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">৳{item.unit_price} × {item.quantity}</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold">৳{(item.unit_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4" /> Order Summary
              </h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{calculatedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Delivery ({order.delivery_type === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                </span>
                <span>৳{deliveryCharge.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">৳{calculatedTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <Badge variant="outline">Cash on Delivery</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CourierNotesModal
        orderId={order.id}
        orderNumber={order.order_number}
        open={showCourierNotes}
        onOpenChange={setShowCourierNotes}
      />
    </>
  );
};

export default OrderDetailsModal;
