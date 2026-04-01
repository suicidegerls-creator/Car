-- Таблица автомобильных дисков
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

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_wheels_brand ON wheels(brand);
CREATE INDEX IF NOT EXISTS idx_wheels_wheel_type ON wheels(wheel_type);
CREATE INDEX IF NOT EXISTS idx_wheels_diameter ON wheels(diameter);
CREATE INDEX IF NOT EXISTS idx_wheels_pcd ON wheels(pcd);
CREATE INDEX IF NOT EXISTS idx_wheels_price ON wheels(price);
CREATE INDEX IF NOT EXISTS idx_wheels_in_stock ON wheels(in_stock);
CREATE INDEX IF NOT EXISTS idx_wheels_slug ON wheels(slug);

-- RLS для публичного чтения
ALTER TABLE wheels ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать диски
DROP POLICY IF EXISTS "wheels_public_read" ON wheels;
CREATE POLICY "wheels_public_read" ON wheels 
  FOR SELECT 
  USING (true);

-- Политика: вставка через сервисный ключ (anon не может вставлять)
DROP POLICY IF EXISTS "wheels_insert" ON wheels;
CREATE POLICY "wheels_insert" ON wheels 
  FOR INSERT 
  WITH CHECK (true);

-- Политика: обновление через сервисный ключ
DROP POLICY IF EXISTS "wheels_update" ON wheels;
CREATE POLICY "wheels_update" ON wheels 
  FOR UPDATE 
  USING (true);

-- Политика: удаление через сервисный ключ
DROP POLICY IF EXISTS "wheels_delete" ON wheels;
CREATE POLICY "wheels_delete" ON wheels 
  FOR DELETE 
  USING (true);

-- Функция обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_wheels_updated_at ON wheels;
CREATE TRIGGER update_wheels_updated_at
  BEFORE UPDATE ON wheels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
