import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCustomers, useBlockEntity, CustomerItem } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Users, UserCheck, UserX, ShoppingBag, Search, Eye, ShieldAlert, Phone, Mail, Calendar, RefreshCw, Ban } from 'lucide-react';
import CustomerOrdersModal from '@/components/admin/CustomerOrdersModal';
import BlockedEntitiesModal from '@/components/admin/BlockedEntitiesModal';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'guest'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockTargetCustomer, setBlockTargetCustomer] = useState<CustomerItem | null>(null);

  const { data, isLoading, refetch, isRefetching } = useCustomers({
    search: searchQuery,
    type: activeTab,
  });

  const blockEntity = useBlockEntity();

  const customers = data?.data || [];
  const summary = data?.summary || {
    total_customers: 0,
    registered_count: 0,
    guest_count: 0,
    total_orders: 0,
    total_revenue: 0,
  };

  const handleOpenOrders = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setIsOrdersModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!blockTargetCustomer?.phone) return;
    try {
      await blockEntity.mutateAsync({
        type: 'phone',
        value: blockTargetCustomer.phone,
        reason: `Blocked from Customer Panel (${blockTargetCustomer.name})`,
      });
      toast({
        title: 'কাস্টমার নম্বর সফলভাবে ব্লক করা হয়েছে',
        description: `${blockTargetCustomer.phone} নম্বর থেকে আর কোনো অর্ডার গ্রহণ করা হবে না।`,
      });
      setBlockTargetCustomer(null);
    } catch (err: any) {
      toast({ title: 'ব্লক ব্যর্থ হয়েছে', description: err.message, variant: 'destructive' });
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              কাস্টমার ও ইউজার ম্যানেজমেন্ট
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              ওয়েবসাইটের সকল অ্যাকাউন্টধারী ও গেস্ট কাস্টমারদের বিস্তারিত তথ্য, অর্ডার হিস্ট্রি ও অ্যান্টি-বট নিয়ন্ত্রণ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              রিফ্রেশ
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBlockedModalOpen(true)}
              className="h-9 gap-1.5 shadow-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              বট ও ব্লক লিস্ট
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">মোট কাস্টমার</p>
              <h3 className="text-2xl font-bold font-display text-foreground mt-1">
                {summary.total_customers.toLocaleString()}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">অ্যাকাউন্ট + গেস্ট মিলিয়ে</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">নিবন্ধিত অ্যাকাউন্ট</p>
              <h3 className="text-2xl font-bold font-display text-emerald-600 mt-1">
                {summary.registered_count.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600/80 mt-0.5">ওয়েবসাইটে রেজিস্টার করেছেন</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">গেস্ট কাস্টমার</p>
              <h3 className="text-2xl font-bold font-display text-amber-600 mt-1">
                {summary.guest_count.toLocaleString()}
              </h3>
              <p className="text-[11px] text-amber-600/80 mt-0.5">লগইন ছাড়াই সরাসরি অর্ডার করেছেন</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">মোট কেনাকাটার পরিমাণ</p>
              <h3 className="text-2xl font-bold font-mono text-primary mt-1">
                ৳{summary.total_revenue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">মোট {summary.total_orders}টি সফল অর্ডার</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={(val: any) => setActiveTab(val)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all">
                সকল ({summary.total_customers})
              </TabsTrigger>
              <TabsTrigger value="registered">
                নিবন্ধিত ({summary.registered_count})
              </TabsTrigger>
              <TabsTrigger value="guest">
                গেস্ট ({summary.guest_count})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>কাস্টমার বিবরণ</TableHead>
                <TableHead>যোগাযোগ</TableHead>
                <TableHead>গ্রাহকের ধরন</TableHead>
                <TableHead className="text-center">মোট অর্ডার</TableHead>
                <TableHead className="text-right">মোট খরচ</TableHead>
                <TableHead>কার্যকলাপ / তারিখ</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    কাস্টমার তালিকা লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    কোনো কাস্টমার পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                        {customer.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {customer.type === 'registered' ? `User #${customer.user_id}` : 'Guest Customer'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        {customer.phone && (
                          <div className="text-xs font-mono font-medium flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.email && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {customer.type === 'registered' ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-xs font-medium">
                          <UserCheck className="h-3 w-3 mr-1" />
                          নিবন্ধিত (User)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs font-medium">
                          <UserX className="h-3 w-3 mr-1" />
                          গেস্ট (Guest)
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold text-xs">
                        {customer.orders_count} টি
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-sm text-primary">
                      ৳{customer.total_spent.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {customer.last_order_at ? (
                          <div>
                            <span className="block text-[11px] text-foreground font-medium">শেষ অর্ডার:</span>
                            {formatDate(customer.last_order_at)}
                          </div>
                        ) : (
                          <div>
                            <span className="block text-[11px] text-foreground font-medium">যোগদান:</span>
                            {formatDate(customer.created_at)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenOrders(customer)}
                          className="h-8 text-xs gap-1"
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          অর্ডার দেখুন
                        </Button>
                        {customer.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBlockTargetCustomer(customer)}
                            className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5"
                            title="বট বা ফেক কাস্টমার ব্লক করুন"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Customer Orders History Modal */}
      <CustomerOrdersModal
        customer={selectedCustomer}
        open={isOrdersModalOpen}
        onOpenChange={setIsOrdersModalOpen}
      />

      {/* Blocked Entities Modal */}
      <BlockedEntitiesModal
        open={isBlockedModalOpen}
        onOpenChange={setIsBlockedModalOpen}
      />

      {/* Quick Block Confirmation Dialog */}
      <AlertDialog
        open={!!blockTargetCustomer}
        onOpenChange={(open) => !open && setBlockTargetCustomer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Ban className="h-5 w-5" />
              কাস্টমার ব্লক নিশ্চিতকরণ
            </AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি <strong>{blockTargetCustomer?.name}</strong> ({blockTargetCustomer?.phone}) এর ফোন নম্বরটি ব্লক লিস্টে যুক্ত করতে চান? ব্লক করার পর এই নম্বর থেকে ওয়েবসাইটে কোনো অর্ডার গ্রহণ করা হবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBlock}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              হ্যাঁ, ব্লক করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Customers;
