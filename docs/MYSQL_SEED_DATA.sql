-- ============================================
-- ShopBD E-commerce Seed Data
-- MySQL Compatible Version
-- ============================================
-- 
-- Run this after MYSQL_SCHEMA.sql
-- mysql -u root -p shopbd < MYSQL_SEED_DATA.sql
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- 1. Delivery Settings
-- ============================================

INSERT INTO delivery_settings (id, delivery_type, charge, status) VALUES
(UUID(), 'inside_dhaka', 60.00, 1),
(UUID(), 'outside_dhaka', 120.00, 1);

-- ============================================
-- 2. Bangladesh Districts (All 64)
-- ============================================

INSERT INTO districts (id, name, name_bn, division) VALUES
-- Dhaka Division
(UUID(), 'Dhaka', 'ঢাকা', 'Dhaka'),
(UUID(), 'Faridpur', 'ফরিদপুর', 'Dhaka'),
(UUID(), 'Gazipur', 'গাজীপুর', 'Dhaka'),
(UUID(), 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka'),
(UUID(), 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka'),
(UUID(), 'Madaripur', 'মাদারীপুর', 'Dhaka'),
(UUID(), 'Manikganj', 'মানিকগঞ্জ', 'Dhaka'),
(UUID(), 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka'),
(UUID(), 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka'),
(UUID(), 'Narsingdi', 'নরসিংদী', 'Dhaka'),
(UUID(), 'Rajbari', 'রাজবাড়ী', 'Dhaka'),
(UUID(), 'Shariatpur', 'শরীয়তপুর', 'Dhaka'),
(UUID(), 'Tangail', 'টাঙ্গাইল', 'Dhaka'),
-- Chattogram Division
(UUID(), 'Bandarban', 'বান্দরবান', 'Chattogram'),
(UUID(), 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram'),
(UUID(), 'Chandpur', 'চাঁদপুর', 'Chattogram'),
(UUID(), 'Chattogram', 'চট্টগ্রাম', 'Chattogram'),
(UUID(), 'Comilla', 'কুমিল্লা', 'Chattogram'),
(UUID(), 'Coxs Bazar', 'কক্সবাজার', 'Chattogram'),
(UUID(), 'Feni', 'ফেনী', 'Chattogram'),
(UUID(), 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram'),
(UUID(), 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram'),
(UUID(), 'Noakhali', 'নোয়াখালী', 'Chattogram'),
(UUID(), 'Rangamati', 'রাঙ্গামাটি', 'Chattogram'),
-- Rajshahi Division
(UUID(), 'Bogra', 'বগুড়া', 'Rajshahi'),
(UUID(), 'Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi'),
(UUID(), 'Joypurhat', 'জয়পুরহাট', 'Rajshahi'),
(UUID(), 'Naogaon', 'নওগাঁ', 'Rajshahi'),
(UUID(), 'Natore', 'নাটোর', 'Rajshahi'),
(UUID(), 'Nawabganj', 'নবাবগঞ্জ', 'Rajshahi'),
(UUID(), 'Pabna', 'পাবনা', 'Rajshahi'),
(UUID(), 'Rajshahi', 'রাজশাহী', 'Rajshahi'),
(UUID(), 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi'),
-- Khulna Division
(UUID(), 'Bagerhat', 'বাগেরহাট', 'Khulna'),
(UUID(), 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna'),
(UUID(), 'Jessore', 'যশোর', 'Khulna'),
(UUID(), 'Jhenaidah', 'ঝিনাইদহ', 'Khulna'),
(UUID(), 'Khulna', 'খুলনা', 'Khulna'),
(UUID(), 'Kushtia', 'কুষ্টিয়া', 'Khulna'),
(UUID(), 'Magura', 'মাগুরা', 'Khulna'),
(UUID(), 'Meherpur', 'মেহেরপুর', 'Khulna'),
(UUID(), 'Narail', 'নড়াইল', 'Khulna'),
(UUID(), 'Satkhira', 'সাতক্ষীরা', 'Khulna'),
-- Barishal Division
(UUID(), 'Barguna', 'বরগুনা', 'Barishal'),
(UUID(), 'Barishal', 'বরিশাল', 'Barishal'),
(UUID(), 'Bhola', 'ভোলা', 'Barishal'),
(UUID(), 'Jhalokati', 'ঝালকাঠি', 'Barishal'),
(UUID(), 'Patuakhali', 'পটুয়াখালী', 'Barishal'),
(UUID(), 'Pirojpur', 'পিরোজপুর', 'Barishal'),
-- Sylhet Division
(UUID(), 'Habiganj', 'হবিগঞ্জ', 'Sylhet'),
(UUID(), 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet'),
(UUID(), 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet'),
(UUID(), 'Sylhet', 'সিলেট', 'Sylhet'),
-- Rangpur Division
(UUID(), 'Dinajpur', 'দিনাজপুর', 'Rangpur'),
(UUID(), 'Gaibandha', 'গাইবান্ধা', 'Rangpur'),
(UUID(), 'Kurigram', 'কুড়িগ্রাম', 'Rangpur'),
(UUID(), 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur'),
(UUID(), 'Nilphamari', 'নীলফামারী', 'Rangpur'),
(UUID(), 'Panchagarh', 'পঞ্চগড়', 'Rangpur'),
(UUID(), 'Rangpur', 'রংপুর', 'Rangpur'),
(UUID(), 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur'),
-- Mymensingh Division
(UUID(), 'Jamalpur', 'জামালপুর', 'Mymensingh'),
(UUID(), 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh'),
(UUID(), 'Netrokona', 'নেত্রকোণা', 'Mymensingh'),
(UUID(), 'Sherpur', 'শেরপুর', 'Mymensingh');

-- ============================================
-- 3. Sample Categories
-- ============================================

INSERT INTO categories (id, name, name_bn, slug, status, image_url) VALUES
(UUID(), 'Electronics', 'ইলেকট্রনিক্স', 'electronics', 'active', NULL),
(UUID(), 'Fashion', 'ফ্যাশন', 'fashion', 'active', NULL),
(UUID(), 'Home & Living', 'হোম অ্যান্ড লিভিং', 'home-living', 'active', NULL),
(UUID(), 'Beauty', 'বিউটি', 'beauty', 'active', NULL),
(UUID(), 'Sports', 'স্পোর্টস', 'sports', 'active', NULL),
(UUID(), 'Books', 'বই', 'books', 'active', NULL);

-- ============================================
-- 4. Site Settings
-- ============================================

INSERT INTO site_settings (id, setting_key, setting_value, setting_group) VALUES
(UUID(), 'site_name', '"ShopBD"', 'general'),
(UUID(), 'site_tagline', '"Your Trusted Online Store"', 'general'),
(UUID(), 'site_logo', '""', 'general'),
(UUID(), 'contact_email', '"support@shopbd.com"', 'contact'),
(UUID(), 'contact_phone', '"+880 1700-000000"', 'contact'),
(UUID(), 'contact_address', '"Dhaka, Bangladesh"', 'contact'),
(UUID(), 'facebook_url', '""', 'social'),
(UUID(), 'instagram_url', '""', 'social'),
(UUID(), 'youtube_url', '""', 'social'),
(UUID(), 'currency_symbol', '"৳"', 'general'),
(UUID(), 'currency_position', '"before"', 'general');

-- ============================================
-- 5. Home Sections
-- ============================================

INSERT INTO home_sections (id, section_key, title, is_visible, sort_order, settings) VALUES
(UUID(), 'hero', 'Hero Banner', 1, 1, '{"autoplay": true, "interval": 5000}'),
(UUID(), 'categories', 'Top Categories', 1, 2, '{"columns": 6, "showAll": true}'),
(UUID(), 'featured_products', 'Featured Products', 1, 3, '{"limit": 8, "columns": 4}'),
(UUID(), 'new_arrivals', 'New Arrivals', 1, 4, '{"limit": 8, "columns": 4}'),
(UUID(), 'best_sellers', 'Best Sellers', 0, 5, '{"limit": 8, "columns": 4}');

-- ============================================
-- 6. Default Pages
-- ============================================

INSERT INTO pages (id, slug, title, content, seo_title, seo_description, status) VALUES
(UUID(), 'about-us', 'About Us', '<h2>About ShopBD</h2><p>Welcome to ShopBD, your trusted online shopping destination in Bangladesh.</p>', 'About Us - ShopBD', 'Learn about ShopBD, your trusted online store in Bangladesh.', 'published'),
(UUID(), 'contact-us', 'Contact Us', '<h2>Contact Us</h2><p>Get in touch with our support team.</p>', 'Contact Us - ShopBD', 'Contact ShopBD customer support for any queries.', 'published'),
(UUID(), 'privacy-policy', 'Privacy Policy', '<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>', 'Privacy Policy - ShopBD', 'Read our privacy policy to understand how we protect your data.', 'published'),
(UUID(), 'terms-conditions', 'Terms & Conditions', '<h2>Terms and Conditions</h2><p>Please read these terms carefully.</p>', 'Terms & Conditions - ShopBD', 'Read our terms and conditions before using our services.', 'published'),
(UUID(), 'return-policy', 'Return & Refund Policy', '<h2>Return Policy</h2><p>We offer hassle-free returns.</p>', 'Return Policy - ShopBD', 'Learn about our return and refund policy.', 'published'),
(UUID(), 'faq', 'FAQ', '<h2>Frequently Asked Questions</h2><p>Find answers to common questions.</p>', 'FAQ - ShopBD', 'Frequently asked questions about ShopBD.', 'published');

-- ============================================
-- Seed Data Complete!
-- ============================================
-- 
-- Next: Create an admin user using PHP or your backend
-- Example PHP code to create admin:
-- 
-- $password_hash = password_hash('admin123', PASSWORD_DEFAULT);
-- INSERT INTO users (id, email, password_hash, email_confirmed_at) 
-- VALUES (UUID(), 'admin@shopbd.com', '$password_hash', NOW());
-- 
-- Then add admin role:
-- INSERT INTO user_roles (id, user_id, role) 
-- VALUES (UUID(), '<user_id>', 'admin');
-- ============================================
