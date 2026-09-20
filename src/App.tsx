import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ReturnPolicy from "./pages/ReturnPolicy";
import FAQ from "./pages/FAQ";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import AbandonedCheckouts from "./pages/admin/AbandonedCheckouts";
import Delivery from "./pages/admin/Delivery";
import Categories from "./pages/admin/Categories";
import Analytics from "./pages/admin/Analytics";
import SiteSettings from "./pages/admin/SiteSettings";
import HomeSections from "./pages/admin/HomeSections";
import Banners from "./pages/admin/Banners";
import Pages from "./pages/admin/Pages";
import CustomPage from "./pages/CustomPage";
import CourierSettings from "./pages/admin/CourierSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import GoogleSheetsSync from "./pages/admin/GoogleSheetsSync";
import Customers from "./pages/admin/Customers";
import Staff from "./pages/admin/Staff";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import ScrollToTop from "./components/ScrollToTop";
const queryClient = new QueryClient();

// Component to apply dynamic favicon
const DynamicFaviconHandler = () => {
  useDynamicFavicon();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <TooltipProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <LanguageProvider>
              <DynamicFaviconHandler />
              <CartProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/track-order" element={<OrderTracking />} />
                  
                  {/* Static Pages & Aliases */}
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/returns" element={<ReturnPolicy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/orders" element={<Profile />} />
                  <Route path="/page/:slug" element={<CustomPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/products/new" element={<ProductForm />} />
                  <Route path="/admin/products/:id" element={<ProductForm />} />
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/admin/abandoned-checkouts" element={<AbandonedCheckouts />} />
                  <Route path="/admin/customers" element={<Customers />} />
                  <Route path="/admin/staff" element={<Staff />} />
                  <Route path="/admin/delivery" element={<Delivery />} />
                  <Route path="/admin/categories" element={<Categories />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/settings" element={<SiteSettings />} />
                  <Route path="/admin/home-sections" element={<HomeSections />} />
                  <Route path="/admin/banners" element={<Banners />} />
                  <Route path="/admin/pages" element={<Pages />} />
                  <Route path="/admin/courier-settings" element={<CourierSettings />} />
                  <Route path="/admin/google-sheets-sync" element={<GoogleSheetsSync />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <MobileBottomNav />
                <div className="pb-14 lg:pb-0" />
              </CartProvider>
            </LanguageProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
