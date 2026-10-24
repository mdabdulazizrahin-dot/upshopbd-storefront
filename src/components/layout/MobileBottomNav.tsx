import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, ShoppingBag, User, Truck } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card border-t border-gray-200/90 dark:border-border lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex items-center justify-between h-16 px-2 max-w-md mx-auto">
        {/* 1. Shop (শপ) */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] transition-colors ${
            isActive('/shop') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 stroke-[2]" />
          </div>
          <span className="mt-1 leading-none tracking-tight">শপ</span>
        </Link>

        {/* 2. Wishlist (উইশলিস্ট) */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] transition-colors ${
            isActive('/wishlist') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="relative">
            <Heart className="h-5 w-5 stroke-[2]" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold shadow-xs">
                {wishlistItems.length}
              </span>
            )}
          </div>
          <span className="mt-1 leading-none tracking-tight">উইশলিস্ট</span>
        </Link>

        {/* 3. Center Elevated HOME Button (বড় ও উপরে ভাসমান সেন্টার বাটন) */}
        <div className="relative flex-1 flex flex-col items-center justify-center h-full">
          <Link
            to="/"
            className="group flex flex-col items-center focus:outline-none"
            aria-label="Home"
          >
            {/* Elevated circular button floating above the navbar */}
            <div
              className={`absolute -top-7 w-16 h-16 rounded-full flex items-center justify-center border-[4.5px] border-white dark:border-card bg-primary text-primary-foreground transition-all duration-300 shadow-[0_8px_24px_-4px_rgba(var(--primary),0.55)] group-hover:scale-105 group-active:scale-95 ${
                isActive('/') ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-white dark:ring-offset-card' : ''
              }`}
            >
              <Home className="h-8 w-8 text-white stroke-[2.3] drop-shadow-xs" />
            </div>
            <span
              className={`text-[11px] mt-7.5 tracking-tight transition-colors ${
                isActive('/') ? 'text-primary font-bold' : 'text-muted-foreground font-medium'
              }`}
            >
              হোম
            </span>
          </Link>
        </div>

        {/* 4. Track Order (অর্ডার ট্র্যাক) */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] transition-colors ${
            isActive('/track-order') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="relative">
            <Truck className="h-5 w-5 stroke-[2]" />
          </div>
          <span className="mt-1 leading-none tracking-tight">অর্ডার ট্র্যাক</span>
        </Link>

        {/* 5. Account (প্রোফাইল / অ্যাকাউন্ট) */}
        <Link
          to={user ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] transition-colors ${
            isActive('/profile') || isActive('/login') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="relative">
            <User className="h-5 w-5 stroke-[2]" />
          </div>
          <span className="mt-1 leading-none tracking-tight">অ্যাকাউন্ট</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
