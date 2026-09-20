# ShopBD - Complete Project Structure

## 📁 Full Directory Structure

```
shopbd/
├── 📁 docs/                          # Documentation files
│   ├── DATABASE_SCHEMA.sql           # PostgreSQL schema
│   ├── MYSQL_SCHEMA.sql              # MySQL schema (for shared hosting)
│   ├── SEED_DATA.sql                 # PostgreSQL seed data
│   ├── MYSQL_SEED_DATA.sql           # MySQL seed data
│   ├── DEPLOYMENT_GUIDE.md           # Full deployment instructions
│   ├── QUICK_REFERENCE.md            # Quick start guide
│   └── PROJECT_STRUCTURE.md          # This file
│
├── 📁 public/                        # Static assets
│   ├── favicon.ico                   # Site favicon
│   ├── placeholder.svg               # Placeholder image
│   └── robots.txt                    # SEO robots file
│
├── 📁 src/                           # Source code
│   ├── 📁 assets/                    # Static assets (images, fonts)
│   │
│   ├── 📁 components/                # React components
│   │   ├── 📁 admin/                 # Admin panel components
│   │   │   ├── AdminLayout.tsx       # Admin layout wrapper with auth
│   │   │   └── OrderDetailsModal.tsx # Order details popup
│   │   │
│   │   ├── 📁 cart/                  # Cart components
│   │   │   └── SideCart.tsx          # Side sliding cart
│   │   │
│   │   ├── 📁 home/                  # Homepage components
│   │   │   ├── CategorySection.tsx   # Category grid display
│   │   │   ├── FeaturesSection.tsx   # Features/USP section
│   │   │   └── HeroBanner.tsx        # Hero carousel banner
│   │   │
│   │   ├── 📁 layout/                # Layout components
│   │   │   ├── Header.tsx            # Site header with nav
│   │   │   └── Footer.tsx            # Site footer
│   │   │
│   │   ├── 📁 product/               # Product components
│   │   │   ├── ProductCard.tsx       # Single product card
│   │   │   └── ProductGrid.tsx       # Products grid layout
│   │   │
│   │   ├── 📁 ui/                    # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── ... (more UI components)
│   │   │
│   │   └── NavLink.tsx               # Navigation link component
│   │
│   ├── 📁 contexts/                  # React contexts
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── CartContext.tsx           # Shopping cart state
│   │   └── SiteSettingsContext.tsx   # Site settings state
│   │
│   ├── 📁 data/                      # Mock/static data
│   │   └── mockData.ts               # Mock data for development
│   │
│   ├── 📁 hooks/                     # Custom React hooks
│   │   ├── useProducts.ts            # Product CRUD operations
│   │   ├── useOrders.ts              # Order management
│   │   ├── useSiteSettings.ts        # Site settings hooks
│   │   ├── useLocation.ts            # District/Upazila hooks
│   │   ├── useVisitorTracking.ts     # Analytics tracking
│   │   ├── use-mobile.tsx            # Mobile detection
│   │   └── use-toast.ts              # Toast notifications
│   │
│   ├── 📁 integrations/              # External integrations
│   │   └── 📁 supabase/
│   │       ├── client.ts             # Supabase client (auto-generated)
│   │       └── types.ts              # Database types (auto-generated)
│   │
│   ├── 📁 lib/                       # Utility libraries
│   │   ├── utils.ts                  # General utilities (cn, etc.)
│   │   └── productUtils.ts           # Product data transformers
│   │
│   ├── 📁 pages/                     # Page components
│   │   ├── 📁 admin/                 # Admin pages
│   │   │   ├── Dashboard.tsx         # Admin dashboard
│   │   │   ├── Products.tsx          # Product list
│   │   │   ├── ProductForm.tsx       # Add/Edit product
│   │   │   ├── Categories.tsx        # Category management
│   │   │   ├── Orders.tsx            # Order management
│   │   │   ├── Banners.tsx           # Banner management
│   │   │   ├── HomeSections.tsx      # Homepage sections
│   │   │   ├── Pages.tsx             # CMS pages
│   │   │   ├── Delivery.tsx          # Delivery settings
│   │   │   ├── SiteSettings.tsx      # Site configuration
│   │   │   └── Analytics.tsx         # Visitor analytics
│   │   │
│   │   ├── Index.tsx                 # Homepage
│   │   ├── Shop.tsx                  # Shop/Products page
│   │   ├── ProductDetails.tsx        # Single product page
│   │   ├── Cart.tsx                  # Cart page
│   │   ├── Checkout.tsx              # Checkout page
│   │   ├── OrderSuccess.tsx          # Order confirmation
│   │   ├── Login.tsx                 # Login/Register page
│   │   ├── AboutUs.tsx               # About page
│   │   ├── ContactUs.tsx             # Contact page
│   │   ├── FAQ.tsx                   # FAQ page
│   │   ├── PrivacyPolicy.tsx         # Privacy policy
│   │   ├── TermsConditions.tsx       # Terms & conditions
│   │   ├── ReturnPolicy.tsx          # Return policy
│   │   └── NotFound.tsx              # 404 page
│   │
│   ├── 📁 test/                      # Test files
│   │   ├── setup.ts                  # Test configuration
│   │   └── example.test.ts           # Example test
│   │
│   ├── 📁 types/                     # TypeScript types
│   │   └── index.ts                  # Shared type definitions
│   │
│   ├── App.tsx                       # Main app component
│   ├── App.css                       # Global styles
│   ├── index.css                     # Tailwind & CSS variables
│   ├── main.tsx                      # App entry point
│   └── vite-env.d.ts                 # Vite type definitions
│
├── 📁 supabase/                      # Supabase configuration
│   ├── config.toml                   # Supabase config (auto-generated)
│   └── 📁 migrations/                # Database migrations
│
├── .env                              # Environment variables (auto-generated)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── components.json                   # shadcn/ui config
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML entry point
├── package.json                      # Dependencies & scripts
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # Project readme
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
└── vitest.config.ts                  # Vitest configuration
```

