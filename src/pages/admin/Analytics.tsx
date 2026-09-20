import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';

const extractArray = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  return [];
};

const Analytics = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['analytics-orders'],
    queryFn: async () => {
      try { return extractArray(await api.get<any>('/orders')); }
      catch { return []; }
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['analytics-products'],
    queryFn: async () => {
      try { return extractArray(await api.get<any>('/products')); }
      catch { return []; }
    },
  });

  // Last 7 days sales data
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toDateString();
    const dayOrders = orders?.filter((o: any) => new Date(o.created_at).toDateString() === dateStr) || [];
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: dayOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0),
      orders: dayOrders.length,
    };
  });

  const totalSales = orders?.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0) || 0;
  const uniqueCustomers = new Set(orders?.map((o: any) => o.customer_phone)).size;

  const statCards = [
    { label: 'Total Orders', value: orders?.length || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Sales', value: `৳${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Products', value: products?.length || 0, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Customers', value: uniqueCustomers, icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground">Sales overview and statistics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Sales Last 7 Days (৳)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, 'Sales']} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Orders Last 7 Days</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <div key={status} className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{orders?.filter((o: any) => o.order_status === status).length || 0}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
