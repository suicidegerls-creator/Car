#!/bin/bash

# =====================================================
# СКРИПТ ЭКСПОРТА ДАННЫХ ИЗ SUPABASE
# =====================================================
#
# Использование:
#   chmod +x 03-export-data.sh
#   ./03-export-data.sh
#
# Перед запуском:
#   1. Установите переменные окружения или введите вручную
#   2. Убедитесь что pg_dump установлен
#
# =====================================================

# Настройки подключения к Supabase
# Найдите эти данные в Supabase Dashboard -> Settings -> Database
SUPABASE_HOST="${SUPABASE_DB_HOST:-db.rjweozxjgkqavacrtlca.supabase.co}"
SUPABASE_PORT="${SUPABASE_DB_PORT:-5432}"
SUPABASE_USER="${SUPABASE_DB_USER:-postgres}"
SUPABASE_PASSWORD="${SUPABASE_DB_PASSWORD:-your_password_here}"
SUPABASE_DB="${SUPABASE_DB_NAME:-postgres}"

# Дата для имени файла
DATE=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="./backup_${DATE}"

echo "================================================"
echo "  ЭКСПОРТ ДАННЫХ DISKIBEL"
echo "================================================"
echo ""

# Создаем директорию для бэкапа
mkdir -p "$OUTPUT_DIR"

# Экспорт каждой таблицы отдельно (данные в формате INSERT)
echo "Экспортируем таблицы..."

TABLES=(
  "car_brands"
  "car_models"
  "wheels"
  "car_compatibility"
  "profiles"
  "favorites"
  "orders"
  "order_items"
  "support_requests"
  "user_discounts"
)

for TABLE in "${TABLES[@]}"; do
  echo "  -> $TABLE"
  PGPASSWORD="$SUPABASE_PASSWORD" pg_dump \
    -h "$SUPABASE_HOST" \
    -p "$SUPABASE_PORT" \
    -U "$SUPABASE_USER" \
    -d "$SUPABASE_DB" \
    --data-only \
    --column-inserts \
    --table="public.$TABLE" \
    -f "$OUTPUT_DIR/${TABLE}_data.sql" 2>/dev/null || echo "    (пустая или ошибка)"
done

# Полный дамп всех данных одним файлом
echo ""
echo "Создаем полный дамп данных..."
PGPASSWORD="$SUPABASE_PASSWORD" pg_dump \
  -h "$SUPABASE_HOST" \
  -p "$SUPABASE_PORT" \
  -U "$SUPABASE_USER" \
  -d "$SUPABASE_DB" \
  --data-only \
  --column-inserts \
  --schema=public \
  -f "$OUTPUT_DIR/full_data_dump.sql" 2>/dev/null

echo ""
echo "================================================"
echo "  ГОТОВО!"
echo "================================================"
echo ""
echo "Файлы сохранены в: $OUTPUT_DIR"
echo ""
echo "Для импорта в новую БД выполните:"
echo "  psql -h <new_host> -U postgres -d <database> -f $OUTPUT_DIR/full_data_dump.sql"
echo ""