---

## 🗄️ Database Schema Overview

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `user_roles` | User role assignments (admin/customer) |
| `categories` | Product categories |
| `products` | Product listings |
| `product_images` | Multiple images per product |
| `product_variations` | Size/Color variations |
| `orders` | Customer orders |
| `order_items` | Items in each order |
| `districts` | Bangladesh districts |
| `upazilas` | Sub-districts |
| `delivery_settings` | Delivery charges |
| `banners` | Homepage banners |
| `home_sections` | Homepage section config |
| `pages` | CMS pages |
| `site_settings` | Site configuration |
| `menu_items` | Navigation menus |
| `visitors` | Visitor analytics |
| `daily_analytics` | Aggregated stats |

### Enums

```sql
-- User roles
CREATE TYPE app_role AS ENUM ('admin', 'customer');

-- Product types
CREATE TYPE product_type AS ENUM ('simple', 'variable');

-- Product status
CREATE TYPE product_status AS ENUM ('active', 'inactive');

-- Category status
CREATE TYPE category_status AS ENUM ('active', 'inactive');

-- Delivery types
CREATE TYPE delivery_type AS ENUM ('inside_dhaka', 'outside_dhaka');

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid');

-- Payment methods
CREATE TYPE payment_method AS ENUM ('cod');
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │  Login   │───▶│ Supabase Auth│───▶│  Check Role     │    │
│  │  Page    │    │              │    │  (user_roles)   │    │
│  └──────────┘    └──────────────┘    └────────┬────────┘    │
│                                               │              │
│                        ┌──────────────────────┼──────────┐  │
│                        ▼                      ▼          │  │
│               ┌──────────────┐       ┌──────────────┐    │  │
│               │   Customer   │       │    Admin     │    │  │
│               │   Dashboard  │       │   Dashboard  │    │  │
│               └──────────────┘       └──────────────┘    │  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Auth Context (src/contexts/AuthContext.tsx)

```typescript
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email, password) => Promise<{ error }>;
  signUp: (email, password, name, phone?) => Promise<{ error }>;
  signInWithGoogle: () => Promise<{ error }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<boolean>;
}
```

---

## 🛒 Cart Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       Cart Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐ │
│  │  Product │───▶│ Add to   │───▶│ Checkout │───▶│ Order │ │
│  │  Page    │    │ Cart     │    │ Page     │    │Success│ │
│  └──────────┘    └──────────┘    └──────────┘    └───────┘ │
│       │               │               │              │      │
│       ▼               ▼               ▼              ▼      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐ │
│  │ Product  │    │  Cart    │    │ Order    │    │ Order │ │
│  │ Details  │    │ Context  │    │ Creation │    │ Saved │ │
│  │          │    │(Storage) │    │(Database)│    │       │ │
│  └──────────┘    └──────────┘    └──────────┘    └───────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cart Context (src/contexts/CartContext.tsx)

```typescript
interface CartContextType {
  items: CartItem[];
  addToCart: (product, variation?, quantity?) => void;
  removeFromCart: (productId, variationId?) => void;
  updateQuantity: (productId, quantity, variationId?) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isSideCartOpen: boolean;
  openSideCart: () => void;
  closeSideCart: () => void;
}
```

---

## 📊 Data Hooks

### useProducts.ts
```typescript
// Fetch products
useProducts({ categorySlug?, status?, limit? })
useProduct(slug: string)

