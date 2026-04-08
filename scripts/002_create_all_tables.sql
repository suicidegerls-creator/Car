-- =====================================================
-- ПОЛНАЯ МИГРАЦИЯ БАЗЫ ДАННЫХ ДЛЯ МАГАЗИНА ДИСКОВ
-- =====================================================

-- =====================================================
-- 1. ТАБЛИЦА ДИСКОВ (wheels)
-- =====================================================
CREATE TABLE IF NOT EXISTS wheels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Основная информация
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  sku TEXT UNIQUE,
  description TEXT,
  
  -- Цена и наличие
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  in_stock BOOLEAN DEFAULT true,
  quantity INTEGER DEFAULT 0,
  
  -- Технические характеристики
  wheel_type TEXT NOT NULL CHECK (wheel_type IN ('forged', 'cast', 'stamped')),
  diameter INTEGER NOT NULL,
  width DECIMAL(4, 1) NOT NULL,
  pcd TEXT NOT NULL,
  et INTEGER NOT NULL,
  center_bore DECIMAL(5, 1) NOT NULL,
  bolts_count INTEGER,
  
  -- Дополнительные характеристики
  color TEXT,
  finish TEXT,
  material TEXT,
  weight DECIMAL(4, 1),
  country TEXT,
  
  -- Изображения (массив URL)
  images TEXT[] DEFAULT '{}',
  
  -- SEO
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  
  -- Метаданные
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска дисков
CREATE INDEX IF NOT EXISTS idx_wheels_brand ON wheels(brand);
CREATE INDEX IF NOT EXISTS idx_wheels_wheel_type ON wheels(wheel_type);
CREATE INDEX IF NOT EXISTS idx_wheels_diameter ON wheels(diameter);
CREATE INDEX IF NOT EXISTS idx_wheels_pcd ON wheels(pcd);
CREATE INDEX IF NOT EXISTS idx_wheels_price ON wheels(price);
CREATE INDEX IF NOT EXISTS idx_wheels_in_stock ON wheels(in_stock);
CREATE INDEX IF NOT EXISTS idx_wheels_slug ON wheels(slug);

-- =====================================================
-- 2. ТАБЛИЦА СОВМЕСТИМОСТИ С АВТОМОБИЛЯМИ (car_compatibility)
-- =====================================================
CREATE TABLE IF NOT EXISTS car_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id UUID NOT NULL REFERENCES wheels(id) ON DELETE CASCADE,
  car_brand TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year_from INTEGER,
  car_year_to INTEGER,
  car_modification TEXT,
  all_models BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска совместимости
CREATE INDEX IF NOT EXISTS idx_car_compatibility_wheel_id ON car_compatibility(wheel_id);
CREATE INDEX IF NOT EXISTS idx_car_compatibility_car_brand ON car_compatibility(car_brand);
CREATE INDEX IF NOT EXISTS idx_car_compatibility_car_model ON car_compatibility(car_model);

-- =====================================================
-- 3. ТАБЛИЦА ЗАКАЗОВ (orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  -- Информация о клиенте
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Информация о доставке
  delivery_city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_comment TEXT,
  
  -- Суммы
  total_amount DECIMAL(12, 2) NOT NULL,
  items_count INTEGER NOT NULL DEFAULT 0,
  
  -- Метаданные
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для заказов
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =====================================================
-- 4. ТАБЛИЦА ТОВАРОВ В ЗАКАЗЕ (order_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  wheel_id UUID NOT NULL,
  
  -- Информация о товаре (сохраняем на момент заказа)
  wheel_name TEXT NOT NULL,
  wheel_brand TEXT NOT NULL,
  wheel_sku TEXT,
  wheel_image TEXT,
  diameter INTEGER,
  width DECIMAL(4, 1),
  pcd TEXT,
  et INTEGER,
  
  -- Цена и количество
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Метаданные
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для товаров в заказе
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_wheel_id ON order_items(wheel_id);

-- =====================================================
-- 5. ТАБЛИЦА ОБРАЩЕНИЙ В ПОДДЕРЖКУ (support_requests)
-- =====================================================
CREATE TABLE IF NOT EXISTS support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  
  -- Информация о клиенте
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Обращение
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Ответ администратора
  admin_response TEXT,
  
  -- Метаданные
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для обращений
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_customer_phone ON support_requests(customer_phone);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at);

-- =====================================================
-- 6. ТАБЛИЦА ИЗБРАННОГО (favorites) - опционально
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  wheel_id UUID NOT NULL REFERENCES wheels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, wheel_id)
);

