import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

const extractArray = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  return [];
};

const Dashboard = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      try { return extractArray(await api.get<any>('/orders')); }
      catch { return []; }
    },
  });
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try { return extractArray(await api.get<any>('/products')); }
      catch { return []; }
    },
  });

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o: any) => new Date(o.created_at).toDateString() === today);
  const totalSales = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
  const todaySales = todayOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o: any) => o.order_status === 'pending').length;
  const uniqueCustomers = new Set(orders.map((o: any) => o.customer_phone)).size;

  const statCards = [
    { label: "Today's Orders", value: todayOrders.length, icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: "Today's Sales", value: `৳${todaySales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Total Sales', value: `৳${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { label: 'Total Customers', value: uniqueCustomers, icon: Users, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  ];

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

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to MyHaat BD Admin</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{Number(order.total_amount).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
