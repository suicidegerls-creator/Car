-- =====================================================
-- RLS ПОЛИТИКИ ДЛЯ DISKIBEL
-- Запустите этот скрипт после создания таблиц
-- ВАЖНО: Эти политики работают только в Supabase/PostgreSQL с auth.uid()
-- Для других БД без Supabase Auth - пропустите этот файл
-- =====================================================

-- =====================================================
-- CAR_BRANDS - Публичное чтение (справочник)
-- =====================================================
ALTER TABLE car_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car_brands_public_read" ON car_brands
  FOR SELECT USING (true);

CREATE POLICY "car_brands_insert" ON car_brands
  FOR INSERT WITH CHECK (true);

CREATE POLICY "car_brands_update" ON car_brands
  FOR UPDATE USING (true);

CREATE POLICY "car_brands_delete" ON car_brands
  FOR DELETE USING (true);

-- =====================================================
-- CAR_MODELS - Публичное чтение (справочник)
-- =====================================================
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car_models_public_read" ON car_models
  FOR SELECT USING (true);

CREATE POLICY "car_models_insert" ON car_models
  FOR INSERT WITH CHECK (true);

CREATE POLICY "car_models_update" ON car_models
  FOR UPDATE USING (true);

CREATE POLICY "car_models_delete" ON car_models
  FOR DELETE USING (true);

-- =====================================================
-- WHEELS - Публичное чтение, авторизованные могут изменять
-- =====================================================
ALTER TABLE wheels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wheels_public_read" ON wheels
  FOR SELECT USING (true);

CREATE POLICY "wheels_insert" ON wheels
  FOR INSERT WITH CHECK (true);

CREATE POLICY "wheels_update" ON wheels
  FOR UPDATE USING (true);

CREATE POLICY "wheels_delete" ON wheels
  FOR DELETE USING (true);

-- =====================================================
-- CAR_COMPATIBILITY - Публичное чтение
-- =====================================================
ALTER TABLE car_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car_compatibility_public_read" ON car_compatibility
  FOR SELECT USING (true);

CREATE POLICY "car_compatibility_insert" ON car_compatibility
  FOR INSERT WITH CHECK (true);

CREATE POLICY "car_compatibility_update" ON car_compatibility
  FOR UPDATE USING (true);

CREATE POLICY "car_compatibility_delete" ON car_compatibility
  FOR DELETE USING (true);

-- =====================================================
-- PROFILES - Пользователь видит только свой профиль
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- FAVORITES - Публичный доступ (для session_id)
-- =====================================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_public_read" ON favorites
  FOR SELECT USING (true);

CREATE POLICY "favorites_insert" ON favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "favorites_delete" ON favorites
  FOR DELETE USING (true);

-- =====================================================
-- ORDERS - Публичный доступ для админки
-- =====================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_public_read" ON orders
  FOR SELECT USING (true);

CREATE POLICY "orders_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_update" ON orders
  FOR UPDATE USING (true);

CREATE POLICY "orders_delete" ON orders
  FOR DELETE USING (true);

-- =====================================================
-- ORDER_ITEMS - Публичный доступ
-- =====================================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_public_read" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_delete" ON order_items
  FOR DELETE USING (true);

-- =====================================================
-- SUPPORT_REQUESTS - Публичный доступ для админки
-- =====================================================
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_requests_public_read" ON support_requests
  FOR SELECT USING (true);

CREATE POLICY "support_requests_insert" ON support_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "support_requests_update" ON support_requests
  FOR UPDATE USING (true);

CREATE POLICY "support_requests_delete" ON support_requests
  FOR DELETE USING (true);

-- =====================================================
-- USER_DISCOUNTS - Пользователь видит только свои скидки
-- =====================================================
ALTER TABLE user_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own discounts" ON user_discounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own discounts" ON user_discounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discounts" ON user_discounts
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- ГОТОВО! RLS политики настроены.
-- =====================================================
