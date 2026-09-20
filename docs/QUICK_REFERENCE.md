# ShopBD Quick Deployment Reference

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Database Setup (PostgreSQL)

```bash
# Create database and run schema
psql -U postgres -c "CREATE DATABASE shopbd;"
psql -U postgres -d shopbd -f docs/DATABASE_SCHEMA.sql
psql -U postgres -d shopbd -f docs/SEED_DATA.sql
```

## Create Admin User

```sql
-- After user registers, run this to make them admin:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM public.users WHERE email = 'admin@yourdomain.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## Admin Panel Access

- URL: `https://yourdomain.com/admin`
- Features: Dashboard, Products, Categories, Orders, Banners, Pages, Settings

## Key Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

## Deployment Checklist

- [ ] Configure `.env` with production values
- [ ] Run `npm run build`
- [ ] Upload `dist/` folder to server
- [ ] Set up PostgreSQL database
- [ ] Run database migrations
- [ ] Configure SSL certificate
- [ ] Create admin user
- [ ] Test all functionality

## Full Documentation

See `docs/DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.
