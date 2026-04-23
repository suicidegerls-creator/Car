-- Создание таблицы марок автомобилей
CREATE TABLE IF NOT EXISTS car_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_ru TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы моделей автомобилей
CREATE TABLE IF NOT EXISTS car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  years_from INTEGER,
  years_to INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_car_brands_name ON car_brands(name);
CREATE INDEX IF NOT EXISTS idx_car_brands_popular ON car_brands(is_popular);
CREATE INDEX IF NOT EXISTS idx_car_models_brand_id ON car_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_car_models_name ON car_models(name);

-- Сбрасываем кэш схемы
NOTIFY pgrst, 'reload schema';
