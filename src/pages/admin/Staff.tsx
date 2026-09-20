import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useStaffUsers, 
  useCreateStaff, 
  useUpdateStaff, 
  useDeleteStaff, 
  StaffUser, 
  StaffRole 
} from '@/hooks/useStaff';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Shield, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Briefcase, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const AVAILABLE_PERMISSIONS: { id: string; label: string; group: string }[] = [
  { id: 'dashboard', label: 'ড্যাশবোর্ড ওভারভিউ', group: 'সাধারণ' },
  { id: 'orders', label: 'অর্ডার পরিচালনা ও স্ট্যাটাস', group: 'অর্ডার ও কাস্টমার' },
  { id: 'abandoned_checkouts', label: 'ইনঅ্যাক্টিভ অর্ডার (Abandoned)', group: 'অর্ডার ও কাস্টমার' },
  { id: 'customers', label: 'কাস্টমার ও অ্যান্টি-বট লিস্ট', group: 'অর্ডার ও কাস্টমার' },
  { id: 'products', label: 'প্রোডাক্ট যোগ ও এডিট', group: 'ক্যাটালগ' },
  { id: 'categories', label: 'ক্যাটাগরি ম্যানেজমেন্ট', group: 'ক্যাটালগ' },
  { id: 'banners', label: 'ব্যানার ও স্লাইডার', group: 'ডিজাইন ও কনটেন্ট' },
  { id: 'home_sections', label: 'হোম পেজ সেকশন', group: 'ডিজাইন ও কনটেন্ট' },
  { id: 'pages', label: 'কাস্টম পেজ ও পলিসি', group: 'ডিজাইন ও কনটেন্ট' },
  { id: 'courier', label: 'কুরিয়ার সেটিংস ও বুকিং', group: 'লজিস্টিক' },
  { id: 'delivery', label: 'ডেলিভারি চার্জ নির্ধারণ', group: 'লজিস্টিক' },
  { id: 'analytics', label: 'সেলস ও রিপোর্ট অ্যানালিটিক্স', group: 'রিপোর্ট' },
  { id: 'google_sheets', label: 'গুগল শিট সিন্ক', group: 'ইন্টিগ্রেশন' },
  { id: 'staff', label: 'স্টাফ ও পারমিশন কন্ট্রোল', group: 'অ্যাডমিন' },
  { id: 'settings', label: 'সাইট সেটিংস ও কনফিগারেশন', group: 'অ্যাডমিন' },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: ['all', ...AVAILABLE_PERMISSIONS.map(p => p.id)],
  moderator: ['dashboard', 'orders', 'abandoned_checkouts', 'customers', 'courier', 'delivery', 'analytics'],
  editor: ['dashboard', 'products', 'categories', 'banners', 'home_sections', 'pages'],
  viewer: ['dashboard', 'products', 'categories', 'orders', 'analytics'],
};

export const ROLE_DEFINITIONS: Record<StaffRole, { 
  name: string; 
  badgeClass: string; 
  description: string; 
  features: string[];
}> = {
  admin: {
    name: 'অ্যাডমিন (Admin)',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200',
    description: 'সাইটের সমস্ত কিছু নিয়ন্ত্রণ, সেটিংস ও স্টাফ পরিচালনা করার সম্পূর্ণ এক্সেস।',
    features: ['সমস্ত সেকশন এক্সেস', 'স্টাফ যোগ ও এডিট', 'সাইট সেটিংস', 'পূর্ণ নিয়ন্ত্রণ'],
  },
  moderator: {
    name: 'মডারেটর (Moderator)',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200',
    description: 'অর্ডার ম্যানেজমেন্ট, ইনঅ্যাক্টিভ চেকআউট, কাস্টমার ও কুরিয়ার/ডেলিভারি পরিচালনা।',
    features: ['অর্ডার প্রসেসিং', 'ইনঅ্যাক্টিভ চেকআউট', 'কাস্টমার লিস্ট', 'কুরিয়ার বুকিং'],
  },
  editor: {
    name: 'এডিটর (Editor)',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200',
    description: 'প্রোডাক্ট ক্যাটালগ, ক্যাটাগরি, ব্যানার, পেজ ও হোম পেজ কনটেন্ট আপডেট।',
    features: ['প্রোডাক্ট যোগ ও এডিট', 'ক্যাটাগরি নিয়ন্ত্রণ', 'ব্যানার ও পেজ এডিট', 'হোম সেকশন সাজানো'],
  },
  viewer: {
    name: 'ভিউয়ার (Viewer)',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200',
    description: 'শুধুমাত্র রিপোর্ট, ডাটা ও পারফরম্যান্স দেখার অনুমতি। কোনো কিছু পরিবর্তন করা যাবে না।',
    features: ['ড্যাশবোর্ড ভিউ', 'প্রোডাক্ট ও স্টক ভিউ', 'অর্ডার স্ট্যাটাস ভিউ', 'অ্যানালিটিক্স দেখা'],
  },
};

