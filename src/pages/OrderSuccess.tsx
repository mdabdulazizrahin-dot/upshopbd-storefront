import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Truck, CheckCircle, Package, ChevronRight, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variation_attributes: any;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  district: string;
  upazila: string;
  order_status: string;
  payment_status: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  created_at: string;
  courier_tracking_link?: string | null;
  items?: OrderItem[];
}

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setIsLoading(false); return; }
      try {
        const res = await api.get<any>(`/orders/${orderId}`);
        const data = res?.order || res?.data || res;
        setOrder(data);
      } catch {
        // order not found
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const statusSteps = [
    { key: 'ordered', label: 'Ordered', icon: ShoppingBag },
    { key: 'approved', label: 'Approved', icon: CheckCircle },
    { key: 'shipping', label: 'Shipping', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-CA');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">অর্ডার পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">অর্ডারের তথ্য পাওয়া যাচ্ছে না।</p>
            <Link to="/shop"><Button>কেনাকাটা চালিয়ে যান</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep = getStatusStep(order.order_status);
  const shippingAddress = [order.district, order.upazila, order.delivery_address].filter(Boolean).join(' > ');

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">অর্ডার</Link>
            <ChevronRight className="h-4 w-4" />
            <span>ইনভয়েস</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{order.order_number}</span>
          </nav>

          <div className="bg-card border border-border rounded-lg p-6">
            <h1 className="text-xl md:text-2xl font-bold text-primary text-center mb-8">
              ধন্যবাদ! আপনি সফলভাবে অর্ডারটি প্লেস করেছেন!
            </h1>

            <div className="border border-border rounded-lg p-6 max-w-3xl mx-auto">
              {/* Status Stepper */}
              <div className="flex items-center justify-between mb-8">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStep;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className="flex items-center w-full">
                        {index > 0 && <div className={`flex-1 h-0.5 ${index <= currentStep ? 'bg-primary' : 'bg-border'}`} />}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${index < currentStep ? 'bg-primary' : 'bg-border'}`} />}
                      </div>
                      <span className={`text-xs mt-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div><span className="text-muted-foreground">Phone: </span><span className="font-medium">{order.customer_phone}</span></div>
                <div className="text-right"><span className="text-muted-foreground">ID# </span><span className="font-medium">{order.order_number}</span></div>
                <div><span className="text-muted-foreground">Name: </span><span className="font-medium">{order.customer_name}</span></div>
                <div className="text-right"><span className="text-muted-foreground">Date: </span><span className="font-medium">{formatDate(order.created_at)}</span></div>
                <div><span className="text-muted-foreground">Price: </span><span className="font-medium">{order.subtotal}</span></div>
                <div className="text-right"><span className="text-muted-foreground">Charge: </span><span className="font-medium">{order.delivery_charge}</span></div>
                <div><span className="text-muted-foreground">Total: </span><span className="font-bold text-primary">{order.total_amount}</span></div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 uppercase">{order.payment_status}</Badge>
                </div>
              </div>

              <div className="text-sm mb-6">
                <span className="text-muted-foreground">Shipping Address: </span>
                <span className="font-medium">{shippingAddress}</span>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="border-t border-border pt-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted rounded border flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity} x {item.unit_price}</p>
                        {item.variation_attributes && typeof item.variation_attributes === 'object' && (
                          <p className="text-sm text-muted-foreground">
                            {Object.entries(item.variation_attributes).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-primary mt-1">BDT {item.total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                {order.courier_tracking_link ? (
                  <Button onClick={() => window.open(order.courier_tracking_link!, '_blank')} className="gap-2">
                    <ExternalLink className="h-4 w-4" />ট্র্যাক পার্সেল
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm">ট্র্যাকিং শীঘ্রই আসছে</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
              অর্ডার স্ট্যাটাস চেক করতে লগইন করে অর্ডার ট্র্যাকিং অপশনে মোবাইল নাম্বার দিয়ে ট্র্যাক করতে পারবেন।
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
