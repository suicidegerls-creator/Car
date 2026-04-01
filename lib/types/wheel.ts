// Re-export all options from constants
export {
  type WheelType,
  WHEEL_TYPE_LABELS,
  WHEEL_TYPES,
  DIAMETER_OPTIONS,
  WIDTH_OPTIONS,
  PCD_OPTIONS,
  ET_MIN,
  ET_MAX,
  ET_OPTIONS,
  CENTER_BORE_OPTIONS,
  BRAND_OPTIONS,
  BOLTS_COUNT_OPTIONS,
  COLOR_OPTIONS,
  FINISH_OPTIONS,
  MATERIAL_OPTIONS,
  COUNTRY_OPTIONS,
  CAR_BRANDS,
  CAR_YEARS,
  CAR_MODELS,
  CAR_MODIFICATIONS,
} from '@/lib/constants/wheel-options'

export interface CarCompatibility {
  id?: string
  wheel_id?: string
  car_brand: string
  car_model: string
  car_year_from?: number | null
  car_year_to?: number | null
  car_modification?: string | null
  all_models?: boolean
}

export interface Wheel {
  id: string
  name: string
  brand: string
  model: string | null
  sku: string | null
  description: string | null
  price: number
  old_price: number | null
  in_stock: boolean
  quantity: number
  wheel_type: 'forged' | 'cast' | 'stamped'
  diameter: number
  width: number
  pcd: string
  et: number
  center_bore: number
  bolts_count: number | null
  color: string | null
  finish: string | null
  material: string | null
  weight: number | null
  country: string | null
  images: string[]
  slug: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  car_compatibility?: CarCompatibility[]
}

export type WheelInsert = Omit<Wheel, 'id' | 'created_at' | 'updated_at'>
export type WheelUpdate = Partial<WheelInsert>
