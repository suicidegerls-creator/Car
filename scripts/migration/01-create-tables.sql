-- =====================================================
-- СКРИПТ СОЗДАНИЯ ТАБЛИЦ ДЛЯ DISKIBEL
-- Запустите этот скрипт на новой базе данных PostgreSQL
-- =====================================================

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. МАРКИ АВТОМОБИЛЕЙ
-- =====================================================
CREATE TABLE IF NOT EXISTS car_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_car_brands_name ON car_brands(name);

-- =====================================================
-- 2. МОДЕЛИ АВТОМОБИЛЕЙ
-- =====================================================
CREATE TABLE IF NOT EXISTS car_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  years_from INTEGER,
  years_to INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_car_models_brand_id ON car_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_car_models_name ON car_models(name);

-- =====================================================
-- 3. ДИСКИ
-- =====================================================
CREATE TYPE wheel_type AS ENUM ('литые', 'кованые', 'штампованные');

CREATE TABLE IF NOT EXISTS wheels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  diameter INTEGER NOT NULL,
  width DECIMAL(4, 1) NOT NULL,
  pcd VARCHAR(50) NOT NULL,
  et INTEGER NOT NULL,
  center_bore DECIMAL(5, 1) NOT NULL,
  color VARCHAR(100) NOT NULL,
  wheel_type wheel_type DEFAULT 'литые',
  image_url TEXT,
  image_transparent TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  is_universal BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wheels_brand ON wheels(brand);
CREATE INDEX IF NOT EXISTS idx_wheels_diameter ON wheels(diameter);
CREATE INDEX IF NOT EXISTS idx_wheels_price ON wheels(price);
CREATE INDEX IF NOT EXISTS idx_wheels_pcd ON wheels(pcd);
CREATE INDEX IF NOT EXISTS idx_wheels_in_stock ON wheels(in_stock);

-- =====================================================
-- 4. СОВМЕСТИМОСТЬ ДИСКОВ С АВТО
-- =====================================================
CREATE TABLE IF NOT EXISTS car_compatibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wheel_id UUID NOT NULL REFERENCES wheels(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,
  model_id UUID REFERENCES car_models(id) ON DELETE SET NULL,
  year_from INTEGER,
  year_to INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_car_compatibility_wheel_id ON car_compatibility(wheel_id);
CREATE INDEX IF NOT EXISTS idx_car_compatibility_brand_id ON car_compatibility(brand_id);
CREATE INDEX IF NOT EXISTS idx_car_compatibility_model_id ON car_compatibility(model_id);

-- =====================================================
-- 5. ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  city VARCHAR(255),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. ИЗБРАННОЕ
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  wheel_id UUID NOT NULL REFERENCES wheels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT favorites_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_session_id ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_favorites_wheel_id ON favorites(wheel_id);

-- =====================================================
-- 7. ЗАКАЗЫ
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  status VARCHAR(50) DEFAULT 'new',
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  delivery_type VARCHAR(50) DEFAULT 'delivery',
  delivery_city VARCHAR(255),
  delivery_address TEXT,
  delivery_comment TEXT,
  payment_method VARCHAR(50) DEFAULT 'cash',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =====================================================
-- 8. ПОЗИЦИИ ЗАКАЗОВ
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  wheel_id UUID REFERENCES wheels(id) ON DELETE SET NULL,
  wheel_name VARCHAR(255) NOT NULL,
  wheel_brand VARCHAR(255),
  wheel_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 9. ОБРАЩЕНИЯ В ПОДДЕРЖКУ
-- =====================================================
CREATE TABLE IF NOT EXISTS support_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status VARCHAR(50) DEFAULT 'new',
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at);

-- =====================================================
-- 10. СКИДКИ ПОЛЬЗОВАТЕЛЕЙ (КОЛЕСО УДАЧИ)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 5),
  spun_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  activated_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_discounts_user_id ON user_discounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_discounts_expires_at ON user_discounts(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_discounts_spun_at ON user_discounts(spun_at);

-- =====================================================
-- ГОТОВО! Таблицы созданы.
-- Теперь запустите 02-rls-policies.sql для настройки безопасности
-- =====================================================
