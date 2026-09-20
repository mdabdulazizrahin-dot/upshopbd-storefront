import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, ShoppingBag, ShoppingBasket, Briefcase, Package,
  User, UserCircle, UserRound, CircleUser, Contact, LogIn, LogOut,
  Menu, AlignJustify, LayoutGrid, MoreHorizontal, MoreVertical,
  Search, SearchCode, ScanSearch, SearchCheck,
  ChevronRight, Heart, Camera,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import VisualSearchModal from '@/components/search/VisualSearchModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import HeaderCategoryDropdown from './HeaderCategoryDropdown';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  // User icons
  User,
  UserCircle,
  UserRound,
  CircleUser,
  Contact,
  LogIn,
  // Cart icons
  ShoppingCart,
  ShoppingBag,
  ShoppingBasket,
  Briefcase,
  Package,
  // Menu icons
  Menu,
  AlignJustify,
  LayoutGrid,
  MoreHorizontal,
  MoreVertical,
  // Search icons
  Search,
  SearchCode,
  ScanSearch,
  SearchCheck,
};

const Header = () => {
  const { totalItems, subtotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'menu' | 'categories'>('menu');
  const { settings } = useSiteSettingsContext();
  const { t } = useLanguage();
  
  const { data: categories } = useCategories({ status: 'active' });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/shop', label: t.allProducts },
    { href: '/track-order', label: 'অর্ডার ট্র্যাক করুন' },
    { href: '/about', label: t.about },
    { href: '/contact', label: t.contact },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
    }
  };

  const isCheckoutPage = location.pathname === '/checkout';
  const siteName = settings.general?.siteName || 'ShopBD';
  const logoUrl = settings.header?.logoUrl;
  const isSticky = settings.header?.isSticky !== false;
  const navBgColor = settings.header?.navBackgroundColor || '142 76% 36%';

  // Get dynamic icons from settings
  const UserIcon = iconMap[settings.header?.userIcon || 'User'] || User;
  const CartIcon = iconMap[settings.header?.cartIcon || 'ShoppingCart'] || ShoppingCart;
  const SearchIcon = iconMap[settings.header?.searchIcon || 'Search'] || Search;
  const MenuIcon = iconMap[settings.header?.menuIcon || 'Menu'] || Menu;

  // Get parent categories
  const parentCategories = categories?.filter(c => !c.parent_id) || [];

  return (
    <header className={`${isSticky ? 'sticky top-0' : ''} z-50 w-full bg-background border-b`}>
      {/* Top Header */}
      <div className="border-b bg-background">
        <div className="container-custom">
          <div className="flex lg:h-20 items-center">
            {/* Desktop: Logo with fixed width + Search aligned with banner */}
            <div className="hidden lg:flex items-center w-full">
              {/* Logo - Fixed width to match category menu */}
              <Link to="/" className="w-[304px] flex-shrink-0">
                {logoUrl ? (
                   <img src={logoUrl} alt={siteName} className="w-auto object-contain" style={{ maxHeight: '270px', minHeight: '3.5rem' }} />
                ) : (
                   <span className="text-2xl lg:text-3xl font-display font-bold text-primary">{siteName}</span>
                )}
              </Link>

              {/* Search Bar - Starts where banner starts (after category menu) */}
              <form onSubmit={handleSearch} className="flex flex-1">
                <div className="flex w-full max-w-2xl border rounded-md overflow-hidden bg-background items-center">
                  {/* Visual Search Camera Option on Left with stylish shape */}
                  <div className="pl-2 pr-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => setIsVisualSearchOpen(true)}
                      title="ছবি দিয়ে সার্চ করুন (Visual Search)"
                      className="p-1.5 rounded-lg bg-muted/80 hover:bg-primary/15 text-muted-foreground hover:text-primary transition-all border border-border/60 shadow-xs flex items-center justify-center gap-1 group"
                    >
                      <Camera className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="সার্চ করুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-1.5"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[140px] border-0 border-l rounded-none bg-muted/30">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">সকল ক্যাটাগরি</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name_bn || cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="rounded-none px-4">
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* Right Actions - Desktop */}
              <div className="flex items-center gap-4 ml-auto">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                        <UserIcon className="h-5 w-5" />
                        <span>{profile?.name || user.email?.split('@')[0]}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserIcon className="h-4 w-4 mr-2" />
                        {t.myProfile || 'My Profile'}
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        {t.logout}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                    <UserIcon className="h-5 w-5" />
                    <span>{t.loginRegister}</span>
                  </Link>
                )}
                <Link to="/wishlist" className="relative hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="flex items-center gap-2">
                  <div className="relative">
                    <CartIcon className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    {subtotal.toLocaleString()}৳
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden flex-col w-full gap-1.5 py-2">
              {/* Top row: Hamburger | Logo (center) | Cart */}
              <div className="flex items-center justify-between w-full relative">
                {/* Hamburger Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 overflow-y-auto p-0">
                    {/* Search bar at top of drawer */}
                    <div className="p-4 pb-2">
                      <form onSubmit={handleSearch} className="flex border rounded-md overflow-hidden">
                        <Input
                          type="text"
                          placeholder="Search for products"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                        <Button type="submit" size="icon" variant="ghost" className="rounded-none">
                          <SearchIcon className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>

                    {/* Tabs: MENU | CATEGORIES */}
                    <div className="flex border-b">
                      <button
                        onClick={() => setMobileTab('menu')}
                        className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                          mobileTab === 'menu'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        MENU
                      </button>
                      <button
                        onClick={() => setMobileTab('categories')}
                        className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                          mobileTab === 'categories'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        CATEGORIES
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                      {mobileTab === 'menu' ? (
                        <nav className="flex flex-col">
                          {navLinks.map((link) => (
                            <Link
                              key={link.href}
                              to={link.href}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted last:border-b-0"
                            >
                              {link.label}
                            </Link>
                          ))}
                          <Link to="/return-policy" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted">
                            Return And Refund Policy
                          </Link>
                          <Link to="/terms" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted">
                            Terms Of Use
                          </Link>
                          <Link to="/privacy" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted">
                            Privacy Policy
                          </Link>
                          <Link to="/track-order" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted">
                            <Package className="h-4 w-4" /> অর্ডার ট্র্যাক করুন
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted">
                            <Heart className="h-4 w-4" /> Wishlist
                          </Link>
                          <Link to={user ? '/profile' : '/login'} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-3">
                            <UserIcon className="h-4 w-4" /> My Account
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </Link>
                        </nav>
                      ) : (
                        <div className="flex flex-col">
                          {parentCategories.map((category) => {
                            const subCategories = categories?.filter(c => c.parent_id === category.id) || [];
                            return (
                              <div key={category.id}>
                                <Link
                                  to={`/shop?category=${category.slug}`}
                                  className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-muted"
                                >
                                  {category.name_bn || category.name}
                                  {subCategories.length > 0 && <ChevronRight className="h-4 w-4" />}
                                </Link>
                                {subCategories.length > 0 && (
                                  <div className="pl-4 flex flex-col border-l-2 border-muted ml-2">
                                    {subCategories.map((subCat) => (
                                      <Link
                                        key={subCat.id}
                                        to={`/shop?category=${subCat.slug}`}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 border-b border-muted last:border-b-0"
                                      >
                                        {subCat.name_bn || subCat.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Center Logo */}
                <Link to="/" className="absolute left-1/2 -translate-x-1/2">
                   {logoUrl ? (
                     <img src={logoUrl} alt={siteName} className="w-auto object-contain" style={{ maxHeight: '40px', minHeight: '40px' }} />
                   ) : (
                     <span className="text-xl font-display font-bold text-primary">{siteName}</span>
                   )}
                </Link>

                {/* Right Cart Icon */}
                <Link to="/cart" className="relative p-2 ml-auto">
                  <CartIcon className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* Search bar row */}
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="flex w-full border rounded-md overflow-hidden bg-background items-center">
                  <div className="pl-1.5 pr-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => setIsVisualSearchOpen(true)}
                      title="ছবি দিয়ে সার্চ করুন"
                      className="p-1 rounded-md bg-muted/80 hover:bg-primary/15 text-muted-foreground hover:text-primary transition-all border border-border/60 flex items-center justify-center"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9 pl-1"
                  />
                  <Button type="submit" size="icon" className="rounded-none h-9 w-10">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Desktop */}
      <nav 
        className="hidden lg:block"
        style={{ backgroundColor: navBgColor.startsWith('#') ? navBgColor : `hsl(${navBgColor})` }}
      >
        <div className="container-custom">
          <div className="flex items-center h-12">
            {/* Empty spacer - same width as logo area (272px + 32px gap) to align nav links with banner */}
            <div className="w-[304px] flex-shrink-0"></div>

            {/* Navigation Links - Aligned with banner */}
            <div className="flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative group py-3 text-sm font-semibold text-white/95 hover:text-white transition-colors flex items-center"
                >
                  <span>{link.label}</span>
                  {/* Expanding brand accent line on hover */}
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-white rounded-full group-hover:w-full transition-all duration-300 pointer-events-none shadow-sm" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle accent border line at bottom of navigation */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
      </nav>

      {/* Visual Search Modal */}
      <VisualSearchModal open={isVisualSearchOpen} onOpenChange={setIsVisualSearchOpen} />
    </header>
  );
};

export default Header;
