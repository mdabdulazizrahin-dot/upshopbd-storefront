import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, Search, XCircle, ExternalLink, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variation_attributes: Record<string, string> | null;
}

interface TrackedOrder {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  district: string;
  upazila: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  created_at: string;
  courier_tracking_link?: string | null;
  items: OrderItem[];
}

const statusSteps = [
  { key: 'pending', icon: Clock, label: 'অপেক্ষমাণ' },
  { key: 'processing', icon: Package, label: 'প্রসেসিং' },
  { key: 'shipped', icon: Truck, label: 'শিপিং' },
  { key: 'delivered', icon: CheckCircle, label: 'ডেলিভারি' },
];

const getStatusStep = (status: string) => statusSteps.findIndex(s => s.key === status);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'অপেক্ষমাণ',
    processing: 'প্রসেসিং',
    shipped: 'শিপিং',
    delivered: 'ডেলিভারি সম্পন্ন',
    cancelled: 'বাতিল',
  };
  return labels[status] || status;
};

const OrderCard = ({ order, defaultOpen }: { order: TrackedOrder; defaultOpen: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const currentStep = getStatusStep(order.order_status);
  const isCancelled = order.order_status === 'cancelled';

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-red-500' : currentStep >= 3 ? 'bg-green-500' : 'bg-primary'}`} />
          <div className="text-left">
            <p className="font-semibold">{order.order_number}</p>
            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-CA')} • ৳{Number(order.total_amount).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${getStatusColor(order.order_status)}`}>
            {getStatusLabel(order.order_status)}
          </Badge>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4">
          {isCancelled ? (
            <div className="flex items-center justify-center py-4 gap-3 text-destructive bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8" />
              <div>
                <p className="font-semibold">অর্ডার বাতিল হয়েছে</p>
                <p className="text-xs text-muted-foreground">এই অর্ডারটি বাতিল করা হয়েছে</p>
              </div>
            </div>
          ) : (
            <div className="relative pt-2">
              <div className="absolute top-7 left-6 right-6 h-1 bg-muted">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }} />
              </div>
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStep;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} ${index === currentStep ? 'ring-4 ring-primary/20' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-sm bg-muted/30 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">ডেলিভারি ঠিকানা</p>
            <p className="font-medium">{[order.upazila, order.district, order.delivery_address].filter(Boolean).join(', ')}</p>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-muted-foreground">৳{Number(item.unit_price).toLocaleString()} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">৳{Number(item.total_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>সাবটোটাল</span><span>৳{Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ডেলিভারি</span><span>৳{Number(order.delivery_charge).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t">
              <span>সর্বমোট</span>
              <span className="text-primary">৳{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {order.courier_tracking_link ? (
            <Button onClick={() => window.open(order.courier_tracking_link!, '_blank')} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />ট্র্যাক পার্সেল
            </Button>
          ) : !isCancelled && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg text-sm">
              <Truck className="h-4 w-4" />ট্র্যাকিং শীঘ্রই আসছে
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderTracking = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    setOrders([]);
    try {
      const res = await api.get<any>(`/track-order?phone=${cleaned}`);
      const data = res?.orders || res?.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      } else {
        setError('এই নাম্বারে কোনো অর্ডার পাওয়া যায়নি');
      }
    } catch {
      setError('এই নাম্বারে কোনো অর্ডার পাওয়া যায়নি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">অর্ডার ট্র্যাক করুন</h1>
                <p className="text-muted-foreground mt-1">আপনার মোবাইল নাম্বার দিয়ে অর্ডার ট্র্যাক করুন</p>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 11)); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="pl-10 h-11 text-base"
                  />
                </div>
                <Button onClick={handleTrack} disabled={loading} className="h-11 px-6">
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'খুঁজছি...' : 'ট্র্যাক করুন'}
                </Button>
              </div>
              {error && <p className="text-destructive text-sm text-center mt-3">{error}</p>}
            </div>

            {searched && orders.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground px-1">{orders.length}টি অর্ডার পাওয়া গেছে</p>
                {orders.map((order, index) => (
                  <OrderCard key={order.id} order={order} defaultOpen={index === 0} />
                ))}
              </div>
            )}

            {searched && orders.length === 0 && !loading && (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি</p>
                  <p className="text-sm text-muted-foreground mt-1">মোবাইল নাম্বারটি সঠিকভাবে লিখুন</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