// Mutations
useCreateProduct()
useUpdateProduct()
useDeleteProduct()

// Categories
useCategories({ status? })
```

### useOrders.ts
```typescript
// Fetch orders
useOrders()
useOrder(id: string)

// Mutations
useCreateOrder()
useUpdateOrderStatus()
useUpdateOrder()
useDeleteOrder()

// Location data
useDistricts()
useUpazilas(districtId?)

// Delivery
useDeliverySettings()
useUpdateDeliverySetting()
```

### useSiteSettings.ts
```typescript
// Site settings
useSiteSettings()
useUpdateSiteSettings()

// Home sections
useHomeSections()
useUpdateHomeSection()

// Banners
useBanners()
useCreateBanner()
useUpdateBanner()
useDeleteBanner()

// Menu
useMenuItems()
```

---

## 🎨 Design System

### CSS Variables (src/index.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

---

## 🛠️ Admin Panel Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | Dashboard | Overview & stats |
| `/admin/products` | Products | Product list |
| `/admin/products/new` | ProductForm | Add product |
| `/admin/products/edit/:id` | ProductForm | Edit product |
| `/admin/categories` | Categories | Category management |
| `/admin/orders` | Orders | Order management |
| `/admin/banners` | Banners | Banner management |
| `/admin/home-sections` | HomeSections | Homepage config |
| `/admin/pages` | Pages | CMS pages |
| `/admin/delivery` | Delivery | Delivery charges |
| `/admin/settings` | SiteSettings | Site configuration |
| `/admin/analytics` | Analytics | Visitor stats |

---

## 🌐 Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Homepage |
| `/shop` | Shop | All products |
| `/product/:slug` | ProductDetails | Product page |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Checkout process |
| `/order-success` | OrderSuccess | Confirmation |
| `/login` | Login | Auth page |
| `/about` | AboutUs | About page |
| `/contact` | ContactUs | Contact page |
| `/faq` | FAQ | FAQ page |
| `/privacy` | PrivacyPolicy | Privacy policy |
| `/terms` | TermsConditions | Terms page |
| `/return-policy` | ReturnPolicy | Return policy |

---

## 🔧 Configuration Files

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### tailwind.config.ts
```typescript
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { ... },
        secondary: { ... },
        // ...more colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-router-dom` | Routing |
| `@tanstack/react-query` | Data fetching |
| `@supabase/supabase-js` | Backend client |
| `tailwindcss` | Styling |
| `shadcn/ui` | UI components |
| `lucide-react` | Icons |
| `react-hook-form` | Form handling |
| `zod` | Validation |
| `recharts` | Charts |
| `embla-carousel-react` | Carousel |
| `sonner` | Toast notifications |

---

## 🚀 Quick Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests

# Linting
npm run lint         # Lint code
```

---

## 📋 Environment Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Site Config (Optional)
VITE_SITE_NAME=ShopBD
VITE_SITE_URL=https://yourdomain.com

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-client-id
```

---

## 🔒 Security Features

1. **Row Level Security (RLS)** - All tables have RLS policies
2. **Role-based Access** - Admin/Customer roles
3. **Secure Authentication** - Supabase Auth with JWT
4. **Input Validation** - Zod schemas
5. **XSS Protection** - React's built-in escaping

---

## 📱 Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
2xl: 1536px /* 2X large */
```

---

## 🎯 Feature Summary

### Customer Features
- ✅ Product browsing with filters
- ✅ Product search
- ✅ Shopping cart (localStorage)
- ✅ Guest checkout
- ✅ User registration/login
- ✅ Order tracking
- ✅ Responsive design

### Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Variable products (size/color)
- ✅ Multiple product images
- ✅ Category management
- ✅ Order management
- ✅ Banner management
- ✅ Homepage customization
- ✅ CMS pages
- ✅ Delivery settings
- ✅ Site settings

### Technical Features
- ✅ TypeScript
- ✅ React Query caching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Form validation
- ✅ SEO ready