-- Индексы для избранного
CREATE INDEX IF NOT EXISTS idx_favorites_session_id ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_favorites_wheel_id ON favorites(wheel_id);

-- =====================================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- =====================================================

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_wheels_updated_at ON wheels;
CREATE TRIGGER update_wheels_updated_at
  BEFORE UPDATE ON wheels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_requests_updated_at ON support_requests;
CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON support_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Включаем RLS для всех таблиц
ALTER TABLE wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ПОЛИТИКИ ДЛЯ WHEELS
-- =====================================================
DROP POLICY IF EXISTS "wheels_public_read" ON wheels;
CREATE POLICY "wheels_public_read" ON wheels 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "wheels_insert" ON wheels;
CREATE POLICY "wheels_insert" ON wheels 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "wheels_update" ON wheels;
CREATE POLICY "wheels_update" ON wheels 
  FOR UPDATE 
  USING (true);

DROP POLICY IF EXISTS "wheels_delete" ON wheels;
CREATE POLICY "wheels_delete" ON wheels 
  FOR DELETE 
  USING (true);

-- =====================================================
-- ПОЛИТИКИ ДЛЯ CAR_COMPATIBILITY
-- =====================================================
DROP POLICY IF EXISTS "car_compatibility_public_read" ON car_compatibility;
CREATE POLICY "car_compatibility_public_read" ON car_compatibility 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "car_compatibility_insert" ON car_compatibility;
CREATE POLICY "car_compatibility_insert" ON car_compatibility 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "car_compatibility_update" ON car_compatibility;
CREATE POLICY "car_compatibility_update" ON car_compatibility 
  FOR UPDATE 
  USING (true);

DROP POLICY IF EXISTS "car_compatibility_delete" ON car_compatibility;
CREATE POLICY "car_compatibility_delete" ON car_compatibility 
  FOR DELETE 
  USING (true);

-- =====================================================
-- ПОЛИТИКИ ДЛЯ ORDERS
-- =====================================================
DROP POLICY IF EXISTS "orders_public_read" ON orders;
CREATE POLICY "orders_public_read" ON orders 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "orders_insert" ON orders;
CREATE POLICY "orders_insert" ON orders 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update" ON orders;
CREATE POLICY "orders_update" ON orders 
  FOR UPDATE 
  USING (true);

DROP POLICY IF EXISTS "orders_delete" ON orders;
CREATE POLICY "orders_delete" ON orders 
  FOR DELETE 
  USING (true);

-- =====================================================
-- ПОЛИТИКИ ДЛЯ ORDER_ITEMS
-- =====================================================
DROP POLICY IF EXISTS "order_items_public_read" ON order_items;
CREATE POLICY "order_items_public_read" ON order_items 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "order_items_insert" ON order_items;
CREATE POLICY "order_items_insert" ON order_items 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_delete" ON order_items;
CREATE POLICY "order_items_delete" ON order_items 
  FOR DELETE 
  USING (true);

-- =====================================================
-- ПОЛИТИКИ ДЛЯ SUPPORT_REQUESTS
-- =====================================================
DROP POLICY IF EXISTS "support_requests_public_read" ON support_requests;
CREATE POLICY "support_requests_public_read" ON support_requests 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "support_requests_insert" ON support_requests;
CREATE POLICY "support_requests_insert" ON support_requests 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "support_requests_update" ON support_requests;
CREATE POLICY "support_requests_update" ON support_requests 
  FOR UPDATE 
  USING (true);

-- =====================================================
-- ПОЛИТИКИ ДЛЯ FAVORITES
-- =====================================================
DROP POLICY IF EXISTS "favorites_public_read" ON favorites;
CREATE POLICY "favorites_public_read" ON favorites 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "favorites_insert" ON favorites;
CREATE POLICY "favorites_insert" ON favorites 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "favorites_delete" ON favorites;
CREATE POLICY "favorites_delete" ON favorites 
  FOR DELETE 
  USING (true);
