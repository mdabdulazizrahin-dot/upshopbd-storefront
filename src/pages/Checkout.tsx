import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDistricts, useUpazilas, useDeliverySettings, getDeliveryCharge } from '@/hooks/useLocation';
import { toast } from '@/hooks/use-toast';
import { ShoppingBag, Loader2, Trash2, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { data: districts, isLoading: districtsLoading } = useDistricts();
  const { data: deliverySettings } = useDeliverySettings();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    district: '',
    upazila: '',
    orderNote: '',
    deliveryType: 'inside_dhaka' as 'inside_dhaka' | 'outside_dhaka',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState<{ orderNumber: string; orderId: string } | null>(null);
  const [botTrapField, setBotTrapField] = useState('');
  const { data: upazilas, isLoading: upazilasLoading } = useUpazilas(formData.district);
  const isInsideDhaka = formData.deliveryType === 'inside_dhaka';
  const deliveryCharge = useMemo(() => getDeliveryCharge(deliverySettings, isInsideDhaka), [deliverySettings, isInsideDhaka]);
  const total = subtotal + deliveryCharge;

  const getSessionId = () => {
    let sid = localStorage.getItem('checkout_session');
    if (!sid) { sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2); localStorage.setItem('checkout_session', sid); }
    return sid;
  };
  const sessionId = useRef<string>(getSessionId());

  // Auto-save abandoned checkout - শুধু full form + valid BD phone হলে
  useEffect(() => {
    const isFormComplete =
      formData.fullName.trim().length >= 2 &&
      BD_PHONE_REGEX.test(formData.phone) &&
      formData.address.trim().length >= 5 &&
      formData.district !== '' &&
      formData.upazila !== '' &&
      items.length > 0;

    if (!isFormComplete) return;

    const timer = setTimeout(async () => {
      try {
        const selectedDistrict = districts?.find(d => d.id === formData.district);
        const selectedUpazila = upazilas?.find(u => u.id === formData.upazila);
        const orderItems = items.map(item => {
          const price = item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? item.product.salePrice ?? item.product.price;
          const mainImage = item.product.images?.find((img: any) => img.isMain) || item.product.images?.[0];
          return {
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: price,
            total_price: price * item.quantity,
            image_url: mainImage?.url || null,
          };
        });
        await api.post('/abandoned-checkout/save', {
          session_id: sessionId.current,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          district: selectedDistrict?.name || formData.district,
          upazila: selectedUpazila?.name || formData.upazila,
          delivery_address: formData.address,
          subtotal: subtotal,
          delivery_charge: deliveryCharge,
          total_amount: subtotal + deliveryCharge,
          items: orderItems,
        });
      } catch {}
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData, subtotal, deliveryCharge, items]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      // ৩ ডিজিটের পর শুধু 01[3-9] prefix allow
      if (digitsOnly.length >= 3 && !/^01[3-9]/.test(digitsOnly)) return;
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      return;
    }
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'district') {
        updated.upazila = '';
        const selectedDistrict = districts?.find(d => d.id === value);
        if (selectedDistrict) {
          const isDhaka = selectedDistrict.id === 'dhaka' || selectedDistrict.id === 'gazipur' || selectedDistrict.id === 'narayanganj';
          updated.deliveryType = isDhaka ? 'inside_dhaka' : 'outside_dhaka';
        }
      }
      return updated;
    });
  };

  const isPhoneValid = BD_PHONE_REGEX.test(formData.phone);
  const showPhoneError = formData.phone.length > 0 && !isPhoneValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.district || !formData.upazila) {
      toast({ title: 'তথ্য অসম্পূর্ণ', description: 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।', variant: 'destructive' });
      return;
    }
    if (!isPhoneValid) {
      toast({ title: 'ভুল মোবাইল নম্বর', description: 'বাংলাদেশের সঠিক মোবাইল নম্বর দিন। যেমন: 01XXXXXXXXX', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedDistrict = districts?.find(d => d.id === formData.district);
      const selectedUpazila = upazilas?.find(u => u.id === formData.upazila);
      const orderItems = items.map(item => {
        const price = item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? item.product.salePrice ?? item.product.price;
        return {
          product_id: item.productId,
          product_name: item.product.name,
          variation_id: item.variationId || null,
          variation_attributes: item.selectedVariation?.attributes || null,
          quantity: item.quantity,
          unit_price: price,
          total_price: price * item.quantity,
        };
      });
      const response = await api.post<{ order: { id: any; order_number: string } }>('/orders', {
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        district: selectedDistrict?.name || formData.district,
        upazila: selectedUpazila?.name || formData.upazila,
        order_note: formData.orderNote || null,
        delivery_type: formData.deliveryType,
        delivery_charge: deliveryCharge,
        subtotal: subtotal,
        total_amount: total,
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'pending',
        user_id: user?.id || null,
        bot_trap_field: botTrapField,
        items: orderItems,
      });
      const orderNumber = response.order.order_number;
      const orderId = String(response.order.id);
      setCompletedOrderData({ orderNumber, orderId });
      setShowSuccessPopup(true);
      clearCart();
      try { await api.post('/abandoned-checkout/delete', { session_id: sessionId.current }); localStorage.removeItem('checkout_session'); } catch {}
    } catch (error: any) {
      toast({ title: 'অর্ডার ব্যর্থ হয়েছে', description: error.message || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !showSuccessPopup) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">আপনার কার্ট খালি</h1>
            <p className="text-muted-foreground mb-6">চেকআউট করতে কিছু পণ্য যোগ করুন।</p>
            <Link to="/shop"><Button size="lg">পণ্য দেখুন</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">হোম</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/cart" className="hover:text-primary">অর্ডার</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">অর্ডার কনফার্ম</span>
          </nav>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-center mb-6">
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
                <ChevronLeft className="h-4 w-4" />
                অর্ডার লিস্টে আরো আইটেম যুক্ত করুন
              </Link>
            </div>
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left: Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Anti-Bot Honeypot Trap - Invisible to real humans */}
                  <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="bot_trap_field">Do not fill this field</label>
                    <input
                      type="text"
                      name="bot_trap_field"
                      id="bot_trap_field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botTrapField}
                      onChange={(e) => setBotTrapField(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">আপনার নাম <span className="text-destructive">*</span></label>
                      <Input value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="আপনার সম্পূর্ণ নাম লিখুন" className="h-11" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">ফোন নাম্বার <span className="text-destructive">*</span></label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className={`h-11 ${showPhoneError ? 'border-destructive' : ''}`}
                        required
                      />
                      {showPhoneError && (
                        <p className="text-xs text-destructive mt-1">সঠিক বাংলাদেশি নম্বর দিন (01[3-9]XXXXXXXX)</p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">জেলা <span className="text-destructive">*</span></label>
                      {districtsLoading ? <Skeleton className="h-11" /> : (
                        <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="জেলা নির্বাচন করুন" /></SelectTrigger>
                          <SelectContent>
                            {districts?.map((d) => (
                              <SelectItem key={d.id} value={d.id}>{d.name} ({d.name_bn})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">থানা/উপজেলা <span className="text-destructive">*</span></label>
                      {upazilasLoading ? <Skeleton className="h-11" /> : (
                        <Select value={formData.upazila} onValueChange={(value) => handleInputChange('upazila', value)} disabled={!formData.district}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="উপজেলা নির্বাচন করুন" /></SelectTrigger>
                          <SelectContent>
                            {upazilas?.map((u) => (
                              <SelectItem key={u.id} value={u.id}>{u.name} ({u.name_bn})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">সম্পূর্ণ ঠিকানা <span className="text-destructive">*</span></label>
                    <Textarea value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন" className="min-h-[100px] resize-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">অতিরিক্ত তথ্য <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <Textarea value={formData.orderNote} onChange={(e) => handleInputChange('orderNote', e.target.value)} placeholder="অর্ডার সম্পর্কিত অতিরিক্ত তথ্য" className="min-h-[80px] resize-none" />
                  </div>
                </form>
              </div>

              {/* Right: Order Summary */}
              <div className="space-y-4">
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = item.selectedVariation?.salePrice ?? item.selectedVariation?.price ?? item.product.salePrice ?? item.product.price;
                    const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
                    return (
                      <div key={`${item.productId}-${item.variationId}`} className="flex gap-4 pb-4 border-b">
                        <img src={mainImage?.url} alt={item.product.name} className="w-20 h-24 object-cover rounded border" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">Quantity: {item.quantity} x {price.toLocaleString()}</p>
                          {item.selectedVariation && (
                            <p className="text-sm text-muted-foreground">
                              {Object.entries(item.selectedVariation.attributes).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-1">BDT {(price * item.quantity).toLocaleString()}</p>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.productId, item.variationId)} className="text-destructive hover:text-destructive/80 self-start">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">টোটাল প্রাইস</span>
                    <span className="font-medium">{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                    <span className="font-medium">{formData.district ? deliveryCharge.toLocaleString() : '---'}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2">
                    <span className="text-muted-foreground">সর্বমোট টাকা</span>
                    <span className="font-bold text-primary text-lg">{formData.district ? total.toLocaleString() : subtotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 border rounded text-sm font-medium bg-muted/50">ক্যাশ অন ডেলিভারি</span>
                </div>
                <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold mt-4" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />প্রক্রিয়াকরণ হচ্ছে...</> : 'অর্ডার কনফার্ম করুন »'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">ধন্যবাদ!</h2>
            <p className="text-muted-foreground">আপনি সফলভাবে অর্ডারটি প্লেস করেছেন</p>
            <Button onClick={() => { setShowSuccessPopup(false); navigate('/order-success', { state: { orderNumber: completedOrderData?.orderNumber, orderId: completedOrderData?.orderId } }); }} className="px-8 mt-2">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