const Staff = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | StaffRole>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffUser | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'moderator' as StaffRole,
    permissions: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomPermissions, setShowCustomPermissions] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useStaffUsers();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const staffUsers = data?.data || [];
  const summary = data?.summary || {
    total_staff: 0,
    admins_count: 0,
    moderators_count: 0,
    editors_count: 0,
    viewers_count: 0,
  };

  // Filtered staff members
  const filteredStaff = useMemo(() => {
    return staffUsers.filter((member) => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.phone && member.phone.includes(searchQuery));
      
      const matchesTab = activeTab === 'all' || member.role === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [staffUsers, searchQuery, activeTab]);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'moderator',
      permissions: [...DEFAULT_ROLE_PERMISSIONS.moderator],
    });
    setShowPassword(false);
    setShowCustomPermissions(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff: StaffUser) => {
    setEditingStaff(staff);
    const existingPermissions = Array.isArray(staff.permissions) && staff.permissions.length > 0
      ? staff.permissions
      : DEFAULT_ROLE_PERMISSIONS[staff.role] || [];

    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || '',
      password: '',
      role: staff.role,
      permissions: [...existingPermissions],
    });
    setShowPassword(false);
    setShowCustomPermissions(false);
    setIsFormOpen(true);
  };

  const handleRoleChange = (newRole: StaffRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: [...(DEFAULT_ROLE_PERMISSIONS[newRole] || [])],
    }));
  };

  const handleTogglePermission = (permissionId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permissionId);
      let updated: string[];
      if (exists) {
        updated = prev.permissions.filter((p) => p !== permissionId && p !== 'all');
      } else {
        updated = [...prev.permissions, permissionId];
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'নাম আবশ্যক', description: 'অনুগ্রহ করে স্টাফ সদস্যের নাম দিন।', variant: 'destructive' });
      return;
    }
    if (!formData.email.trim()) {
      toast({ title: 'ইমেইল আবশ্যক', description: 'অনুগ্রহ করে একটি বৈধ ইমেইল অ্যাড্রেস দিন।', variant: 'destructive' });
      return;
    }
    if (!editingStaff && (!formData.password || formData.password.length < 6)) {
      toast({ title: 'পাসওয়ার্ড আবশ্যক', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', variant: 'destructive' });
      return;
    }

    try {
      if (editingStaff) {
        await updateMutation.mutateAsync({
          id: editingStaff.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password ? formData.password : undefined,
          role: formData.role,
          permissions: formData.permissions,
        });
        toast({ title: 'সফলভাবে আপডেট হয়েছে', description: `${formData.name}-এর তথ্য ও পারমিশন আপডেট সম্পন্ন হয়েছে।` });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          role: formData.role,
          permissions: formData.permissions,
        });
        toast({ title: 'নতুন স্টাফ তৈরি হয়েছে', description: `${formData.name}-কে সফলভাবে যোগ করা হয়েছে।` });
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toast({
        title: 'অপারেশন ব্যর্থ হয়েছে',
        description: err.response?.data?.message || err.message || 'একটি ত্রুটি ঘটেছে।',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;
    try {
      await deleteMutation.mutateAsync(deletingStaff.id);
      toast({
        title: 'স্টাফ মুছে ফেলা হয়েছে',
        description: `${deletingStaff.name} সফলভাবে সিস্টেম থেকে অপসারিত হয়েছে।`,
      });
      setDeletingStaff(null);
    } catch (err: any) {
      toast({
        title: 'মুছতে ব্যর্থ হয়েছে',
        description: err.response?.data?.message || err.message,
        variant: 'destructive',
      });
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
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-primary" />
              স্টাফ ও রোল ম্যানেজমেন্ট
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              অ্যাডমিন, মডারেটর, এডিটর ও ভিউয়ারদের জন্য এক্সেস লেভেল ও কাস্টম পারমিশন পরিচালনা করুন
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
              onClick={handleOpenAdd}
              size="sm"
              className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4" />
              নতুন স্টাফ যোগ করুন
            </Button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">সর্বমোট স্টাফ</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold mt-2 text-foreground">{summary.total_staff}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">অ্যাক্টিভ টিম মেম্বার</p>
          </div>

          <div className="bg-card border rounded-xl p-4 shadow-sm border-purple-200/60 dark:border-purple-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-700 dark:text-purple-400 font-medium">অ্যাডমিন</span>
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold mt-2 text-purple-700 dark:text-purple-300">{summary.admins_count}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">পূর্ণ নিয়ন্ত্রণ ক্ষমতা</p>
          </div>

          <div className="bg-card border rounded-xl p-4 shadow-sm border-blue-200/60 dark:border-blue-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">মডারেটর</span>
              <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-700 dark:text-blue-300">{summary.moderators_count}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">অর্ডার ও কাস্টমার</p>
          </div>

          <div className="bg-card border rounded-xl p-4 shadow-sm border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">এডিটর</span>
              <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold mt-2 text-emerald-700 dark:text-emerald-300">{summary.editors_count}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">প্রোডাক্ট ও কনটেন্ট</p>
          </div>

          <div className="bg-card border rounded-xl p-4 shadow-sm border-amber-200/60 dark:border-amber-900/40 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">ভিউয়ার</span>
              <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold mt-2 text-amber-700 dark:text-amber-300">{summary.viewers_count}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">শুধুমাত্র দেখা (Read-only)</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-5 w-full md:w-auto">
                <TabsTrigger value="all" className="text-xs px-2.5">
                  সকল ({summary.total_staff})
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs px-2.5">
                  অ্যাডমিন ({summary.admins_count})
                </TabsTrigger>
                <TabsTrigger value="moderator" className="text-xs px-2.5">
                  মডারেটর ({summary.moderators_count})
                </TabsTrigger>
                <TabsTrigger value="editor" className="text-xs px-2.5">
                  এডিটর ({summary.editors_count})
                </TabsTrigger>
                <TabsTrigger value="viewer" className="text-xs px-2.5">
                  ভিউয়ার ({summary.viewers_count})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold text-xs py-3">স্টাফ সদস্য</TableHead>
                <TableHead className="font-semibold text-xs py-3">ফোন নম্বর</TableHead>
                <TableHead className="font-semibold text-xs py-3">রোল (Role)</TableHead>
                <TableHead className="font-semibold text-xs py-3">অনুমোদিত সুবিধাসমূহ</TableHead>
                <TableHead className="font-semibold text-xs py-3">যুক্ত হয়েছেন</TableHead>
                <TableHead className="font-semibold text-xs py-3 text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span>স্টাফ তালিকা লোড হচ্ছে...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    কোনো স্টাফ সদস্য পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staff) => {
                  const role = ROLE_DEFINITIONS[staff.role] || ROLE_DEFINITIONS.viewer;
                  const isCurrent = currentUser?.id === staff.id;
                  const isOnlyAdmin = staff.role === 'admin' && summary.admins_count <= 1;

                  return (
                    <TableRow key={staff.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                              {staff.name}
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  আপনি
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 text-sm text-foreground">
                        {staff.phone || <span className="text-muted-foreground">-</span>}
                      </TableCell>

                      <TableCell className="py-3">
                        <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 ${role.badgeClass}`}>
                          {role.name}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 max-w-xs">
                        {staff.role === 'admin' ? (
                          <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            সম্পূর্ণ অ্যাডমিন এক্সেস (সবকিছু)
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {role.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {formatDate(staff.created_at)}
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(staff)}
                            className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                            title="এডিট করুন"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isCurrent || isOnlyAdmin}
                            onClick={() => setDeletingStaff(staff)}
                            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                            title={
                              isCurrent
                                ? 'আপনি নিজের অ্যাকাউন্ট ডিলিট করতে পারবেন না'
                                : isOnlyAdmin
                                ? 'শেষ অ্যাডমিন অ্যাকাউন্ট মোছা যাবে না'
                                : 'মুছে ফেলুন'
                            }
                          >
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

        {/* Add/Edit Staff Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                {editingStaff ? <Edit className="h-5 w-5 text-primary" /> : <UserPlus className="h-5 w-5 text-primary" />}
                {editingStaff ? 'স্টাফ তথ্য ও রোল এডিট করুন' : 'নতুন স্টাফ সদস্য তৈরি করুন'}
              </DialogTitle>
              <DialogDescription>
                স্টাফ সদস্যের নাম, ইমেইল, পাসওয়ার্ড এবং নির্দিষ্ট রোল নির্ধারণ করে প্যানেল এক্সেস দিন।
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="staff-name" className="text-sm font-medium">পূর্ণ নাম *</Label>
                  <Input
                    id="staff-name"
                    required
                    placeholder="উদাঃ মোঃ রফিকুল ইসলাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="staff-email" className="text-sm font-medium">ইমেইল অ্যাড্রেস *</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    required
                    placeholder="staff@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="staff-phone" className="text-sm font-medium">ফোন নম্বর (ঐচ্ছিক)</Label>
                  <Input
                    id="staff-phone"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="staff-password" className="text-sm font-medium">
                      {editingStaff ? 'নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)' : 'লগইন পাসওয়ার্ড *'}
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="staff-password"
                      type={showPassword ? 'text' : 'password'}
                      required={!editingStaff}
                      placeholder={editingStaff ? 'অপরিবর্তিত রাখতে খালি রাখুন' : 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  রোল নির্বাচন করুন (Role Selection) *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['admin', 'moderator', 'editor', 'viewer'] as StaffRole[]).map((roleKey) => {
                    const role = ROLE_DEFINITIONS[roleKey];
                    const isSelected = formData.role === roleKey;

                    return (
                      <div
                        key={roleKey}
                        onClick={() => handleRoleChange(roleKey)}
                        className={`cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                            : 'border-border hover:border-muted-foreground/40 bg-card'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-foreground">{role.name}</span>
                            <Badge variant="outline" className={`text-[10px] px-2 py-0 ${role.badgeClass}`}>
                              {roleKey}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-border/50 flex flex-wrap gap-1">
                          {role.features.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Granular Permissions */}
              {formData.role !== 'admin' && (
                <div className="border rounded-xl p-3.5 bg-muted/20 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomPermissions(!showCustomPermissions)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      নির্দিষ্ট সেকশনের পারমিশন কাস্টমাইজ করুন ({formData.permissions.length} টি অনূমোদিত)
                    </span>
                    {showCustomPermissions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {showCustomPermissions && (
                    <div className="pt-2 border-t space-y-3">
                      <p className="text-xs text-muted-foreground">
                        রোল অনুযায়ী ডিফল্ট পারমিশন সাজানো রয়েছে। প্রয়োজনে যেকোনো সেকশনে টিক দিয়ে অনুমতি দিতে বা প্রত্যাহার করতে পারেন।
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {AVAILABLE_PERMISSIONS.map((perm) => {
                          const isChecked = formData.permissions.includes(perm.id) || formData.permissions.includes('all');
                          return (
                            <label
                              key={perm.id}
                              className="flex items-center gap-2.5 text-xs p-2 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer select-none transition-colors"
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleTogglePermission(perm.id)}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{perm.label}</span>
                                <span className="text-[10px] text-muted-foreground">{perm.group}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.role === 'admin' && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                    অ্যাডমিন রোলে থাকা সদস্যের সমস্ত সাইট সেটিংস, স্টাফ পরিবর্তন এবং ডিলিট করার পূর্ণ এক্সেস থাকবে।
                  </p>
                </div>
              )}

              <DialogFooter className="pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingStaff ? 'আপডেট সম্পন্ন করুন' : 'স্টাফ তৈরি করুন'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={!!deletingStaff} onOpenChange={(open) => !open && setDeletingStaff(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                স্টাফ অ্যাকাউন্ট ডিলিট নিশ্চিত করুন
              </AlertDialogTitle>
              <AlertDialogDescription>
                আপনি কি নিশ্চিত যে আপনি <strong>{deletingStaff?.name}</strong> ({deletingStaff?.email})-এর অ্যাকাউন্টটি সম্পূর্ণ মুছে ফেলতে চান? এই সদস্যের সমস্ত প্যানেল এক্সেস অবিলম্বে বন্ধ হয়ে যাবে।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Staff;
