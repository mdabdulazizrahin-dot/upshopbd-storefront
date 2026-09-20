import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Home, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlistItems.length },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { href: '/', label: 'Home', icon: Home, badge: 0 },
    { href: '/shop', label: 'Shop', icon: ShoppingBag, badge: 0 },
    { href: user ? '/profile' : '/login', label: 'My acc..', icon: User, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-xs transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
