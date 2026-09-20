# ShopBD - Self-Hosting Deployment Guide

A complete guide to deploy ShopBD e-commerce system on your own hosting (cPanel, Shared Hosting, or VPS).

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Project Structure](#project-structure)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Backend Setup (Supabase Self-Hosted)](#backend-setup-supabase-self-hosted)
7. [Alternative: Custom Node.js Backend](#alternative-custom-nodejs-backend)
8. [Frontend Build & Deployment](#frontend-build--deployment)
9. [File Storage Configuration](#file-storage-configuration)
10. [Authentication Setup](#authentication-setup)
11. [Admin Panel Access](#admin-panel-access)
12. [cPanel Deployment](#cpanel-deployment)
13. [VPS Deployment](#vps-deployment)
14. [Domain Configuration](#domain-configuration)
15. [Security Best Practices](#security-best-practices)
16. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | v18.0.0 or higher |
| npm/yarn/bun | Latest stable version |
| PostgreSQL | v14.0 or higher |
| RAM | 1GB minimum (2GB recommended) |
| Storage | 10GB minimum |

### For VPS Deployment

| Component | Requirement |
|-----------|-------------|
| OS | Ubuntu 20.04+ / Debian 11+ |
| Nginx | v1.18+ |
| SSL | Certbot (Let's Encrypt) |

### For cPanel/Shared Hosting

| Component | Requirement |
|-----------|-------------|
| PHP | 7.4+ (for some features) |
| Node.js | Selector or custom binary |
| PostgreSQL/MySQL | Available via hosting panel |

---

## Project Structure

```
shopbd/
├── dist/                     # Production build (generated)
├── docs/                     # Documentation
│   ├── DEPLOYMENT_GUIDE.md   # This file
│   ├── DATABASE_SCHEMA.sql   # Complete database schema
│   └── SEED_DATA.sql         # Initial seed data
├── public/                   # Static assets
├── src/                      # Source code
│   ├── components/           # React components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── integrations/         # Backend integrations
│   ├── lib/                  # Utility functions
│   └── pages/                # Page components
├── supabase/                 # Supabase configuration
│   ├── config.toml           # Supabase config
│   └── migrations/           # Database migrations
├── .env.example              # Environment template
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind CSS config
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript config
```

---

## Pre-Deployment Checklist

- [ ] Download/clone the complete source code
- [ ] Have PostgreSQL database credentials ready
- [ ] Have domain name configured (optional)
- [ ] Have SSL certificate (for production)
- [ ] Review and modify `.env` file
- [ ] Test build locally before deploying

---

## Database Setup

### Option 1: Supabase Cloud (Recommended for Beginners)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the schema from `docs/DATABASE_SCHEMA.sql`
4. Run seed data from `docs/SEED_DATA.sql`
5. Copy project URL and anon key to `.env`

### Option 2: Self-Hosted Supabase

```bash
# Clone Supabase Docker
git clone https://github.com/supabase/supabase
cd supabase/docker

# Copy environment file
cp .env.example .env

# Start Supabase services
docker-compose up -d
```

### Option 3: Direct PostgreSQL

1. Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. Create database and user:
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE shopbd;

-- Create user
CREATE USER shopbd_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shopbd TO shopbd_user;

-- Connect to database
\c shopbd

-- Run the schema
\i /path/to/docs/DATABASE_SCHEMA.sql

-- Run seed data
\i /path/to/docs/SEED_DATA.sql
```

### Option 4: MySQL (With Schema Conversion)

If you prefer MySQL, you'll need to convert the PostgreSQL schema:

```bash
# Install pgloader for conversion
sudo apt install pgloader

# Or manually convert types:
# - UUID → CHAR(36) with UUID() function
# - TIMESTAMP WITH TIME ZONE → DATETIME
# - JSONB → JSON
# - ENUM types → ENUM or separate lookup tables
```

See `docs/MYSQL_SCHEMA.sql` for MySQL-compatible schema.

---

## Environment Configuration

### Create `.env` File

Copy `.env.example` to `.env` and configure:

```env
# ===========================================
# ShopBD Environment Configuration
# ===========================================

# Backend Type: 'supabase' or 'custom'
VITE_BACKEND_TYPE=supabase

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Custom Backend Configuration (if not using Supabase)
VITE_API_BASE_URL=https://api.yourdomain.com

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Site Configuration
VITE_SITE_NAME=ShopBD
VITE_SITE_URL=https://yourdomain.com

# Storage Configuration
VITE_STORAGE_TYPE=local
VITE_STORAGE_URL=/uploads
VITE_STORAGE_MAX_SIZE=52428800

# Production Mode
NODE_ENV=production
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes* | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes* | Supabase anon/public key |
| `VITE_API_BASE_URL` | Yes** | Custom backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `VITE_SITE_URL` | Yes | Production site URL |
| `VITE_STORAGE_URL` | Yes | File storage base URL |

*Required if using Supabase
**Required if using custom backend

---

## Backend Setup (Supabase Self-Hosted)

### Step 1: Install Docker

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 2: Deploy Supabase

```bash
# Clone Supabase
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Generate secure keys
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For POSTGRES_PASSWORD

# Configure .env
nano .env

# Start services
docker-compose up -d
```

### Step 3: Configure Supabase

Edit `volumes/api/kong.yml` for API routes and authentication.

---

## Alternative: Custom Node.js Backend

If you prefer not to use Supabase, create a custom Express.js backend:

### Basic Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .env
└── package.json
```

### Sample Express Server

```javascript
// backend/src/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Products API
app.get('/api/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE status = $1', ['active']);
  res.json(result.rows);
});

// ... more routes

app.listen(3001, () => console.log('API running on port 3001'));
```

---

## Frontend Build & Deployment

### Step 1: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun (faster)
bun install
```

### Step 2: Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using bun
bun run build
```

This creates a `dist/` folder with optimized production files.

### Step 3: Preview Build Locally

```bash
npm run preview
```

---

## File Storage Configuration

### Option 1: Supabase Storage

Files are stored in Supabase Storage buckets. The `product-images` bucket is preconfigured.

### Option 2: Local Storage

For local/self-hosted storage:

1. Create uploads directory:
```bash
mkdir -p public/uploads/products
mkdir -p public/uploads/banners
mkdir -p public/uploads/categories
```

2. Configure Nginx for static files:
```nginx
location /uploads {
    alias /var/www/shopbd/uploads;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Option 3: AWS S3 / DigitalOcean Spaces

```env
VITE_STORAGE_TYPE=s3
VITE_S3_BUCKET=shopbd-assets
VITE_S3_REGION=ap-south-1
VITE_S3_ACCESS_KEY=your-access-key
VITE_S3_SECRET_KEY=your-secret-key
```

---

## Authentication Setup

### Email/Password Authentication

Email/password authentication is built-in. For Supabase, enable it in:
- Dashboard → Authentication → Providers → Email

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure OAuth consent screen:
   - App name: ShopBD
   - Authorized domains: yourdomain.com
6. Create OAuth 2.0 Client:
   - Application type: Web application
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: 
     - `https://yourdomain.com/auth/callback`
     - `https://your-project.supabase.co/auth/v1/callback` (if using Supabase)
7. Copy Client ID and Client Secret
8. Configure in Supabase Dashboard → Authentication → Providers → Google

### Self-Hosted OAuth

For self-hosted authentication, implement JWT-based auth:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

---

## Admin Panel Access

### Admin Panel URL

```
https://yourdomain.com/admin
```

### Available Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard |
| `/admin/products` | Product management |
| `/admin/categories` | Category management |
| `/admin/orders` | Order management |
| `/admin/banners` | Banner/Slider management |
| `/admin/home-sections` | Homepage section control |
| `/admin/pages` | CMS pages |
| `/admin/delivery` | Delivery settings |
| `/admin/analytics` | Visitor analytics |
| `/admin/settings` | Site settings |

### Creating First Admin User

1. Register a new user at `/login`
2. Access database and run:

```sql
-- Get the user ID
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Add admin role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('user-id-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

Or using Supabase SQL Editor:
```sql
-- Make user admin by email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## cPanel Deployment

### Step 1: Prepare Files

1. Build the project locally: `npm run build`
2. Create a `.htaccess` file in `dist/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle API proxy (if using custom backend)
  # RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  
  # Handle SPA routing
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 2: Upload to cPanel

1. Login to cPanel
2. Go to File Manager
3. Navigate to `public_html/` (or subdomain folder)
4. Upload all files from `dist/` folder
5. Upload `.htaccess` file

### Step 3: Configure PostgreSQL (if available)

1. Go to cPanel → PostgreSQL Databases
2. Create database and user
3. Import schema using phpPgAdmin or command line

### Step 4: Configure Node.js (if available)

1. Go to cPanel → Setup Node.js App
2. Create application with:
   - Node.js version: 18+
   - Application root: your-app-folder
   - Application URL: yourdomain.com
   - Application startup file: server.js (if using custom backend)
3. Install dependencies and start app

---

## VPS Deployment

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx certbot python3-certbot-nginx nodejs npm postgresql -y

# Install Node.js 18+ (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Step 2: Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/shopbd.git
cd shopbd

# Install dependencies
npm install

# Create production .env
cp .env.example .env
nano .env

# Build for production
npm run build
```

### Step 3: Configure Nginx

```nginx
# /etc/nginx/sites-available/shopbd
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/shopbd/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if using custom backend)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/shopbd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 5: Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start backend (if using custom backend)
pm2 start backend/src/index.js --name shopbd-api

# Save and enable startup
pm2 save
pm2 startup
```

---

## Domain Configuration

### DNS Settings

Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your-Server-IP | 3600 |
| A | www | Your-Server-IP | 3600 |
| CNAME | api | @ | 3600 |

### For Supabase Custom Domain

1. Go to Supabase Dashboard → Settings → Custom Domains
2. Add your domain
3. Configure DNS as instructed

---

## Security Best Practices

### Production Checklist

- [ ] **Environment Variables**: All secrets in `.env`, not in code
- [ ] **HTTPS**: SSL certificate installed and enforced
- [ ] **Security Headers**: X-Frame-Options, X-Content-Type-Options, CSP
- [ ] **Database**: Strong passwords, limited user privileges
- [ ] **RLS Policies**: Properly configured (already done)
- [ ] **Rate Limiting**: Implement on API endpoints
- [ ] **Input Validation**: All user inputs validated
- [ ] **Error Handling**: No sensitive info in error messages
- [ ] **Dependencies**: Regularly updated

### Remove Debug Mode

Ensure in `.env`:
```env
NODE_ENV=production
VITE_DEBUG=false
```

### Database Security

```sql
-- Revoke unnecessary privileges
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Enable RLS on all tables (already done)
-- Verify with:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## Troubleshooting

### Common Issues

#### 1. Page Not Found (404) after refresh

**Cause**: SPA routing not configured
**Solution**: Add `.htaccess` (Apache) or nginx config for fallback to `index.html`

#### 2. API Connection Failed

**Cause**: CORS or incorrect API URL
**Solution**: 
- Check `VITE_SUPABASE_URL` is correct
- Verify Supabase project is running
- Check CORS settings

#### 3. Images Not Loading

**Cause**: Storage bucket not public or wrong URL
**Solution**:
- Verify bucket is public: Supabase → Storage → Bucket settings
- Check image URLs in browser console

#### 4. Admin Panel Access Denied

**Cause**: User doesn't have admin role
**Solution**: Run SQL to add admin role (see Admin Panel Access section)

#### 5. Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Getting Help

- Check browser console for errors
- Review Supabase logs (if using Supabase)
- Check server logs: `sudo journalctl -u nginx -f`
- Database logs: Check PostgreSQL logs

---

## Quick Start Commands

```bash
# Development
npm install
npm run dev

# Production Build
npm run build
npm run preview

# Database
psql -U postgres -d shopbd -f docs/DATABASE_SCHEMA.sql
psql -U postgres -d shopbd -f docs/SEED_DATA.sql
```

---

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@yourdomain.com

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**License**: MIT
