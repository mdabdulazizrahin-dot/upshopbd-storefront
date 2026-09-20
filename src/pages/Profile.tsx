import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrders, useCancelOrder } from '@/hooks/useUserOrders';
import { useWishlist } from '@/hooks/useWishlist';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  X,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import CourierNotesModal from '@/components/admin/CourierNotesModal';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useUserOrders(user?.id);
  const { wishlistItems } = useWishlist();
  const cancelOrder = useCancelOrder();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  
  // Courier notes state
  const [courierNotesOrder, setCourierNotesOrder] = useState<{ id: string; orderNumber: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: (user as any).name || '',
        phone: (user as any).phone || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', formData);
      if (refreshProfile) {
        await refreshProfile();
      }
      setIsEditing(false);
      toast({ title: 'সফল!', description: 'প্রোফাইল আপডেট হয়েছে' });
    } catch {
      toast({ title: 'ত্রুটি', description: 'প্রোফাইল আপডেট ব্যর্থ হয়েছে', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;
    
    try {
      await cancelOrder.mutateAsync(cancelOrderId);
      toast({ title: 'সফল!', description: 'অর্ডার ক্যান্সেল হয়েছে' });
      setCancelOrderId(null);
    } catch (error: any) {
      toast({ title: 'ত্রুটি', description: 'অর্ডার ক্যান্সেল ব্যর্থ হয়েছে', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'পেন্ডিং';
      case 'processing': return 'প্রসেসিং';
      case 'shipped': return 'শিপড';
      case 'delivered': return 'ডেলিভারড';
      case 'cancelled': return 'ক্যান্সেলড';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Clock;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container-custom py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.order_status === 'pending').length || 0,
    processing: orders?.filter(o => o.order_status === 'processing').length || 0,
    delivered: orders?.filter(o => o.order_status === 'delivered').length || 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container-custom py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {user?.name || 'User'}
            </h1>
            {user?.email && !user.email.endsWith('@phone.upshopbd.com') && (
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            )}
            {user?.phone && (
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4" />
                {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{orderStats.total}</div>
              <div className="text-sm text-muted-foreground">মোট অর্ডার</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-warning">{orderStats.pending}</div>
              <div className="text-sm text-muted-foreground">পেন্ডিং</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-accent-foreground">{orderStats.processing}</div>
              <div className="text-sm text-muted-foreground">প্রসেসিং</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{orderStats.delivered}</div>
              <div className="text-sm text-muted-foreground">ডেলিভারড</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-card border border-border w-full md:w-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">অর্ডার</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">উইশলিস্ট</span>
              {wishlistItems.length > 0 && (
                <Badge variant="secondary" className="ml-1">{wishlistItems.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">একাউন্ট</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  আমার অর্ডার সমূহ
                </CardTitle>
                <CardDescription>
                  আপনার সকল অর্ডারের তালিকা এবং স্ট্যাটাস
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(order.order_status);
                      return (
                        <div 
                          key={order.id} 
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <StatusIcon className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{order.order_number}</span>
                                <Badge variant="outline" className={getStatusColor(order.order_status)}>
                                  {getStatusLabel(order.order_status)}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{formatDate(order.created_at)}</p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {[order.district, order.upazila].filter(Boolean).join(', ')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                ৳{order.total_amount.toLocaleString('bn-BD')}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => navigate(`/order-success`, { state: { orderId: order.id } })}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  দেখুন
                                </Button>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => setCourierNotesOrder({ id: order.id, orderNumber: order.order_number })}
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        কুরিয়ার
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>কুরিয়ার টাইমলাইন দেখুন</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {order.courier_tracking_link ? (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => window.open(order.courier_tracking_link!, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    ট্র্যাক পার্সেল
                                  </Button>
                                ) : !['delivered', 'cancelled'].includes(order.order_status) ? (
                                  <Button size="sm" variant="outline" disabled className="opacity-60">
                                    <Truck className="h-4 w-4 mr-1" />ট্র্যাকিং শীঘ্রই আসছে
                                  </Button>
                                ) : null}
                                {order.order_status === 'pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => setCancelOrderId(order.id)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    ক্যান্সেল
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      কোনো অর্ডার নেই
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      আপনি এখনো কোনো অর্ডার দেননি
                    </p>
                    <Button onClick={() => navigate('/shop')}>
                      শপিং শুরু করুন
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  আমার উইশলিস্ট
                </CardTitle>
                <CardDescription>
                  আপনার পছন্দের পণ্য সমূহ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => {
                      const prod = item.product || item.products;
                      const mainImage = prod?.product_images?.find((img: any) => img.is_main) || 
                                        prod?.product_images?.[0];
                      return (
                        <div 
                          key={item.id} 
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/product/${prod?.seo_slug || prod?.id}`)}
                        >
                          <div className="flex gap-4">
                            {mainImage?.image_url ? (
                              <img 
                                src={mainImage.image_url} 
                                alt={prod?.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-2">{prod?.name}</h4>
                              <p className="text-primary font-bold mt-1">
                                ৳{prod?.sale_price || prod?.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      উইশলিস্ট খালি
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      পছন্দের পণ্য যোগ করুন
                    </p>
                    <Button onClick={() => navigate('/shop')}>
                      পণ্য দেখুন
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      একাউন্ট তথ্য
                    </CardTitle>
                    <CardDescription>
                      আপনার প্রোফাইল তথ্য আপডেট করুন
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      এডিট
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              phone: user.phone || '',
                            });
                          }
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        বাতিল
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'সেভ হচ্ছে...' : 'সেভ'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">নাম</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="আপনার নাম"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.name || 'সেট করা নেই'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">ইমেইল</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user?.email && !user.email.endsWith('@phone.upshopbd.com')
                          ? user.email
                          : 'ফোন নম্বর দিয়ে খোলা অ্যাকাউন্ট (ইমেইল নেই)'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">ফোন নাম্বার</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="আপনার ফোন নাম্বার"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.phone || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>একাউন্ট তৈরি</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{user.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Cancel Order Dialog */}
      <AlertDialog open={!!cancelOrderId} onOpenChange={() => setCancelOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>অর্ডার ক্যান্সেল করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই অর্ডারটি ক্যান্সেল করলে আর ফিরিয়ে আনা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>না</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelOrder}
              className="bg-destructive hover:bg-destructive/90"
            >
              হ্যাঁ, ক্যান্সেল করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Courier Notes Modal */}
      {courierNotesOrder && (
        <CourierNotesModal
          orderId={courierNotesOrder.id}
          orderNumber={courierNotesOrder.orderNumber}
          open={!!courierNotesOrder}
          onOpenChange={(open) => {
            if (!open) setCourierNotesOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
