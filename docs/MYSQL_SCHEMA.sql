-- ============================================
-- ShopBD E-commerce Database Schema
-- MySQL Compatible Version for Shared Hosting
-- ============================================
-- 
-- This schema is compatible with MySQL 5.7+ / MariaDB 10.2+
-- For PostgreSQL version, see DATABASE_SCHEMA.sql
--
-- Run this file to set up the complete database:
-- mysql -u root -p shopbd < MYSQL_SCHEMA.sql
-- ============================================

-- Set default character set
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- 1. Users Table (For Self-Hosted Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_confirmed_at TIMESTAMP NULL,
    raw_user_meta_data JSON DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Profiles Table
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_profiles_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. User Roles Table
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_role (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Categories Table
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Products Table
-- ============================================

CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_type ENUM('simple', 'variable') NOT NULL DEFAULT 'simple',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id CHAR(36),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_seo_slug (seo_slug),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Product Images Table
-- ============================================

CREATE TABLE IF NOT EXISTS product_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    is_main TINYINT(1) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_images_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Product Variations Table
-- ============================================

CREATE TABLE IF NOT EXISTS product_variations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    sku VARCHAR(100),
    attributes JSON NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_variations_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Districts Table (Bangladesh 64 Districts)
-- ============================================

CREATE TABLE IF NOT EXISTS districts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    division VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_districts_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. Upazilas Table
-- ============================================

CREATE TABLE IF NOT EXISTS upazilas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    district_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_upazilas_district (district_id),
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. Delivery Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    delivery_type ENUM('inside_dhaka', 'outside_dhaka') NOT NULL UNIQUE,
    charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. Orders Table
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id CHAR(36),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    district_id CHAR(36),
    upazila_id CHAR(36),
    order_note TEXT,
    delivery_type ENUM('inside_dhaka', 'outside_dhaka') NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_method ENUM('cod') NOT NULL DEFAULT 'cod',
    payment_status ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_created (created_at),
    INDEX idx_orders_number (order_number),
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
    FOREIGN KEY (upazila_id) REFERENCES upazilas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. Order Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36),
    variation_id CHAR(36),
    product_name VARCHAR(255) NOT NULL,
    variation_attributes JSON,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_items_order (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. Visitors Table (Analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS visitors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    visited_page TEXT NOT NULL,
    referrer TEXT,
    visit_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visitors_session (session_id),
    INDEX idx_visitors_visit_time (visit_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. Daily Analytics Table
-- ============================================

CREATE TABLE IF NOT EXISTS daily_analytics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    date DATE NOT NULL UNIQUE,
    total_visits INT NOT NULL DEFAULT 0,
    unique_visitors INT NOT NULL DEFAULT 0,
    total_orders INT NOT NULL DEFAULT 0,
    total_sales DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_daily_analytics_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 15. Site Settings Table (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS site_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSON NOT NULL,
    setting_group VARCHAR(100) NOT NULL DEFAULT 'general',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_site_settings_key (setting_key),
    INDEX idx_site_settings_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 16. Pages Table (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS pages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pages_slug (slug),
    INDEX idx_pages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 17. Home Sections Table
-- ============================================

CREATE TABLE IF NOT EXISTS home_sections (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    is_visible TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    settings JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_home_sections_key (section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 18. Banners Table
-- ============================================

CREATE TABLE IF NOT EXISTS banners (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255),
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    button_text VARCHAR(100),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_banners_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 19. Menu Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS menu_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    menu_location VARCHAR(50) NOT NULL DEFAULT 'header',
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    parent_id CHAR(36),
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_menu_items_location (menu_location),
    INDEX idx_menu_items_parent (parent_id),
    FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 20. Stored Procedures
-- ============================================

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS check_user_role;
DROP PROCEDURE IF EXISTS is_admin;
DROP PROCEDURE IF EXISTS generate_order_number;

DELIMITER //

-- Procedure to check if user has a specific role
CREATE PROCEDURE check_user_role(IN p_user_id CHAR(36), IN p_role VARCHAR(50), OUT p_has_role TINYINT)
BEGIN
    SELECT COUNT(*) > 0 INTO p_has_role
    FROM user_roles
    WHERE user_id = p_user_id AND role = p_role;
END //

-- Procedure to check if user is admin
CREATE PROCEDURE is_admin(IN p_user_id CHAR(36), OUT p_is_admin TINYINT)
BEGIN
    CALL check_user_role(p_user_id, 'admin', p_is_admin);
END //

-- Procedure to generate order number
CREATE PROCEDURE generate_order_number(OUT p_order_number VARCHAR(50))
BEGIN
    SET p_order_number = CONCAT('SBD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
END //

DELIMITER ;

-- ============================================
-- 21. Triggers
-- ============================================

-- MySQL automatically handles ON UPDATE CURRENT_TIMESTAMP
-- So we only need a trigger for order number generation

DROP TRIGGER IF EXISTS before_insert_orders;

DELIMITER //

CREATE TRIGGER before_insert_orders
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        SET NEW.order_number = CONCAT('SBD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END //

DELIMITER ;

-- ============================================
-- 22. Helper Functions (MySQL 8.0+)
-- ============================================

-- Note: These functions require MySQL 8.0+
-- For MySQL 5.7, use the stored procedures above

DROP FUNCTION IF EXISTS fn_has_role;
DROP FUNCTION IF EXISTS fn_is_admin;

DELIMITER //

CREATE FUNCTION fn_has_role(p_user_id CHAR(36), p_role VARCHAR(50))
RETURNS TINYINT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_result TINYINT DEFAULT 0;
    SELECT COUNT(*) > 0 INTO v_result
    FROM user_roles
    WHERE user_id = p_user_id AND role = p_role;
    RETURN v_result;
END //

CREATE FUNCTION fn_is_admin(p_user_id CHAR(36))
RETURNS TINYINT
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN fn_has_role(p_user_id, 'admin');
END //

DELIMITER ;

-- ============================================
-- Schema Complete!
-- ============================================
-- 
-- Next Steps:
-- 1. Run MYSQL_SEED_DATA.sql to populate initial data
-- 2. Create your first admin user
-- 3. Configure your .env file
-- 4. Start the application
-- ============================================
