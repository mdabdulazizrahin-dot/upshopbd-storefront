-- ============================================
-- ShopBD E-commerce Seed Data
-- Initial data for Bangladesh districts, upazilas, 
-- categories, delivery settings, and site configuration
-- ============================================
--
-- Run after DATABASE_SCHEMA.sql:
-- psql -U postgres -d shopbd -f SEED_DATA.sql
-- ============================================

-- ============================================
-- 1. Delivery Settings
-- ============================================

INSERT INTO public.delivery_settings (delivery_type, charge, status) VALUES
('inside_dhaka', 60.00, true),
('outside_dhaka', 120.00, true)
ON CONFLICT (delivery_type) DO NOTHING;

-- ============================================
-- 2. Bangladesh Districts (64 Districts)
-- ============================================

INSERT INTO public.districts (id, name, name_bn, division) VALUES
-- Dhaka Division
('d0010000-0000-0000-0000-000000000001', 'Dhaka', 'ঢাকা', 'Dhaka'),
('d0020000-0000-0000-0000-000000000002', 'Faridpur', 'ফরিদপুর', 'Dhaka'),
('d0030000-0000-0000-0000-000000000003', 'Gazipur', 'গাজীপুর', 'Dhaka'),
('d0040000-0000-0000-0000-000000000004', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka'),
('d0050000-0000-0000-0000-000000000005', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka'),
('d0060000-0000-0000-0000-000000000006', 'Madaripur', 'মাদারীপুর', 'Dhaka'),
('d0070000-0000-0000-0000-000000000007', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka'),
('d0080000-0000-0000-0000-000000000008', 'Munshiganj', 'মুন্সীগঞ্জ', 'Dhaka'),
('d0090000-0000-0000-0000-000000000009', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka'),
('d0100000-0000-0000-0000-000000000010', 'Narsingdi', 'নরসিংদী', 'Dhaka'),
('d0110000-0000-0000-0000-000000000011', 'Rajbari', 'রাজবাড়ী', 'Dhaka'),
('d0120000-0000-0000-0000-000000000012', 'Shariatpur', 'শরীয়তপুর', 'Dhaka'),
('d0130000-0000-0000-0000-000000000013', 'Tangail', 'টাঙ্গাইল', 'Dhaka'),
-- Chittagong Division
('d0140000-0000-0000-0000-000000000014', 'Bandarban', 'বান্দরবান', 'Chittagong'),
('d0150000-0000-0000-0000-000000000015', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chittagong'),
('d0160000-0000-0000-0000-000000000016', 'Chandpur', 'চাঁদপুর', 'Chittagong'),
('d0170000-0000-0000-0000-000000000017', 'Chittagong', 'চট্টগ্রাম', 'Chittagong'),
('d0180000-0000-0000-0000-000000000018', 'Comilla', 'কুমিল্লা', 'Chittagong'),
('d0190000-0000-0000-0000-000000000019', 'Coxs Bazar', 'কক্সবাজার', 'Chittagong'),
('d0200000-0000-0000-0000-000000000020', 'Feni', 'ফেনী', 'Chittagong'),
('d0210000-0000-0000-0000-000000000021', 'Khagrachhari', 'খাগড়াছড়ি', 'Chittagong'),
('d0220000-0000-0000-0000-000000000022', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chittagong'),
('d0230000-0000-0000-0000-000000000023', 'Noakhali', 'নোয়াখালী', 'Chittagong'),
('d0240000-0000-0000-0000-000000000024', 'Rangamati', 'রাঙ্গামাটি', 'Chittagong'),
-- Khulna Division
('d0250000-0000-0000-0000-000000000025', 'Bagerhat', 'বাগেরহাট', 'Khulna'),
('d0260000-0000-0000-0000-000000000026', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna'),
('d0270000-0000-0000-0000-000000000027', 'Jessore', 'যশোর', 'Khulna'),
('d0280000-0000-0000-0000-000000000028', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna'),
('d0290000-0000-0000-0000-000000000029', 'Khulna', 'খুলনা', 'Khulna'),
('d0300000-0000-0000-0000-000000000030', 'Kushtia', 'কুষ্টিয়া', 'Khulna'),
('d0310000-0000-0000-0000-000000000031', 'Magura', 'মাগুরা', 'Khulna'),
('d0320000-0000-0000-0000-000000000032', 'Meherpur', 'মেহেরপুর', 'Khulna'),
('d0330000-0000-0000-0000-000000000033', 'Narail', 'নড়াইল', 'Khulna'),
('d0340000-0000-0000-0000-000000000034', 'Satkhira', 'সাতক্ষীরা', 'Khulna'),
-- Rajshahi Division
('d0350000-0000-0000-0000-000000000035', 'Bogra', 'বগুড়া', 'Rajshahi'),
('d0360000-0000-0000-0000-000000000036', 'Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi'),
('d0370000-0000-0000-0000-000000000037', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi'),
('d0380000-0000-0000-0000-000000000038', 'Naogaon', 'নওগাঁ', 'Rajshahi'),
('d0390000-0000-0000-0000-000000000039', 'Natore', 'নাটোর', 'Rajshahi'),
('d0400000-0000-0000-0000-000000000040', 'Nawabganj', 'নবাবগঞ্জ', 'Rajshahi'),
('d0410000-0000-0000-0000-000000000041', 'Pabna', 'পাবনা', 'Rajshahi'),
('d0420000-0000-0000-0000-000000000042', 'Rajshahi', 'রাজশাহী', 'Rajshahi'),
('d0430000-0000-0000-0000-000000000043', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi'),
-- Sylhet Division
('d0440000-0000-0000-0000-000000000044', 'Habiganj', 'হবিগঞ্জ', 'Sylhet'),
('d0450000-0000-0000-0000-000000000045', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet'),
('d0460000-0000-0000-0000-000000000046', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet'),
('d0470000-0000-0000-0000-000000000047', 'Sylhet', 'সিলেট', 'Sylhet'),
-- Barisal Division
('d0480000-0000-0000-0000-000000000048', 'Barguna', 'বরগুনা', 'Barisal'),
('d0490000-0000-0000-0000-000000000049', 'Barisal', 'বরিশাল', 'Barisal'),
('d0500000-0000-0000-0000-000000000050', 'Bhola', 'ভোলা', 'Barisal'),
('d0510000-0000-0000-0000-000000000051', 'Jhalokati', 'ঝালকাঠি', 'Barisal'),
('d0520000-0000-0000-0000-000000000052', 'Patuakhali', 'পটুয়াখালী', 'Barisal'),
('d0530000-0000-0000-0000-000000000053', 'Pirojpur', 'পিরোজপুর', 'Barisal'),
-- Rangpur Division
('d0540000-0000-0000-0000-000000000054', 'Dinajpur', 'দিনাজপুর', 'Rangpur'),
('d0550000-0000-0000-0000-000000000055', 'Gaibandha', 'গাইবান্ধা', 'Rangpur'),
('d0560000-0000-0000-0000-000000000056', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur'),
('d0570000-0000-0000-0000-000000000057', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur'),
('d0580000-0000-0000-0000-000000000058', 'Nilphamari', 'নীলফামারী', 'Rangpur'),
('d0590000-0000-0000-0000-000000000059', 'Panchagarh', 'পঞ্চগড়', 'Rangpur'),
('d0600000-0000-0000-0000-000000000060', 'Rangpur', 'রংপুর', 'Rangpur'),
('d0610000-0000-0000-0000-000000000061', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur'),
-- Mymensingh Division
('d0620000-0000-0000-0000-000000000062', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh'),
('d0630000-0000-0000-0000-000000000063', 'Jamalpur', 'জামালপুর', 'Mymensingh'),
('d0640000-0000-0000-0000-000000000064', 'Netrokona', 'নেত্রকোণা', 'Mymensingh'),
('d0650000-0000-0000-0000-000000000065', 'Sherpur', 'শেরপুর', 'Mymensingh')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. Dhaka Upazilas (Sample - Most Important)
-- ============================================

INSERT INTO public.upazilas (district_id, name, name_bn) VALUES
-- Dhaka District Upazilas
('d0010000-0000-0000-0000-000000000001', 'Dhaka North', 'ঢাকা উত্তর'),
('d0010000-0000-0000-0000-000000000001', 'Dhaka South', 'ঢাকা দক্ষিণ'),
('d0010000-0000-0000-0000-000000000001', 'Dhamrai', 'ধামরাই'),
('d0010000-0000-0000-0000-000000000001', 'Dohar', 'দোহার'),
('d0010000-0000-0000-0000-000000000001', 'Keraniganj', 'কেরানীগঞ্জ'),
('d0010000-0000-0000-0000-000000000001', 'Nawabganj', 'নবাবগঞ্জ'),
('d0010000-0000-0000-0000-000000000001', 'Savar', 'সাভার'),
-- Gazipur District Upazilas
('d0030000-0000-0000-0000-000000000003', 'Gazipur Sadar', 'গাজীপুর সদর'),
('d0030000-0000-0000-0000-000000000003', 'Kaliakair', 'কালিয়াকৈর'),
('d0030000-0000-0000-0000-000000000003', 'Kaliganj', 'কালীগঞ্জ'),
('d0030000-0000-0000-0000-000000000003', 'Kapasia', 'কাপাসিয়া'),
('d0030000-0000-0000-0000-000000000003', 'Sreepur', 'শ্রীপুর'),
-- Chittagong District Upazilas
('d0170000-0000-0000-0000-000000000017', 'Chittagong Sadar', 'চট্টগ্রাম সদর'),
('d0170000-0000-0000-0000-000000000017', 'Anwara', 'আনোয়ারা'),
('d0170000-0000-0000-0000-000000000017', 'Banshkhali', 'বাঁশখালী'),
('d0170000-0000-0000-0000-000000000017', 'Boalkhali', 'বোয়ালখালী'),
('d0170000-0000-0000-0000-000000000017', 'Chandanaish', 'চন্দনাইশ'),
('d0170000-0000-0000-0000-000000000017', 'Fatikchhari', 'ফটিকছড়ি'),
('d0170000-0000-0000-0000-000000000017', 'Hathazari', 'হাটহাজারী'),
('d0170000-0000-0000-0000-000000000017', 'Lohagara', 'লোহাগাড়া'),
('d0170000-0000-0000-0000-000000000017', 'Mirsharai', 'মীরসরাই'),
('d0170000-0000-0000-0000-000000000017', 'Patiya', 'পটিয়া'),
('d0170000-0000-0000-0000-000000000017', 'Rangunia', 'রাঙ্গুনিয়া'),
('d0170000-0000-0000-0000-000000000017', 'Raozan', 'রাউজান'),
('d0170000-0000-0000-0000-000000000017', 'Sandwip', 'সন্দ্বীপ'),
('d0170000-0000-0000-0000-000000000017', 'Satkania', 'সাতকানিয়া'),
('d0170000-0000-0000-0000-000000000017', 'Sitakunda', 'সীতাকুণ্ড')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. Categories
-- ============================================

INSERT INTO public.categories (name, name_bn, slug, status) VALUES
('Electronics', 'ইলেকট্রনিক্স', 'electronics', 'active'),
('Fashion', 'ফ্যাশন', 'fashion', 'active'),
('Home & Living', 'হোম এন্ড লিভিং', 'home-living', 'active'),
('Beauty', 'বিউটি', 'beauty', 'active'),
('Sports', 'স্পোর্টস', 'sports', 'active'),
('Books', 'বই', 'books', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 5. Site Settings
-- ============================================

INSERT INTO public.site_settings (setting_key, setting_value, setting_group) VALUES
-- Typography
('typography', '{"fontFamily": "Hind Siliguri", "headingSize": "2.5rem", "bodySize": "1rem", "lineHeight": "1.6"}', 'typography'),
-- Colors
('colors', '{"primary": "346 77% 50%", "secondary": "346 60% 40%", "buttonColor": "346 77% 50%", "hoverColor": "346 77% 45%", "textColor": "0 0% 20%", "backgroundColor": "0 0% 100%"}', 'colors'),
-- Header
('header', '{"logoUrl": "", "backgroundColor": "0 0% 100%", "isSticky": true}', 'header'),
-- Footer
('footer', '{"backgroundColor": "0 0% 10%", "textColor": "0 0% 100%", "copyrightText": "© 2026 ShopBD. All rights reserved.", "columns": []}', 'footer'),
-- General
('general', '{"siteName": "ShopBD", "tagline": "Your One-Stop Shop", "phone": "+880 1234-567890", "email": "info@shopbd.com", "address": "Dhaka, Bangladesh", "faviconUrl": ""}', 'general'),
-- Social Media
('social', '{"facebook": "", "instagram": "", "twitter": "", "youtube": "", "linkedin": ""}', 'social')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 6. Home Sections
-- ============================================

INSERT INTO public.home_sections (section_key, title, is_visible, sort_order, settings) VALUES
('hero_banner', 'Hero Banner', true, 1, '{}'),
('categories', 'Top Categories', true, 2, '{"title": "Top Categories"}'),
('featured_products', 'Featured Products', true, 3, '{"title": "Featured Products", "limit": 12}'),
('features', 'Features', true, 4, '{}')
ON CONFLICT (section_key) DO NOTHING;

-- ============================================
-- 7. Default Pages
-- ============================================

INSERT INTO public.pages (slug, title, content, seo_title, seo_description, status) VALUES
('about-us', 'About Us', 'Welcome to ShopBD - Your trusted e-commerce partner in Bangladesh.', 'About Us - ShopBD', 'Learn more about ShopBD, your trusted e-commerce partner.', 'published'),
('contact-us', 'Contact Us', 'Get in touch with us for any inquiries.', 'Contact Us - ShopBD', 'Contact ShopBD for support and inquiries.', 'published'),
('privacy-policy', 'Privacy Policy', 'Your privacy is important to us.', 'Privacy Policy - ShopBD', 'Read our privacy policy.', 'published'),
('terms-conditions', 'Terms & Conditions', 'By using our services, you agree to these terms.', 'Terms & Conditions - ShopBD', 'Read our terms and conditions.', 'published'),
('return-policy', 'Return & Refund Policy', 'Our return and refund policies.', 'Return Policy - ShopBD', 'Learn about our return and refund policies.', 'published'),
('faq', 'Frequently Asked Questions', '[]', 'FAQ - ShopBD', 'Find answers to frequently asked questions.', 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Data Complete
-- ============================================
-- Your database is now ready with:
-- - 64 Bangladesh districts
-- - Sample upazilas for major districts
-- - 6 default categories
-- - Delivery settings (Inside/Outside Dhaka)
-- - Site settings for CMS
-- - Default home sections
-- - Static pages structure
-- ============================================
