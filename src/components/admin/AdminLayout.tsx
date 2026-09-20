import { ReactNode, useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  Settings, 
  Image, 
  FileText, 
  ShoppingBag, 
  FileSpreadsheet, 
  Users, 
  ShieldCheck,
  AlertTriangle 
} from 'lucide-react';

const roleMeta: Record<string, { label: string; badgeClass: string }> = {
  admin: { label: 'অ্যাডমিন', badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200' },
  moderator: { label: 'মডারেটর', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200' },
  editor: { label: 'এডিটর', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200' },
  viewer: { label: 'ভিউয়ার', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200' },
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, hasPermission, signOut, loading } = useAuth();
  const { settings } = useSiteSettingsContext();
  const { tAdmin } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const siteName = settings?.general?.siteName || 'MyHaat BD';

  const allNavItems = useMemo(() => [
    { icon: LayoutDashboard, label: tAdmin.dashboard, path: '/admin', permission: 'dashboard' },
    { icon: Package, label: tAdmin.products, path: '/admin/products', permission: 'products' },
    { icon: Tags, label: tAdmin.categories, path: '/admin/categories', permission: 'categories' },
    { icon: ShoppingCart, label: tAdmin.orders, path: '/admin/orders', permission: 'orders' },
    { icon: ShoppingBag, label: tAdmin.inactiveOrders, path: '/admin/abandoned-checkouts', permission: 'abandoned_checkouts' },
    { icon: Users, label: 'কাস্টমার ও ইউজার', path: '/admin/customers', permission: 'customers' },
    { icon: Truck, label: tAdmin.courierSettings, path: '/admin/courier-settings', permission: 'courier' },
    { icon: Truck, label: tAdmin.delivery, path: '/admin/delivery', permission: 'delivery' },
    { icon: BarChart3, label: tAdmin.analytics, path: '/admin/analytics', permission: 'analytics' },
    { icon: Image, label: tAdmin.banners, path: '/admin/banners', permission: 'banners' },
    { icon: LayoutDashboard, label: tAdmin.homeSections, path: '/admin/home-sections', permission: 'home_sections' },
    { icon: FileText, label: tAdmin.pages, path: '/admin/pages', permission: 'pages' },
    { icon: FileSpreadsheet, label: 'Google Sheets Sync', path: '/admin/google-sheets-sync', permission: 'google_sheets' },
    { icon: ShieldCheck, label: 'স্টাফ ও পারমিশন', path: '/admin/staff', permission: 'staff' },
    { icon: Settings, label: tAdmin.settings, path: '/admin/settings', permission: 'settings' },
  ], [tAdmin]);

  const navItems = useMemo(() => {
    return allNavItems.filter((item) => hasPermission(item.permission));
  }, [allNavItems, hasPermission]);

  // Check route-level authorization
  const currentNavItem = allNavItems.find(
    (item) => item.path === location.pathname || (item.path !== '/admin' && location.pathname.startsWith(item.path))
  );
  const isRouteAuthorized = !currentNavItem || hasPermission(currentNavItem.permission);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login', { replace: true });
      } else if (!isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const currentRole = user.role || 'viewer';
  const roleBadge = roleMeta[currentRole] || { label: currentRole, badgeClass: 'bg-muted text-muted-foreground' };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 flex items-center px-4 justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="ml-3 font-display font-bold text-lg">{siteName} Admin</span>
        </div>
        <Badge variant="outline" className={`text-[11px] px-2 py-0.5 font-medium ${roleBadge.badgeClass}`}>
          {roleBadge.label}
        </Badge>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transform transition-transform duration-200 flex flex-col lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg truncate">{siteName}</span>
          </Link>
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">{tAdmin.adminPanel}</p>
            <Badge variant="outline" className={`text-[11px] px-2 py-0.5 font-medium ${roleBadge.badgeClass}`}>
              {roleBadge.label}
            </Badge>
          </div>
          <div className="mt-2 pt-2 border-t border-border/60">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-4 border-t bg-card space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 rounded-md">
              <span className="text-xs text-muted-foreground">Admin</span>
              <LanguageSwitcher type="admin" variant="compact" />
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 rounded-md">
              <span className="text-xs text-muted-foreground">Frontend</span>
              <LanguageSwitcher type="frontend" variant="compact" />
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 mr-3" />
            {tAdmin.signOut}
          </Button>
        </div>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {isRouteAuthorized ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-card border rounded-2xl shadow-sm max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">অননুমোদিত প্রবেশাধিকার</h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                আপনার বর্তমান রোল (<strong>{roleBadge.label}</strong>) এই সেকশনটিতে প্রবেশ করার অনুমতি রাখে না। কোনো পরিবর্তনের প্রয়োজন হলে অ্যাডমিনের সাথে যোগাযোগ করুন।
              </p>
              <Button className="mt-6" onClick={() => navigate('/admin')}>
                ড্যাশবোর্ডে ফিরে যান
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;