// Единый источник данных для фильтров каталога и формы добавления товаров
// Все значения синхронизированы между админкой и публичным каталогом

export type WheelType = 'forged' | 'cast' | 'stamped'

export const WHEEL_TYPE_LABELS: Record<WheelType, string> = {
  forged: 'Кованые',
  cast: 'Литые',
  stamped: 'Штампованные',
}

export const WHEEL_TYPES = Object.keys(WHEEL_TYPE_LABELS) as WheelType[]

// Диаметры дисков (R14-R22)
export const DIAMETER_OPTIONS = [14, 15, 16, 17, 18, 19, 20, 21, 22] as const

// Ширина дисков (J)
export const WIDTH_OPTIONS = [
  '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '12.0'
] as const

// Разболтовка (PCD)
export const PCD_OPTIONS = [
  '4x98', '4x100', '4x108', '4x114.3',
  '5x100', '5x108', '5x110', '5x112', '5x114.3', '5x120', '5x127', '5x130', '5x139.7',
  '6x114.3', '6x127', '6x139.7'
] as const

// Вылет (ET) - от -10 до 50
export const ET_MIN = -10
export const ET_MAX = 50
// Создаем массив строк для избежания проблем с пустыми значениями
export const ET_OPTIONS: string[] = Array.from(
  { length: ET_MAX - ET_MIN + 1 },
  (_, i) => String(ET_MIN + i)
)

// Диаметр центрального отверстия (ЦО)
export const CENTER_BORE_OPTIONS = [
  '54.1', '56.1', '56.6', '57.1', '58.1', '60.1', '63.4', '64.1', '66.1', '66.6',
  '67.1', '71.6', '72.6', '73.1', '74.1', '78.1', '84.1', '95.1', '106.1', '108.1'
] as const

// Производители дисков
export const BRAND_OPTIONS = [
  // Премиум
  'BBS', 'OZ Racing', 'Enkei', 'Vossen', 'Rotiform', 'HRE', 'Advan',
  'Work Wheels', 'Rays', 'TWS', 'Weds', 'SSR',
  // Средний сегмент
  'American Racing', 'Fuel', 'XD Series', 'Moto Metal', 'KMC', 'TSW', 'Niche',
  'Vorsteiner', 'Ferrada', 'Stance', 'Avant Garde',
  // Бюджетный сегмент / СНГ
  'SKAD', 'K&K', 'LS Wheels', 'Replica', 'Nitro', 'X-Race', 'Alcasta',
  'Remain', 'Trebl', 'Magnetto', 'Штамп', 'Tech-Line'
] as const

// Количество болтов
export const BOLTS_COUNT_OPTIONS = [4, 5, 6] as const

// Цвета дисков
export const COLOR_OPTIONS = [
  'Черный',
  'Черный матовый',
  'Черный глянцевый',
  'Серебристый',
  'Серый',
  'Графит',
  'Белый',
  'Золотой',
  'Бронзовый',
  'Хром',
  'Полированный',
  'Черный с полировкой',
  'Серый с полировкой',
  'Gunmetal',
  'Антрацит',
] as const

// Покрытие/финиш
export const FINISH_OPTIONS = [
  'Глянцевое',
  'Матовое',
  'Сатин',
  'Полировка',
  'Хромирование',
  'Алмазная проточка',
  'Brushed (шлифованное)',
  'Порошковая окраска',
] as const

// Материал
export const MATERIAL_OPTIONS = [
  'Алюминиевый сплав',
  'Магниевый сплав',
  'Сталь',
  'Карбон',
] as const

// Страна производства
export const COUNTRY_OPTIONS = [
  'Беларусь',
  'Германия',
  'Япония',
  'Италия',
  'США',
  'Китай',
  'Тайвань',
  'Южная Корея',
  'Польша',
  'Турция',
  'Россия',
] as const

// Данные для поиска по автомобилю
export const CAR_BRANDS = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda',
  'Mazda', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'Chevrolet',
  'Skoda', 'Lexus', 'Porsche', 'Land Rover', 'Volvo', 'Subaru',
  'Lada', 'Renault', 'Peugeot', 'Citroen', 'Opel', 'Mitsubishi',
  'Suzuki', 'Infiniti', 'Acura', 'Cadillac', 'Jeep', 'Dodge'
] as const

export const CAR_YEARS = Array.from({ length: 30 }, (_, i) => String(2025 - i))

export const CAR_MODELS: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'RS7', 'e-tron'],
  'BMW': ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5', 'iX'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQS'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Arteon', 'ID.4', 'ID.5', 'Jetta'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Highlander', 'Prius', 'Supra', 'Crown'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Odyssey'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30', 'MX-5'],
  'Nissan': ['Qashqai', 'X-Trail', 'Juke', 'Leaf', 'GT-R', 'Patrol'],
  'Hyundai': ['Tucson', 'Santa Fe', 'Sonata', 'Elantra', 'Kona', 'Palisade'],
  'Kia': ['Sportage', 'Sorento', 'Ceed', 'Stinger', 'EV6', 'Carnival'],
  'Ford': ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Mustang', 'Bronco'],
  'Chevrolet': ['Cruze', 'Malibu', 'Camaro', 'Tahoe', 'Silverado', 'Traverse'],
  'Skoda': ['Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Fabia', 'Kamiq'],
  'Lexus': ['IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'LX', 'UX'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster'],
  'Land Rover': ['Range Rover', 'Discovery', 'Defender', 'Evoque', 'Velar', 'Sport'],
  'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
  'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'WRX', 'BRZ'],
  'Lada': ['Vesta', 'Granta', 'Largus', 'Niva', 'XRAY'],
  'Renault': ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Arkana', 'Megane'],
  'Peugeot': ['208', '308', '408', '508', '2008', '3008', '5008'],
  'Citroen': ['C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross'],
  'Opel': ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Grandland'],
  'Mitsubishi': ['Outlander', 'ASX', 'Pajero', 'Eclipse Cross', 'L200'],
  'Suzuki': ['Vitara', 'SX4', 'Jimny', 'Swift'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  'Acura': ['TLX', 'RDX', 'MDX', 'NSX'],
  'Cadillac': ['CT5', 'CT6', 'XT4', 'XT5', 'Escalade'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade'],
  'Dodge': ['Challenger', 'Charger', 'Durango']
}

export const CAR_MODIFICATIONS = [
  '1.4 TSI', '1.5 TSI', '1.6 TDI', '1.8 TSI', '2.0 TSI', '2.0 TDI',
  '2.0 TFSI', '2.5 TFSI', '3.0 TDI', '3.0 TFSI',
  '1.6', '1.8', '2.0', '2.4', '2.5', '3.0', '3.5',
  '2.0 Turbo', '2.5 Turbo', '3.0 Turbo',
  'Hybrid', 'PHEV', 'Electric'
] as const
