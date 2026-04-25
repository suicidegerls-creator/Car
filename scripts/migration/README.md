# Миграция базы данных ДискиБел

## Файлы миграции

| Файл | Описание |
|------|----------|
| `01-create-tables.sql` | Создание всех таблиц и индексов |
| `02-rls-policies.sql` | RLS политики безопасности (только для Supabase) |
| `03-export-data.sh` | Скрипт экспорта данных из текущей БД |

## Пошаговая инструкция

### Шаг 1: Экспорт данных из Supabase

```bash
# Через Supabase Dashboard
# Settings -> Database -> Connection string -> URI
# Используйте pg_dump:

pg_dump "postgresql://postgres:[PASSWORD]@db.rjweozxjgkqavacrtlca.supabase.co:5432/postgres" \
  --data-only \
  --column-inserts \
  --schema=public \
  -f data_backup.sql
```

Или через скрипт:
```bash
chmod +x 03-export-data.sh
./03-export-data.sh
```

### Шаг 2: Создание таблиц в новой БД

**Вариант A: Через Prisma (рекомендуется)**
```bash
# Установите переменные окружения
export POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/dbname"
export POSTGRES_URL_NON_POOLING="postgresql://user:pass@host:5432/dbname"

# Создайте таблицы
npx prisma db push

# Сгенерируйте клиент
npx prisma generate
```

**Вариант B: Через SQL**
```bash
psql -h <host> -U postgres -d <database> -f 01-create-tables.sql
```

### Шаг 3: Импорт данных

```bash
psql -h <host> -U postgres -d <database> -f data_backup.sql
```

### Шаг 4: Настройка RLS (только для Supabase)

Если новая БД тоже Supabase:
```bash
psql -h <host> -U postgres -d <database> -f 02-rls-policies.sql
```

Если другой провайдер (Neon, Railway, etc.) - RLS политики не нужны, безопасность реализуется на уровне приложения.

### Шаг 5: Обновление переменных окружения

В Vercel Dashboard обновите:
- `POSTGRES_PRISMA_URL` - строка подключения для Prisma
- `POSTGRES_URL_NON_POOLING` - строка без пулинга
- `NEXT_PUBLIC_SUPABASE_URL` - URL новой Supabase (если используете)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - новый anon key

## Структура таблиц

| Таблица | Записей | Описание |
|---------|---------|----------|
| `car_brands` | ~191 | Марки автомобилей |
| `car_models` | ~1563 | Модели автомобилей |
| `wheels` | ~100+ | Каталог дисков |
| `car_compatibility` | - | Совместимость дисков с авто |
| `profiles` | - | Профили пользователей |
| `favorites` | - | Избранные товары |
| `orders` | - | Заказы |
| `order_items` | - | Позиции заказов |
| `support_requests` | - | Обращения в поддержку |
| `user_discounts` | - | Скидки колеса удачи |

## Проверка после миграции

```sql
-- Проверьте количество записей
SELECT 
  (SELECT COUNT(*) FROM car_brands) as brands,
  (SELECT COUNT(*) FROM car_models) as models,
  (SELECT COUNT(*) FROM wheels) as wheels,
  (SELECT COUNT(*) FROM orders) as orders;
```

## Возможные проблемы

### Ошибка: "relation already exists"
Таблицы уже созданы. Используйте `DROP TABLE IF EXISTS` или пропустите шаг создания.

### Ошибка: "auth.uid() does not exist"
RLS политики с `auth.uid()` работают только в Supabase. Для других БД удалите или измените эти политики.

### Ошибка: "type wheel_type does not exist"
Выполните `CREATE TYPE wheel_type AS ENUM (...)` из файла `01-create-tables.sql` отдельно.
